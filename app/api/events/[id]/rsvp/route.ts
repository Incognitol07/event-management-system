import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    const { status, userId } = await request.json()
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    if (!status || !userId) {
      return NextResponse.json({ error: 'Missing status or userId' }, { status: 400 })
    }

    if (!['ACCEPTED', 'DECLINED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Check if event exists and is approved
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            rsvps: {
              where: {
                status: 'ACCEPTED'
              }
            }
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.isApproved) {
      return NextResponse.json({ error: 'Cannot RSVP to unapproved event' }, { status: 400 })
    }

    // Check if event is full (only if trying to accept)
    if (status === 'ACCEPTED' && event._count.rsvps >= event.capacity) {
      // Check if user already has an accepted RSVP
      const existingRSVP = await prisma.eventRSVP.findUnique({
        where: {
          eventId_userId: {
            eventId: eventId,
            userId: userId
          }
        }
      })

      if (!existingRSVP || existingRSVP.status !== 'ACCEPTED') {
        return NextResponse.json({ error: 'Event is full' }, { status: 400 })
      }
    }

    // Create or update RSVP
    const rsvp = await prisma.eventRSVP.upsert({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      update: {
        status: status,
        rsvpAt: new Date()
      },
      create: {
        eventId: eventId,
        userId: userId,
        status: status,
        rsvpAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        },
        event: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    return NextResponse.json(rsvp)
  } catch (error) {
    console.error('Error updating RSVP:', error)
    return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 })
  }
}
