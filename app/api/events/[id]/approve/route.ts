import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Update event approval status
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { isApproved: true },
      include: {
        venue: true,
        createdBy: true,
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error approving event:', error)
    return NextResponse.json({ error: 'Failed to approve event' }, { status: 500 })
  }
}
