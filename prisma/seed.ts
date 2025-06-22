import { PrismaClient, Role, Priority, ResourceCategory } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {  // Clear existing data
  await prisma.feedback.deleteMany()
  await prisma.eventRSVP.deleteMany()
  await prisma.eventResource.deleteMany()
  await prisma.eventOrganizer.deleteMany() // Clear organizer relationships
  await prisma.event.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@cu.edu.ng',
      role: Role.ADMIN,
    },
  })
  const coordinator = await prisma.user.create({
    data: {
      name: 'John Coordinator',
      email: 'coordinator@cu.edu.ng',
      role: Role.ORGANIZER,
    },
  })

  const coordinator2 = await prisma.user.create({
    data: {
      name: 'Sarah Events Manager',
      email: 'sarah@cu.edu.ng',
      role: Role.ORGANIZER,
    },
  })
  const student1 = await prisma.user.create({
    data: {
      name: 'Alice Student',
      email: 'alice@cu.edu.ng',
      role: Role.STUDENT,
      matricNo: '23CG034011',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: 'Bob Student',
      email: 'bob@cu.edu.ng',
      role: Role.STUDENT,
      matricNo: '23CG034012',
    },
  })

  const student3 = await prisma.user.create({
    data: {
      name: 'Emma Johnson',
      email: 'emma@cu.edu.ng',
      role: Role.STUDENT,
      matricNo: '23CG034013',
    },
  })

  const student4 = await prisma.user.create({
    data: {
      name: 'David Wilson',
      email: 'david@cu.edu.ng',
      role: Role.STUDENT,
      matricNo: '23EE045014',
    },
  })

  const student5 = await prisma.user.create({
    data: {
      name: 'Grace Okafor',
      email: 'grace@cu.edu.ng',
      role: Role.STUDENT,
      matricNo: '23ME056015',
    },
  })

  const student6 = await prisma.user.create({
    data: {
      name: 'Michael Adebayo',
      email: 'michael@cu.edu.ng',
      role: Role.STUDENT,
      matricNo: '23CS067016',
    },
  })

  const coordinator3 = await prisma.user.create({
    data: {
      name: 'Dr. Patricia Williams',
      email: 'patricia@cu.edu.ng',
      role: Role.ORGANIZER,
    },
  })

  const coordinator4 = await prisma.user.create({
    data: {
      name: 'Rev. Emmanuel Oladele',
      email: 'emmanuel@cu.edu.ng',
      role: Role.ORGANIZER,
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
    },  })

  const venue3 = await prisma.venue.create({
    data: {
      name: 'Library Hall',
      capacity: 200,
    },
  })

  const venue4 = await prisma.venue.create({
    data: {
      name: 'Student Union Building',
      capacity: 300,
    },
  })

  const venue5 = await prisma.venue.create({
    data: {
      name: 'Engineering Lab Complex',
      capacity: 80,
    },
  })

  const venue6 = await prisma.venue.create({
    data: {
      name: 'Chapel',
      capacity: 600,
    },
  })

  const venue7 = await prisma.venue.create({
    data: {
      name: 'Sports Complex',
      capacity: 1000,
    },
  })

  const venue8 = await prisma.venue.create({
    data: {
      name: 'Open Field',
      capacity: 2000,
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

  const soundSystem = await prisma.resource.create({
    data: {
      name: 'Professional Sound System',
      description: 'High-quality sound system with speakers and mixer',
      category: ResourceCategory.AUDIO_VISUAL,
      totalCount: 4,
    },
  })

  const lightingRig = await prisma.resource.create({
    data: {
      name: 'Stage Lighting Equipment',
      description: 'Professional stage lighting rig for performances',
      category: ResourceCategory.AUDIO_VISUAL,
      totalCount: 2,
    },
  })
  const generators = await prisma.resource.create({
    data: {
      name: 'Power Generators',
      description: 'Backup power generators for outdoor events',
      category: ResourceCategory.OTHER,
      totalCount: 3,
    },
  })

  const tents = await prisma.resource.create({
    data: {
      name: 'Event Tents',
      description: 'Large outdoor tents for weather protection',
      category: ResourceCategory.FURNITURE,
      totalCount: 8,
    },
  })

  const cameras = await prisma.resource.create({
    data: {
      name: 'Digital Cameras',
      description: 'Professional cameras for event documentation',
      category: ResourceCategory.AUDIO_VISUAL,
      totalCount: 6,
    },
  })

  const cleaningStaff = await prisma.resource.create({
    data: {
      name: 'Cleaning Personnel',
      description: 'Professional cleaning staff for event setup and cleanup',
      category: ResourceCategory.TECHNICAL_STAFF,
      totalCount: 12,
    },
  })

  const cateringStaff = await prisma.resource.create({
    data: {
      name: 'Catering Staff',
      description: 'Professional catering and food service personnel',
      category: ResourceCategory.CATERING,
      totalCount: 10,
    },
  })

  // Create events  const event1 = await prisma.event.create({
    // Create events
  const event1 = await prisma.event.create({
  data: {
      title: 'Annual Science Fair',
      description: 'Join us for our prestigious Annual Science Fair, a comprehensive showcase of groundbreaking research and innovative projects developed by our talented students and esteemed faculty members. This year\'s theme focuses on "Technology for Sustainable Development" featuring cutting-edge research in renewable energy, environmental conservation, artificial intelligence, biotechnology, and space exploration. Attendees will have the opportunity to interact with researchers, witness live demonstrations of scientific experiments, participate in hands-on workshops, and explore interactive exhibits across multiple disciplines including Physics, Chemistry, Biology, Computer Science, and Engineering. The event will feature keynote presentations from industry leaders, poster sessions, research competitions with substantial prizes, networking opportunities for students and professionals, and special exhibitions of student innovations that address real-world challenges. Food vendors, entertainment, and guided tours will be available throughout the day to ensure an engaging experience for visitors of all ages.',
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
      description: 'Join fellow Computer Science students for our intensive collaborative learning sessions designed to enhance academic performance and foster peer-to-peer knowledge sharing. These weekly study groups provide a structured environment for exam preparation, assignment discussions, and concept clarification across all core Computer Science subjects including Data Structures and Algorithms, Database Management Systems, Software Engineering, Computer Networks, Operating Systems, and Programming Languages. Our sessions feature interactive problem-solving activities, group coding challenges, peer tutoring opportunities, and collaborative project work. Students can expect to participate in code reviews, algorithm analysis discussions, technical interview preparation, and comprehensive review sessions for upcoming examinations. The group welcomes students from all academic levels and provides an excellent opportunity to build study partnerships, improve technical communication skills, and create lasting academic friendships. Light refreshments and study materials will be provided, and senior students often serve as mentors to guide junior participants.',
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
      description: 'This urgent faculty assembly has been convened to address critical institutional matters requiring immediate attention and strategic planning. The meeting agenda includes comprehensive discussions on upcoming semester modifications, revised academic policies, updated COVID-19 health and safety protocols, budget allocation adjustments, faculty development initiatives, and curriculum enhancement proposals. Additionally, we will review emergency response procedures, discuss new accreditation requirements, address student welfare concerns, and evaluate recent changes in educational regulations that impact our institution. Faculty members will receive detailed briefings on new teaching methodologies, research funding opportunities, infrastructure development plans, and collaborative partnerships with industry stakeholders. This meeting is mandatory for all full-time faculty and department heads, with virtual attendance options available for those unable to attend in person. Supporting documents and policy drafts will be distributed prior to the meeting for thorough review and informed discussion.',
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
  })  // Create a recurring event (Weekly Chapel Service)
  const recurringEvent = await prisma.event.create({
    data: {
      title: 'Weekly Chapel Service',
      description: 'Join us for our inspiring weekly chapel service, a cornerstone of our university\'s spiritual life and community building. This sacred gathering brings together students, faculty, staff, and visitors for meaningful worship, powerful biblical messages, uplifting contemporary music, and heartfelt fellowship. Each service features carefully selected worship songs led by our talented student choir and musicians, thought-provoking sermons from distinguished chaplains and guest speakers, special musical performances, and opportunities for personal reflection and prayer. The service provides a peaceful sanctuary for spiritual growth, moral guidance, and community connection in the midst of academic pressures. Attendees can expect to hear relevant messages addressing life challenges, academic stress, relationship building, purpose discovery, and faith development. Special services throughout the semester include guest missionaries, testimonial sharing, cultural celebrations, and themed worship experiences. Light refreshments and fellowship time follow each service, creating opportunities for meaningful conversations and relationship building among the university community.',
      date: new Date('2025-06-25'), // First occurrence
      startTime: '18:00',
      endTime: '19:30',
      venueId: venue6.id, // Chapel
      capacity: 500,
      memo: 'Recurring weekly chapel service approved for the entire semester.',
      isApproved: true,
      priority: Priority.NORMAL,
      category: 'SPIRITUAL',
      createdById: coordinator4.id,
      isRecurring: true,
      recurrenceType: 'WEEKLY',
      recurrenceEnd: new Date('2025-12-31'), // Ends at end of year
    },
  })
  const event4 = await prisma.event.create({
    data: {
      title: 'Freshers Orientation',
      description: 'Welcome to our comprehensive orientation program designed specifically for incoming first-year students to ensure a smooth and successful transition into university life. This full-day immersive experience includes detailed campus tours highlighting all academic buildings, libraries, laboratories, recreational facilities, dining halls, and student service centers. Academic guidance sessions will cover course registration procedures, academic planning strategies, study skills development, time management techniques, and resource utilization. Students will participate in interactive workshops on university policies, student code of conduct, academic integrity, financial aid services, and career development opportunities. The program features meet-and-greet sessions with faculty advisors, peer mentors, student organization representatives, and administrative staff members. Social activities include icebreaker games, team-building exercises, cultural presentations, and networking opportunities with fellow freshers. Information booths will provide details about extracurricular activities, sports clubs, academic societies, volunteer opportunities, and campus employment options. Lunch and refreshments will be provided throughout the day, along with welcome packages containing essential university information and branded merchandise.',
      date: new Date('2025-08-15'),
      startTime: '08:00',
      endTime: '17:00',
      venueId: venue4.id, // Student Union Building
      capacity: 250,
      memo: 'Major orientation event for incoming students. Requires coordination with multiple departments.',
      isApproved: true,
      priority: Priority.HIGH,
      category: 'ACADEMIC',
      createdById: coordinator3.id,
    },
  })
  const event5 = await prisma.event.create({
    data: {
      title: 'Engineering Workshop',
      description: 'Immerse yourself in this intensive hands-on workshop showcasing the latest engineering technologies, innovative industry practices, and cutting-edge research developments that are shaping the future of engineering. This comprehensive program features interactive sessions on emerging technologies including Internet of Things (IoT), artificial intelligence applications in engineering, renewable energy systems, advanced materials science, robotics and automation, and sustainable engineering practices. Participants will engage in practical laboratory exercises using state-of-the-art equipment, participate in design thinking workshops, learn about project management methodologies, and explore real-world problem-solving techniques. Industry professionals and academic experts will lead sessions on career development, entrepreneurship opportunities, research collaboration, and professional networking. The workshop includes technical presentations on current engineering challenges, group projects simulating industry scenarios, equipment demonstrations, and prototype development activities. Attendees will have access to specialized software training, technical documentation, and exclusive industry insights. Lunch and networking breaks are included, providing opportunities to connect with peers, faculty, and industry representatives. Certificate of participation will be awarded to all attendees.',
      date: new Date('2025-07-20'),
      startTime: '10:00',
      endTime: '15:00',
      venueId: venue5.id, // Engineering Lab Complex
      capacity: 60,
      memo: 'Workshop requires specialized equipment and safety protocols.',
      isApproved: true,
      priority: Priority.NORMAL,
      category: 'ACADEMIC',
      createdById: coordinator.id,
    },
  })
  const event6 = await prisma.event.create({
    data: {
      title: 'Inter-Faculty Sports Competition',
      description: 'Experience the excitement and competitive spirit of our annual Inter-Faculty Sports Competition, the most anticipated sporting event of the academic year bringing together student-athletes from all faculties in a spectacular display of athletic excellence and university pride. This comprehensive multi-sport tournament features intense competitions in football (soccer), basketball, volleyball, table tennis, badminton, athletics (track and field), swimming, and team relay races. Each faculty will field teams representing their academic departments, creating an atmosphere of healthy rivalry and spirited competition. The event promotes physical fitness, teamwork, leadership development, and inter-faculty bonding while showcasing the diverse athletic talents within our university community. Spectators can expect thrilling matches, spectacular performances, cheerleading displays, halftime entertainment, and awards ceremonies recognizing outstanding achievements. Professional referees will officiate all games, ensuring fair play and maintaining high competition standards. Medical personnel will be on standby throughout the event, and refreshment stalls will provide food and beverages. Live commentary, music, and entertainment will enhance the festive atmosphere, making this a memorable celebration of sportsmanship and university unity.',
      date: new Date('2025-09-10'),
      startTime: '08:00',
      endTime: '18:00',
      venueId: venue7.id, // Sports Complex
      capacity: 800,
      memo: 'Major sports event requiring medical support, security, and refreshments.',
      isApproved: true,
      priority: Priority.HIGH,
      category: 'SPORTS',
      createdById: coordinator2.id,
    },
  })
  const event7 = await prisma.event.create({
    data: {
      title: 'Cultural Night',
      description: 'Celebrate the rich tapestry of Nigerian and international cultures at our vibrant Cultural Night, a spectacular evening showcase featuring the diverse heritage, traditions, and artistic expressions of our multicultural university community. This enchanting outdoor festival will transport attendees on a journey through various cultures with authentic traditional dances performed by student cultural groups, live musical performances featuring traditional instruments and contemporary fusion, dramatic presentations telling cultural stories and folklore, fashion shows displaying traditional attire from different regions, and poetry recitations in multiple languages. The event highlights the cultural diversity within our student body, featuring performances representing various Nigerian states, African countries, and international communities. Authentic cuisine from different cultures will be available through food vendors and cultural associations, offering attendees the opportunity to taste traditional delicacies, snacks, and beverages. Interactive cultural booths will display artifacts, artwork, handicrafts, and educational materials about different traditions and customs. The evening includes cultural competitions, traditional games, henna artistry, face painting, and photograph opportunities in traditional costumes. This celebration of unity in diversity promotes cultural understanding, tolerance, and appreciation while creating lasting memories and friendships across cultural boundaries.',
      date: new Date('2025-10-05'),
      startTime: '19:00',
      endTime: '23:00',
      venueId: venue8.id, // Open Field
      capacity: 1500,
      memo: 'Large outdoor cultural event requiring extensive setup and security.',
      isApproved: false, // Pending approval
      priority: Priority.NORMAL,
      category: 'CULTURAL',
      createdById: student3.id,
    },
  })
  const event8 = await prisma.event.create({
    data: {
      title: 'Career Fair 2025',
      description: 'Step into your future at our comprehensive Career Fair 2025, the premier professional development event connecting ambitious students with leading employers, industry experts, and career opportunities across multiple sectors. This prestigious gathering features representatives from top multinational corporations, innovative startups, government agencies, non-profit organizations, and academic institutions offering internships, graduate trainee programs, full-time employment, and research opportunities. Students will have direct access to hiring managers, HR professionals, and industry leaders through one-on-one interviews, informal networking sessions, company presentations, and career counseling meetings. The event includes workshops on resume writing, interview techniques, professional networking, salary negotiation, and career planning strategies. Technical sessions will cover industry trends, skill requirements, professional development pathways, and emerging career opportunities in technology, engineering, business, healthcare, education, and public service. Interactive booths will provide information about company cultures, job requirements, application processes, and growth opportunities. Students can participate in mock interviews, receive feedback on their professional presentation, and gain valuable insights into various career paths. Professional photographers will be available for LinkedIn profile pictures, and career counselors will provide personalized guidance. Light refreshments and networking lunch will facilitate informal conversations between students and potential employers.',
      date: new Date('2025-11-12'),
      startTime: '09:00',
      endTime: '16:00',
      venueId: venue1.id, // Main Auditorium
      capacity: 400,
      memo: 'Important career development event for final year students.',
      isApproved: true,
      priority: Priority.HIGH,
      category: 'ADMINISTRATIVE',
      createdById: coordinator3.id,
    },
  })
  const event9 = await prisma.event.create({
    data: {
      title: 'Research Symposium',
      description: 'Join us for our prestigious annual Research Symposium, a distinguished academic gathering showcasing groundbreaking research initiatives, innovative discoveries, and scholarly achievements by our esteemed faculty members, dedicated graduate students, and collaborative research teams. This comprehensive event highlights cutting-edge research across multiple disciplines including STEM fields, social sciences, humanities, and interdisciplinary studies that address contemporary global challenges. The symposium features keynote presentations from renowned international researchers, peer-reviewed paper presentations, poster sessions displaying research findings, panel discussions on emerging research trends, and collaborative workshops exploring future research directions. Attendees will gain insights into ongoing research projects, funding opportunities, publication strategies, and potential collaboration partnerships. The program includes sessions on research methodology, data analysis techniques, academic writing, grant application processes, and career development in academia and research institutions. Graduate students will have opportunities to present their thesis research, receive feedback from expert panels, and network with potential supervisors and collaborators. Industry representatives will participate in discussions about research commercialization, technology transfer, and industry-academia partnerships. The event promotes knowledge sharing, intellectual discourse, and research collaboration while inspiring the next generation of researchers and scholars. Refreshments and networking breaks will facilitate informal discussions and relationship building among participants.',
      date: new Date('2025-12-01'),
      startTime: '09:00',
      endTime: '17:00',
      venueId: venue3.id, // Library Hall
      capacity: 150,
      memo: 'Academic research showcase event.',
      isApproved: true,
      priority: Priority.NORMAL,
      category: 'ACADEMIC',
      createdById: admin.id,
    },
  })

  // Note: Recurring instances will be calculated dynamically, no need to create them in the database
  // Create organizer relationships for the many-to-many system
  // Event 1: Science Fair - John as primary, Sarah as co-organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event1.id,
      userId: coordinator.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  await prisma.eventOrganizer.create({
    data: {
      eventId: event1.id,
      userId: coordinator2.id,
      role: 'CO_ORGANIZER',
      addedBy: coordinator.id,
    },
  })

  // Event 2: Study Group - Alice as primary organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event2.id,
      userId: student1.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  // Event 3: Faculty Meeting - Admin as primary, John as co-organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event3.id,
      userId: admin.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  await prisma.eventOrganizer.create({
    data: {
      eventId: event3.id,
      userId: coordinator.id,
      role: 'CO_ORGANIZER',
      addedBy: admin.id,
    },
  })  // Recurring Event: Chapel Service - Rev. Emmanuel as primary organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: recurringEvent.id,
      userId: coordinator4.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  // Event 4: Freshers Orientation - Dr. Patricia as primary, Sarah as co-organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event4.id,
      userId: coordinator3.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  await prisma.eventOrganizer.create({
    data: {
      eventId: event4.id,
      userId: coordinator2.id,
      role: 'CO_ORGANIZER',
      addedBy: coordinator3.id,
    },
  })

  // Event 5: Engineering Workshop - John as primary organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event5.id,
      userId: coordinator.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  // Event 6: Sports Competition - Sarah as primary, John as co-organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event6.id,
      userId: coordinator2.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  await prisma.eventOrganizer.create({
    data: {
      eventId: event6.id,
      userId: coordinator.id,
      role: 'CO_ORGANIZER',
      addedBy: coordinator2.id,
    },
  })

  // Event 7: Cultural Night - Emma as primary organizer (student event)
  await prisma.eventOrganizer.create({
    data: {
      eventId: event7.id,
      userId: student3.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  // Event 8: Career Fair - Dr. Patricia as primary, Admin as co-organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event8.id,
      userId: coordinator3.id,
      role: 'PRIMARY_ORGANIZER',
    },
  })

  await prisma.eventOrganizer.create({
    data: {
      eventId: event8.id,
      userId: admin.id,
      role: 'CO_ORGANIZER',
      addedBy: coordinator3.id,
    },
  })

  // Event 9: Research Symposium - Admin as primary organizer
  await prisma.eventOrganizer.create({
    data: {
      eventId: event9.id,
      userId: admin.id,
      role: 'PRIMARY_ORGANIZER',
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

  // Additional RSVPs for other events
  await prisma.eventRSVP.create({
    data: {
      eventId: event4.id, // Freshers Orientation
      userId: student3.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event4.id,
      userId: student4.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event4.id,
      userId: student5.id,
      status: 'PENDING',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event5.id, // Engineering Workshop
      userId: student4.id, // David (EE student)
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event5.id,
      userId: student5.id, // Grace (ME student)
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event6.id, // Sports Competition
      userId: student1.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event6.id,
      userId: student2.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event6.id,
      userId: student6.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event7.id, // Cultural Night
      userId: student1.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event7.id,
      userId: student2.id,
      status: 'PENDING',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: event8.id, // Career Fair
      userId: student6.id, // Final year CS student
      status: 'ACCEPTED',
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: recurringEvent.id, // Chapel Service
      userId: student3.id,
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

  // Chapel Service resources
  await prisma.eventResource.create({
    data: {
      eventId: recurringEvent.id,
      resourceId: soundSystem.id,
      quantityNeeded: 1,
      status: 'APPROVED',
      notes: 'For worship music and speaking',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: recurringEvent.id,
      resourceId: microphone.id,
      quantityNeeded: 2,
      status: 'APPROVED',
    },
  })

  // Freshers Orientation resources
  await prisma.eventResource.create({
    data: {
      eventId: event4.id,
      resourceId: projector.id,
      quantityNeeded: 2,
      status: 'APPROVED',
      notes: 'For presentation and video displays',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event4.id,
      resourceId: soundSystem.id,
      quantityNeeded: 1,
      status: 'APPROVED',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event4.id,
      resourceId: tables.id,
      quantityNeeded: 15,
      status: 'APPROVED',
      notes: 'For registration and information booths',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event4.id,
      resourceId: chairs.id,
      quantityNeeded: 100,
      status: 'APPROVED',
    },
  })

  // Engineering Workshop resources
  await prisma.eventResource.create({
    data: {
      eventId: event5.id,
      resourceId: projector.id,
      quantityNeeded: 1,
      status: 'APPROVED',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event5.id,
      resourceId: avTechnician.id,
      quantityNeeded: 1,
      status: 'APPROVED',
      notes: 'For technical equipment setup',
    },
  })

  // Sports Competition resources
  await prisma.eventResource.create({
    data: {
      eventId: event6.id,
      resourceId: soundSystem.id,
      quantityNeeded: 2,
      status: 'APPROVED',
      notes: 'For announcements and music',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event6.id,
      resourceId: securityGuard.id,
      quantityNeeded: 4,
      status: 'APPROVED',
      notes: 'For crowd control and safety',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event6.id,
      resourceId: cateringTables.id,
      quantityNeeded: 8,
      status: 'APPROVED',
      notes: 'For refreshment stations',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event6.id,
      resourceId: cateringStaff.id,
      quantityNeeded: 6,
      status: 'APPROVED',
    },
  })

  // Cultural Night resources
  await prisma.eventResource.create({
    data: {
      eventId: event7.id,
      resourceId: lightingRig.id,
      quantityNeeded: 2,
      status: 'PENDING',
      notes: 'For stage performances',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event7.id,
      resourceId: soundSystem.id,
      quantityNeeded: 2,
      status: 'PENDING',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event7.id,
      resourceId: tents.id,
      quantityNeeded: 4,
      status: 'PENDING',
      notes: 'For weather protection',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event7.id,
      resourceId: generators.id,
      quantityNeeded: 2,
      status: 'PENDING',
      notes: 'For outdoor power supply',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event7.id,
      resourceId: securityGuard.id,
      quantityNeeded: 6,
      status: 'PENDING',
      notes: 'For large crowd management',
    },
  })

  // Career Fair resources
  await prisma.eventResource.create({
    data: {
      eventId: event8.id,
      resourceId: tables.id,
      quantityNeeded: 20,
      status: 'APPROVED',
      notes: 'For company booths',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event8.id,
      resourceId: chairs.id,
      quantityNeeded: 80,
      status: 'APPROVED',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event8.id,
      resourceId: projector.id,
      quantityNeeded: 1,
      status: 'APPROVED',
      notes: 'For presentations',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event8.id,
      resourceId: avTechnician.id,
      quantityNeeded: 1,
      status: 'APPROVED',
    },
  })

  // Research Symposium resources
  await prisma.eventResource.create({
    data: {
      eventId: event9.id,
      resourceId: projector.id,
      quantityNeeded: 1,
      status: 'APPROVED',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event9.id,
      resourceId: microphone.id,
      quantityNeeded: 2,
      status: 'APPROVED',
    },
  })

  await prisma.eventResource.create({
    data: {
      eventId: event9.id,
      resourceId: cameras.id,
      quantityNeeded: 2,
      status: 'APPROVED',
      notes: 'For documentation and recording',
    },  })

  // Create feedback entries
  await prisma.feedback.create({
    data: {
      eventId: event1.id, // Science Fair
      userId: student1.id,
      rating: 5,
      comment: 'Excellent event! The projects were very innovative and inspiring.',
    },
  })

  await prisma.feedback.create({
    data: {
      eventId: event1.id,
      userId: student2.id,
      rating: 4,
      comment: 'Great organization and variety of projects. Could use better crowd management.',
    },
  })

  await prisma.feedback.create({
    data: {
      eventId: event2.id, // Study Group
      userId: student2.id,
      rating: 5,
      comment: 'Very helpful study sessions. The collaborative environment really helps learning.',
    },
  })

  await prisma.feedback.create({
    data: {
      eventId: event6.id, // Sports Competition
      userId: student1.id,
      rating: 4,
      comment: 'Fun and competitive event. Great way to bond with fellow students from other faculties.',
    },
  })

  await prisma.feedback.create({
    data: {
      eventId: event6.id,
      userId: student6.id,
      rating: 5,
      comment: 'Amazing sports day! Well organized with good facilities and refreshments.',
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
