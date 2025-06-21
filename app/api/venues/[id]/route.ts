import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venueId = parseInt(params.id)
    
    if (isNaN(venueId)) {
      return NextResponse.json({ error: 'Invalid venue ID' }, { status: 400 })
    }

    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        events: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
              }
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
          orderBy: {
            date: 'desc'
          }
        },
        _count: {
          select: {
            events: true
          }
        }
      },
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    return NextResponse.json(venue)
  } catch (error) {
    console.error('Error fetching venue:', error)
    return NextResponse.json({ error: 'Failed to fetch venue' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venueId = parseInt(params.id)
    const { name, capacity } = await request.json()
    
    if (isNaN(venueId)) {
      return NextResponse.json({ error: 'Invalid venue ID' }, { status: 400 })
    }

    if (!name || !capacity || capacity < 1) {
      return NextResponse.json({ error: 'Name and valid capacity are required' }, { status: 400 })
    }

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: venueId }
    })

    if (!existingVenue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // Update venue
    const updatedVenue = await prisma.venue.update({
      where: { id: venueId },
      data: {
        name: name.trim(),
        capacity: parseInt(capacity)
      },
      include: {
        events: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
              }
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
          orderBy: {
            date: 'desc'
          }
        },
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    return NextResponse.json(updatedVenue)
  } catch (error) {
    console.error('Error updating venue:', error)
    return NextResponse.json({ error: 'Failed to update venue' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venueId = parseInt(params.id)
    
    if (isNaN(venueId)) {
      return NextResponse.json({ error: 'Invalid venue ID' }, { status: 400 })
    }

    // Check if venue exists and has events
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    if (venue._count.events > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete venue with existing events',
        message: 'This venue has events associated with it and cannot be deleted. Please remove or reassign all events first.'
      }, { status: 400 })
    }

    // Delete venue
    await prisma.venue.delete({
      where: { id: venueId }
    })

    return NextResponse.json({ message: 'Venue deleted successfully' })
  } catch (error) {
    console.error('Error deleting venue:', error)
    return NextResponse.json({ error: 'Failed to delete venue' }, { status: 500 })
  }
}
