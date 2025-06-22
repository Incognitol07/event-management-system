import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    // Get user ID from headers
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the event exists and get organizer/creator info
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizers: {
          include: {
            user: {
              select: { id: true, role: true }
            }
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if user has permission to delete this event
    const currentUserId = parseInt(userId);
    const isCreator = event.createdById === currentUserId;
    const isOrganizer = event.organizers?.some(org => 
      org.userId === currentUserId && 
      (org.role === 'PRIMARY_ORGANIZER' || org.role === 'CO_ORGANIZER')
    );

    // Get user role to check if admin
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true }
    });
    const isAdmin = user?.role === 'ADMIN';

    if (!isCreator && !isOrganizer && !isAdmin) {
      return NextResponse.json(
        { error: 'Only event organizers, creators, or admins can delete events' }, 
        { status: 403 }
      )
    }

    // Delete the event (this will cascade delete related records including resource allocations)
    await prisma.event.delete({
      where: { id: eventId },
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
