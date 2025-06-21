import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

// GET /api/events/[id]/organizers - Get all organizers for an event
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

    const organizers = await prisma.eventOrganizer.findMany({
      where: { eventId },
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
        role: 'asc', // PRIMARY_ORGANIZER first
      },
    })

    return NextResponse.json(organizers)
  } catch (error) {
    console.error('Error fetching organizers:', error)
    return NextResponse.json({ error: 'Failed to fetch organizers' }, { status: 500 })
  }
}

// POST /api/events/[id]/organizers - Add a co-organizer to an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id)
    const { userId, addedBy } = await request.json()
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizers: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if user is already an organizer
    const existingOrganizer = await prisma.eventOrganizer.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    })

    if (existingOrganizer) {
      return NextResponse.json({ error: 'User is already an organizer for this event' }, { status: 409 })
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Add the co-organizer
    const newOrganizer = await prisma.eventOrganizer.create({
      data: {
        eventId,
        userId,
        role: 'CO_ORGANIZER',
        addedBy,
      },
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
    })

    return NextResponse.json(newOrganizer, { status: 201 })
  } catch (error) {
    console.error('Error adding organizer:', error)
    return NextResponse.json({ error: 'Failed to add organizer' }, { status: 500 })
  }
}

// DELETE /api/events/[id]/organizers?userId=123 - Remove a co-organizer from an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id)
    const { searchParams } = new URL(request.url)
    const userId = parseInt(searchParams.get('userId') || '')
    
    if (isNaN(eventId) || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid event ID or user ID' }, { status: 400 })
    }

    // Check if the organizer exists and is not the primary organizer
    const organizer = await prisma.eventOrganizer.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    })

    if (!organizer) {
      return NextResponse.json({ error: 'Organizer relationship not found' }, { status: 404 })
    }

    if (organizer.role === 'PRIMARY_ORGANIZER') {
      return NextResponse.json({ error: 'Cannot remove primary organizer' }, { status: 403 })
    }

    // Remove the co-organizer
    await prisma.eventOrganizer.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    })

    return NextResponse.json({ message: 'Organizer removed successfully' })
  } catch (error) {
    console.error('Error removing organizer:', error)
    return NextResponse.json({ error: 'Failed to remove organizer' }, { status: 500 })
  }
}
