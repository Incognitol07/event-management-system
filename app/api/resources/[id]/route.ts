import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/resources/[id] - Get specific resource with allocations
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id);
    
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        eventResources: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                date: true,
                startTime: true,
                endTime: true,
                venue: {
                  select: {
                    name: true,
                  },
                },
                createdBy: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Update resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id);
    const body = await request.json();
    const { name, description, category, totalCount, isActive } = body;

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(totalCount && { totalCount: parseInt(totalCount) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id);

    // Check if resource has active allocations
    const activeAllocations = await prisma.eventResource.findMany({
      where: {
        resourceId,
        status: 'APPROVED',
        event: {
          date: {
            gte: new Date(),
          },
        },
      },
    });

    if (activeAllocations.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete resource with active allocations' },
        { status: 400 }
      );
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
