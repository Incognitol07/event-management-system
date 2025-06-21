import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../../generated/prisma';

const prisma = new PrismaClient();

// PUT /api/events/[id]/resources/[resourceId]/approve - Approve resource allocation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; resourceId: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const resourceId = parseInt(params.resourceId);

    const eventResource = await prisma.eventResource.update({
      where: {
        eventId_resourceId: {
          eventId,
          resourceId,
        },
      },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        // TODO: Add approvedBy from authenticated user
      },
      include: {
        resource: true,
        event: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(eventResource);
  } catch (error) {
    console.error('Error approving resource allocation:', error);
    return NextResponse.json(
      { error: 'Failed to approve resource allocation' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/resources/[resourceId] - Remove resource allocation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; resourceId: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const resourceId = parseInt(params.resourceId);

    await prisma.eventResource.delete({
      where: {
        eventId_resourceId: {
          eventId,
          resourceId,
        },
      },
    });

    return NextResponse.json({ message: 'Resource allocation removed' });
  } catch (error) {
    console.error('Error removing resource allocation:', error);
    return NextResponse.json(
      { error: 'Failed to remove resource allocation' },
      { status: 500 }
    );
  }
}
