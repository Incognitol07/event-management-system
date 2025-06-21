// Script to migrate existing events to the new many-to-many organizer system
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function migrateOrganizers() {
  try {
    console.log('Starting organizer migration...')

    // Get all existing events
    const events = await prisma.event.findMany({
      select: {
        id: true,
        createdById: true,
      },
    })

    console.log(`Found ${events.length} events to migrate`)

    // Create EventOrganizer records for all existing events
    for (const event of events) {
      await prisma.eventOrganizer.upsert({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: event.createdById,
          },
        },
        update: {
          role: 'PRIMARY_ORGANIZER',
        },
        create: {
          eventId: event.id,
          userId: event.createdById,
          role: 'PRIMARY_ORGANIZER',
        },
      })
    }

    console.log('Migration completed successfully!')
    console.log(`Created EventOrganizer records for ${events.length} events`)
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateOrganizers()
  .then(() => {
    console.log('All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
