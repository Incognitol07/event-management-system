import { PrismaClient, Role, Priority, ResourceCategory } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {  // Clear existing data
  await prisma.feedback.deleteMany()
  await prisma.eventRSVP.deleteMany()
  await prisma.eventResource.deleteMany()
  await prisma.event.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@university.edu',
      role: Role.ADMIN,
    },
  })

  const coordinator = await prisma.user.create({
    data: {
      name: 'John Coordinator',
      email: 'coordinator@university.edu',
      role: Role.STAFF,
    },
  })

  const student1 = await prisma.user.create({
    data: {
      name: 'Alice Student',
      email: 'alice@university.edu',
      role: Role.STUDENT,
      matricNo: 'ST001',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: 'Bob Student',
      email: 'bob@university.edu',
      role: Role.STUDENT,
      matricNo: 'ST002',
    },
  })

  // Create venues
  const venue1 = await prisma.venue.create({
    data: {
      name: 'Main Auditorium',
      capacity: 500,
    },
  })

  const venue2 = await prisma.venue.create({
    data: {
      name: 'Conference Room A',
      capacity: 50,
    },
  })
  const venue3 = await prisma.venue.create({
    data: {
      name: 'Library Hall',
      capacity: 200,
    },
  })

  // Create resources
  const projector = await prisma.resource.create({
    data: {
      name: 'HD Projector',
      description: 'High-definition projector suitable for large auditoriums',
      category: ResourceCategory.AUDIO_VISUAL,
      totalCount: 5,
    },
  })

  const microphone = await prisma.resource.create({
    data: {
      name: 'Wireless Microphone',
      description: 'Professional wireless microphone system',
      category: ResourceCategory.AUDIO_VISUAL,
      totalCount: 10,
    },
  })

  const tables = await prisma.resource.create({
    data: {
      name: 'Round Tables',
      description: 'Round tables that seat 8 people each',
      category: ResourceCategory.FURNITURE,
      totalCount: 20,
    },
  })

  const chairs = await prisma.resource.create({
    data: {
      name: 'Plastic Chairs',
      description: 'Standard plastic chairs for events',
      category: ResourceCategory.FURNITURE,
      totalCount: 200,
    },
  })

  const avTechnician = await prisma.resource.create({
    data: {
      name: 'AV Technician',
      description: 'Audio-visual technical support specialist',
      category: ResourceCategory.TECHNICAL_STAFF,
      totalCount: 3,
    },
  })

  const securityGuard = await prisma.resource.create({
    data: {
      name: 'Security Personnel',
      description: 'Trained security guards for event safety',
      category: ResourceCategory.SECURITY,
      totalCount: 8,
    },
  })

  const transportBus = await prisma.resource.create({
    data: {
      name: 'University Bus',
      description: '50-seater bus for off-campus events',
      category: ResourceCategory.TRANSPORTATION,
      totalCount: 2,
    },
  })

  const cateringTables = await prisma.resource.create({
    data: {
      name: 'Catering Tables',
      description: 'Long tables for food service and buffet setup',
      category: ResourceCategory.CATERING,
      totalCount: 15,
    },
  })

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: 'Annual Science Fair',
      description: 'A showcase of innovative science projects by students and faculty. Come explore cutting-edge research and exciting discoveries.',
      date: new Date('2025-07-15'),
      startTime: '09:00',
      endTime: '17:00',
      venueId: venue1.id,
      capacity: 400,
      memo: 'This is a major annual event requiring approval from the Dean. All safety protocols must be followed.',
      isApproved: true,
      priority: Priority.HIGH,
      createdById: coordinator.id,
    },
  })

  const event2 = await prisma.event.create({
    data: {
      title: 'Weekly Study Group',
      description: 'Join fellow students for collaborative learning and exam preparation in Computer Science.',
      date: new Date('2025-06-25'),
      startTime: '14:00',
      endTime: '16:00',
      venueId: venue2.id,
      capacity: 30,
      memo: 'Regular weekly meeting, pre-approved for the semester.',
      isApproved: true,
      priority: Priority.NORMAL,
      createdById: student1.id,
    },
  })

  const event3 = await prisma.event.create({
    data: {
      title: 'Emergency Faculty Meeting',
      description: 'Urgent discussion regarding upcoming semester changes and COVID-19 protocols.',
      date: new Date('2025-06-22'),
      startTime: '10:00',
      endTime: '12:00',
      venueId: venue3.id,
      capacity: 100,
      memo: 'Emergency meeting called by the Dean due to urgent policy changes.',
      isApproved: true,
      priority: Priority.EMERGENCY,
      createdById: admin.id,
    },
  })

  // Create RSVPs
  await prisma.eventRSVP.create({
    data: {
      eventId: event1.id,
      userId: student1.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event1.id,
      userId: student2.id,
      status: 'ACCEPTED',
    },
  })
  await prisma.eventRSVP.create({
    data: {
      eventId: event2.id,
      userId: student2.id,
      status: 'ACCEPTED',
    },
  })

  // Create resource allocations
  // Science Fair resources
  await prisma.eventResource.create({
    data: {
      eventId: event1.id,
      resourceId: projector.id,
      quantityNeeded: 2,
      status: 'APPROVED',
      notes: 'For main presentation and demo stations',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event1.id,
      resourceId: microphone.id,
      quantityNeeded: 3,
      status: 'APPROVED',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event1.id,
      resourceId: tables.id,
      quantityNeeded: 10,
      status: 'APPROVED',
      notes: 'For project displays',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event1.id,
      resourceId: securityGuard.id,
      quantityNeeded: 2,
      status: 'APPROVED',
      notes: 'For crowd control and security',
    },
  })

  // Study Group resources
  await prisma.eventResource.create({
    data: {
      eventId: event2.id,
      resourceId: projector.id,
      quantityNeeded: 1,
      status: 'APPROVED',
    },
  })

  // Faculty Meeting resources
  await prisma.eventResource.create({
    data: {
      eventId: event3.id,
      resourceId: microphone.id,
      quantityNeeded: 1,
      status: 'APPROVED',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event3.id,
      resourceId: avTechnician.id,
      quantityNeeded: 1,
      status: 'APPROVED',
      notes: 'For video conferencing setup',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
