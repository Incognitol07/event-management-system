import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: {
        createdById: userId,
      },
      include: {
        venue: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        rsvps: {
          select: {
            status: true,
          },
        },
        feedback: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        resources: {
          include: {
            resource: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
