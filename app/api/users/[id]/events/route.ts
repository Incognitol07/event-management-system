import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const userId = parseInt(awaitedParams.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    // Get all RSVPs for the user with event details and existing feedback
    const userRSVPs = await prisma.eventRSVP.findMany({
      where: { 
        userId: userId,
        status: 'ACCEPTED' // Only show accepted events
      },
      include: {
        event: {
          include: {
            venue: {
              select: {
                name: true
              }
            },
            createdBy: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        event: {
          date: 'desc'
        }
      }
    })

    // Get feedback for these events
    const eventIds = userRSVPs.map(rsvp => rsvp.event.id)
    const feedbacks = await prisma.feedback.findMany({
      where: {
        eventId: { in: eventIds },
        userId: userId
      }
    })

    // Combine RSVPs with feedback data
    const result = userRSVPs.map(rsvp => ({
      ...rsvp,
      feedback: feedbacks.find(f => f.eventId === rsvp.event.id) || null
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching user events:', error)
    return NextResponse.json({ error: 'Failed to fetch user events' }, { status: 500 })
  }
}
