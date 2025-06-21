import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        _count: {
          select: {
            events: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(venues)
  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, capacity } = await request.json()

    if (!name || !capacity || capacity < 1) {
      return NextResponse.json({ error: 'Name and valid capacity are required' }, { status: 400 })
    }    // Check if venue name already exists
    const existingVenue = await prisma.venue.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingVenue) {
      return NextResponse.json({ error: 'A venue with this name already exists' }, { status: 400 })
    }

    const venue = await prisma.venue.create({
      data: {
        name: name.trim(),
        capacity: parseInt(capacity)
      },
      include: {
        _count: {
          select: {
            events: true
          }
        }
      }
    })

    return NextResponse.json(venue, { status: 201 })
  } catch (error) {
    console.error('Error creating venue:', error)
    return NextResponse.json({ error: 'Failed to create venue' }, { status: 500 })
  }
}
