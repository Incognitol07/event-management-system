import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'
import { calculateRecurringInstances } from '@/lib/recurring-events'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const currentTime = now.toTimeString().slice(0, 8) // HH:MM:SS format

    let whereCondition: any = {
      OR: [
        // Events in the future
        {
          date: {
            gt: today,
          },
        },
        // Events today that haven't ended yet
        {
          date: today,
          endTime: {
            gt: currentTime,
          },
        },
      ],
    }
    
    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0)
      
      whereCondition = {
        AND: [
          {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            OR: [
              // Events in the future
              {
                date: {
                  gt: today,
                },
              },
              // Events today that haven't ended yet
              {
                date: today,
                endTime: {
                  gt: currentTime,
                },
              },
            ],
          },
        ],
      }
    }
    const events = await prisma.event.findMany({
      where: whereCondition,
      include: {
        venue: true,
        createdBy: true,
        organizers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            role: 'asc', // PRIMARY_ORGANIZER first, then CO_ORGANIZER
          },
        },
        resources: {
          include: {
            resource: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Add recurring instances if month filter is provided
    let allEvents = [...events]
    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0)      // Find all recurring events that might have instances in this month
      const recurringEvents = await prisma.event.findMany({
        where: {
          AND: [
            {
              isRecurring: true,
            },
            {
              OR: [
                { date: { lte: endDate } }, // Started before or during this month
                { recurrenceEnd: { gte: startDate } }, // Ends after this month starts
                { recurrenceEnd: null }, // No end date
              ],
            },
            // Only include recurring events that haven't completely passed
            {
              OR: [
                // Events in the future
                {
                  date: {
                    gt: today,
                  },
                },
                // Events today that haven't ended yet
                {
                  date: today,
                  endTime: {
                    gt: currentTime,
                  },
                },
                // Recurring events with end date in the future
                {
                  recurrenceEnd: {
                    gte: today,
                  },
                },
                // Recurring events with no end date
                {
                  recurrenceEnd: null,
                },
              ],
            },
          ],
        },
        include: {
          venue: true,
          createdBy: true,
          organizers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          resources: {
            include: {
              resource: {
                select: {
                  name: true,
                  category: true,
                },
              },
            },
          },
        },
      })

      // Generate virtual instances for recurring events
      for (const recurringEvent of recurringEvents) {
        const instances = calculateRecurringInstances(
          recurringEvent as any,
          startDate,
          endDate
        )        // Convert virtual instances to event format
        const virtualEvents = instances
          .filter(instance => {
            const instanceDate = new Date(instance.instanceDate.getFullYear(), instance.instanceDate.getMonth(), instance.instanceDate.getDate())
            const instanceEndTime = recurringEvent.endTime
            
            // Filter out instances that have already passed
            return instanceDate > today || 
                   (instanceDate.getTime() === today.getTime() && instanceEndTime > currentTime)
          })
          .map(instance => ({
            ...recurringEvent,
            id: parseInt(`${recurringEvent.id}${instance.instanceDate.getFullYear()}${(instance.instanceDate.getMonth() + 1).toString().padStart(2, '0')}${instance.instanceDate.getDate().toString().padStart(2, '0')}`), // Create unique numeric ID
            date: instance.instanceDate,
            isRecurringInstance: true,
            parentEventId: recurringEvent.id,
          }))

        allEvents = [...allEvents, ...virtualEvents]
      }

      // Sort all events by date
      allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    return NextResponse.json(allEvents)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()    // Validate required fields
    if (!data.title || !data.date || !data.startTime || !data.endTime || !data.venueId || !data.createdById) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get venue details to check capacity
    const venue = await prisma.venue.findUnique({
      where: { id: data.venueId }
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // Check if event capacity exceeds venue capacity
    if (data.capacity > venue.capacity) {
      return NextResponse.json(
        { 
          error: `Event capacity (${data.capacity}) cannot exceed venue capacity (${venue.capacity})`,
          venueCapacity: venue.capacity 
        },
        { status: 400 }
      )
    }

    // Check for time/venue conflicts
    const conflictingEvent = await prisma.event.findFirst({
      where: {
        venueId: data.venueId,
        date: new Date(data.date),
        AND: [
          {
            OR: [
              {
                startTime: {
                  lte: data.endTime,
                },
                endTime: {
                  gte: data.startTime,
                },
              },
            ],
          },
        ],
        isApproved: true,
      },
    })

    if (conflictingEvent) {
      return NextResponse.json(
        { error: 'Time/venue conflict detected with existing event' },
        { status: 409 }
      )
    }    // Validate description length (300 words max)
    const wordCount = data.description?.split(/\s+/).length || 0
    if (wordCount > 300) {
      return NextResponse.json(
        { error: 'Description cannot exceed 300 words' },
        { status: 400 }
      )
    }    // Handle recurring events - just store the template, instances will be calculated dynamically
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || '',
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        venueId: data.venueId,
        capacity: data.capacity,
        memo: data.memo || '',
        priority: data.priority || 'NORMAL',
        category: data.category || 'ACADEMIC',
        department: data.department || null,
        isApproved: data.isApproved || false,
        createdById: data.createdById,
        isRecurring: data.isRecurring || false,
        recurrenceType: data.isRecurring ? data.recurrenceType : null,
        recurrenceEnd: data.isRecurring && data.recurrenceEnd ? new Date(data.recurrenceEnd) : null,
        // Create the primary organizer relationship
        organizers: {
          create: {
            userId: data.createdById,
            role: 'PRIMARY_ORGANIZER',
          },
        },
      },
      include: {
        venue: true,
        createdBy: true,
        organizers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
