import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id);
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }    // Check if user has an accepted RSVP for this event
    const rsvp = await prisma.eventRSVP.findFirst({
      where: {
        eventId: eventId,
        userId: parseInt(userId),
        status: 'ACCEPTED'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            matricNo: true,
            role: true
          }
        },
        event: {
          include: {
            venue: true,
            organizers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    role: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!rsvp) {
      return NextResponse.json(
        { error: 'No valid ticket found. You must register and be accepted for this event.' },
        { status: 404 }
      );
    }

    // Generate unique ticket number
    const ticketNumber = `T${eventId}-${userId}-${rsvp.id}-${Date.now().toString(36).toUpperCase()}`;    const ticketData = {
      event: {
        id: rsvp.event.id,
        title: rsvp.event.title,
        description: rsvp.event.description,
        date: rsvp.event.date.toISOString(),
        startTime: rsvp.event.startTime,
        endTime: rsvp.event.endTime,
        venue: rsvp.event.venue,
        capacity: rsvp.event.capacity,
        priority: rsvp.event.priority,
        category: rsvp.event.category,
        department: rsvp.event.department,
        organizers: rsvp.event.organizers
      },
      user: rsvp.user,
      rsvp: {
        id: rsvp.id,
        status: rsvp.status,
        rsvpAt: rsvp.rsvpAt.toISOString()
      },
      ticketNumber
    };

    return NextResponse.json(ticketData);
  } catch (error) {
    console.error('Error generating ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
