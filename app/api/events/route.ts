import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    let whereCondition = {}
    
    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0)
      
      whereCondition = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }
    }

    const events = await prisma.event.findMany({
      where: whereCondition,
      include: {
        venue: true,
        createdBy: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
      // Validate required fields
    if (!data.title || !data.date || !data.startTime || !data.endTime || !data.venueId || !data.createdById) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
    }

    // Validate description length (300 words max)
    const wordCount = data.description?.split(/\s+/).length || 0
    if (wordCount > 300) {
      return NextResponse.json(
        { error: 'Description cannot exceed 300 words' },
        { status: 400 }
      )
    }

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
        isApproved: data.isApproved || false,
        createdById: data.createdById,
      },
      include: {
        venue: true,
        createdBy: true,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
