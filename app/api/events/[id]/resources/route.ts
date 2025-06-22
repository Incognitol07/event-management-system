import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

// POST /api/events/[id]/resources - Allocate resources to an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id);
    const body = await request.json();
    const { resourceId, quantityNeeded, notes } = body;

    // Get user ID from headers
    const userId = request.headers.get('x-user-id');
    
    if (!resourceId || !quantityNeeded) {
      return NextResponse.json(
        { error: 'Resource ID and quantity are required' },
        { status: 400 }
      );
    }

    // Get user to check if they're admin
    let isAdmin = false;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { role: true }
      });
      isAdmin = user?.role === 'ADMIN';
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if resource exists and has enough availability
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        eventResources: {
          where: {
            status: 'APPROVED',
            event: {
              date: event.date, // Check for same date conflicts
            },
          },
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }    // Calculate allocated quantity for the same date
    const allocatedQuantity = resource.eventResources.reduce(
      (sum: number, allocation: any) => sum + allocation.quantityNeeded,
      0
    );

    const availableQuantity = resource.totalCount - allocatedQuantity;

    if (quantityNeeded > availableQuantity) {
      return NextResponse.json(
        { 
          error: `Not enough resources available. Requested: ${quantityNeeded}, Available: ${availableQuantity}` 
        },
        { status: 400 }
      );
    }    // Create or update resource allocation
    const eventResource = await prisma.eventResource.upsert({
      where: {
        eventId_resourceId: {
          eventId,
          resourceId,
        },
      },
      update: {
        quantityNeeded,
        notes,
        status: isAdmin ? 'APPROVED' : 'PENDING', // Auto-approve for admins
      },
      create: {
        eventId,
        resourceId,
        quantityNeeded,
        notes,
        status: isAdmin ? 'APPROVED' : 'PENDING', // Auto-approve for admins
      },
      include: {
        resource: true,
      },
    });

    return NextResponse.json(eventResource, { status: 201 });
  } catch (error) {
    console.error('Error allocating resource:', error);
    return NextResponse.json(
      { error: 'Failed to allocate resource' },
      { status: 500 }
    );
  }
}

// GET /api/events/[id]/resources - Get all resources for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id);

    const eventResources = await prisma.eventResource.findMany({
      where: { eventId },
      include: {
        resource: {
          include: {
            eventResources: {
              where: {
                status: 'APPROVED',
                event: {
                  date: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add calculated fields to resources
    const resourcesWithCalculatedFields = eventResources.map(eventResource => ({
      ...eventResource,
      resource: {
        ...eventResource.resource,
        allocatedCount: eventResource.resource.eventResources.reduce(
          (sum: number, allocation: any) => sum + allocation.quantityNeeded,
          0
        ),
        availableCount: eventResource.resource.totalCount - eventResource.resource.eventResources.reduce(
          (sum: number, allocation: any) => sum + allocation.quantityNeeded,
          0
        ),
        eventResources: undefined, // Remove the nested allocation data
      },
    }));

    return NextResponse.json(resourcesWithCalculatedFields);
  } catch (error) {
    console.error('Error fetching event resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event resources' },
      { status: 500 }
    );
  }
}
