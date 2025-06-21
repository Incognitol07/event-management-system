import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id)
    const { userId, rating, comment } = await request.json()
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    if (!userId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid userId and rating (1-5) are required' }, { status: 400 })
    }

    // Check if event exists and user attended it
    const eventRSVP = await prisma.eventRSVP.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: parseInt(userId)
        }
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true
          }
        }
      }
    })

    if (!eventRSVP) {
      return NextResponse.json({ error: 'User did not attend this event' }, { status: 400 })
    }

    if (eventRSVP.status !== 'ACCEPTED') {
      return NextResponse.json({ error: 'User did not attend this event' }, { status: 400 })
    }

    // Check if event has passed
    const eventDate = new Date(eventRSVP.event.date)
    if (eventDate >= new Date()) {
      return NextResponse.json({ error: 'Cannot provide feedback for future events' }, { status: 400 })
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: parseInt(userId)
        }
      }
    })

    if (existingFeedback) {
      return NextResponse.json({ error: 'Feedback already submitted for this event' }, { status: 400 })
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        eventId: eventId,
        userId: parseInt(userId),
        rating: parseInt(rating),
        comment: comment ? comment.trim() : null
      },
      include: {
        event: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    // Get all feedback for the event
    const feedback = await prisma.feedback.findMany({
      where: { eventId: eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}
