import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/resources - Fetch all resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    const resources = await prisma.resource.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(active !== null && { isActive: active === 'true' }),
      },
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
              },
            },
          },
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
      orderBy: {
        category: 'asc',
      },
    });

    // Calculate available quantity for each resource
    const resourcesWithAvailability = resources.map(resource => {
      const allocatedQuantity = resource.eventResources.reduce(
        (sum, allocation) => sum + allocation.quantityNeeded,
        0
      );
      
      return {
        ...resource,
        availableCount: resource.totalCount - allocatedQuantity,
        allocatedCount: allocatedQuantity,
        eventResources: undefined, // Remove detailed allocation info from list view
      };
    });

    return NextResponse.json(resourcesWithAvailability);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, totalCount } = body;

    if (!name || !category || !totalCount) {
      return NextResponse.json(
        { error: 'Name, category, and total count are required' },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        name,
        description,
        category,
        totalCount: parseInt(totalCount),
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
