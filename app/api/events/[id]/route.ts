import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        venue: true,
        createdBy: true,
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            rsvps: {
              where: {
                status: 'ACCEPTED'
              }
            }
          }
        }
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
