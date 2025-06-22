"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../generated/prisma");
var prisma = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var admin, coordinator, coordinator2, student1, student2, student3, student4, student5, student6, coordinator3, coordinator4, venue1, venue2, venue3, venue4, venue5, venue6, venue7, venue8, projector, microphone, tables, chairs, avTechnician, securityGuard, transportBus, cateringTables, soundSystem, lightingRig, generators, tents, cameras, cleaningStaff, cateringStaff, event1, event2, event3, recurringEvent, event4, event5, event6, event7, event8, event9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: // Clear existing data
                return [4 /*yield*/, prisma.feedback.deleteMany()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventOrganizer.deleteMany()]; // Clear organizer relationships
                case 4:
                    _a.sent(); // Clear organizer relationships
                    return [4 /*yield*/, prisma.event.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.venue.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.resource.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()
                        // Create users
                    ];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Admin User',
                                email: 'admin@cu.edu.ng',
                                role: prisma_1.Role.ADMIN,
                            },
                        })];
                case 9:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'John Coordinator',
                                email: 'coordinator@cu.edu.ng',
                                role: prisma_1.Role.ORGANIZER,
                            },
                        })];
                case 10:
                    coordinator = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Sarah Events Manager',
                                email: 'sarah@cu.edu.ng',
                                role: prisma_1.Role.ORGANIZER,
                            },
                        })];
                case 11:
                    coordinator2 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Alice Student',
                                email: 'alice@cu.edu.ng',
                                role: prisma_1.Role.STUDENT,
                                matricNo: '23CG034011',
                            },
                        })];
                case 12:
                    student1 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Bob Student',
                                email: 'bob@cu.edu.ng',
                                role: prisma_1.Role.STUDENT,
                                matricNo: '23CG034012',
                            },
                        })];
                case 13:
                    student2 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Emma Johnson',
                                email: 'emma@cu.edu.ng',
                                role: prisma_1.Role.STUDENT,
                                matricNo: '23CG034013',
                            },
                        })];
                case 14:
                    student3 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'David Wilson',
                                email: 'david@cu.edu.ng',
                                role: prisma_1.Role.STUDENT,
                                matricNo: '23EE045014',
                            },
                        })];
                case 15:
                    student4 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Grace Okafor',
                                email: 'grace@cu.edu.ng',
                                role: prisma_1.Role.STUDENT,
                                matricNo: '23ME056015',
                            },
                        })];
                case 16:
                    student5 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Michael Adebayo',
                                email: 'michael@cu.edu.ng',
                                role: prisma_1.Role.STUDENT,
                                matricNo: '23CS067016',
                            },
                        })];
                case 17:
                    student6 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Dr. Patricia Williams',
                                email: 'patricia@cu.edu.ng',
                                role: prisma_1.Role.ORGANIZER,
                            },
                        })];
                case 18:
                    coordinator3 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Rev. Emmanuel Oladele',
                                email: 'emmanuel@cu.edu.ng',
                                role: prisma_1.Role.ORGANIZER,
                            },
                        })
                        // Create venues
                    ];
                case 19:
                    coordinator4 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Main Auditorium',
                                capacity: 500,
                            },
                        })];
                case 20:
                    venue1 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Conference Room A',
                                capacity: 50,
                            },
                        })];
                case 21:
                    venue2 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Library Hall',
                                capacity: 200,
                            },
                        })];
                case 22:
                    venue3 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Student Union Building',
                                capacity: 300,
                            },
                        })];
                case 23:
                    venue4 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Engineering Lab Complex',
                                capacity: 80,
                            },
                        })];
                case 24:
                    venue5 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Chapel',
                                capacity: 600,
                            },
                        })];
                case 25:
                    venue6 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Sports Complex',
                                capacity: 1000,
                            },
                        })];
                case 26:
                    venue7 = _a.sent();
                    return [4 /*yield*/, prisma.venue.create({
                            data: {
                                name: 'Open Field',
                                capacity: 2000,
                            },
                        })
                        // Create resources
                    ];
                case 27:
                    venue8 = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'HD Projector',
                                description: 'High-definition projector suitable for large auditoriums',
                                category: prisma_1.ResourceCategory.AUDIO_VISUAL,
                                totalCount: 5,
                            },
                        })];
                case 28:
                    projector = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Wireless Microphone',
                                description: 'Professional wireless microphone system',
                                category: prisma_1.ResourceCategory.AUDIO_VISUAL,
                                totalCount: 10,
                            },
                        })];
                case 29:
                    microphone = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Round Tables',
                                description: 'Round tables that seat 8 people each',
                                category: prisma_1.ResourceCategory.FURNITURE,
                                totalCount: 20,
                            },
                        })];
                case 30:
                    tables = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Plastic Chairs',
                                description: 'Standard plastic chairs for events',
                                category: prisma_1.ResourceCategory.FURNITURE,
                                totalCount: 200,
                            },
                        })];
                case 31:
                    chairs = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'AV Technician',
                                description: 'Audio-visual technical support specialist',
                                category: prisma_1.ResourceCategory.TECHNICAL_STAFF,
                                totalCount: 3,
                            },
                        })];
                case 32:
                    avTechnician = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Security Personnel',
                                description: 'Trained security guards for event safety',
                                category: prisma_1.ResourceCategory.SECURITY,
                                totalCount: 8,
                            },
                        })];
                case 33:
                    securityGuard = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'University Bus',
                                description: '50-seater bus for off-campus events',
                                category: prisma_1.ResourceCategory.TRANSPORTATION,
                                totalCount: 2,
                            },
                        })];
                case 34:
                    transportBus = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Catering Tables',
                                description: 'Long tables for food service and buffet setup',
                                category: prisma_1.ResourceCategory.CATERING,
                                totalCount: 15,
                            },
                        })];
                case 35:
                    cateringTables = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Professional Sound System',
                                description: 'High-quality sound system with speakers and mixer',
                                category: prisma_1.ResourceCategory.AUDIO_VISUAL,
                                totalCount: 4,
                            },
                        })];
                case 36:
                    soundSystem = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Stage Lighting Equipment',
                                description: 'Professional stage lighting rig for performances',
                                category: prisma_1.ResourceCategory.AUDIO_VISUAL,
                                totalCount: 2,
                            },
                        })];
                case 37:
                    lightingRig = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Power Generators',
                                description: 'Backup power generators for outdoor events',
                                category: prisma_1.ResourceCategory.OTHER,
                                totalCount: 3,
                            },
                        })];
                case 38:
                    generators = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Event Tents',
                                description: 'Large outdoor tents for weather protection',
                                category: prisma_1.ResourceCategory.FURNITURE,
                                totalCount: 8,
                            },
                        })];
                case 39:
                    tents = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Digital Cameras',
                                description: 'Professional cameras for event documentation',
                                category: prisma_1.ResourceCategory.AUDIO_VISUAL,
                                totalCount: 6,
                            },
                        })];
                case 40:
                    cameras = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Cleaning Personnel',
                                description: 'Professional cleaning staff for event setup and cleanup',
                                category: prisma_1.ResourceCategory.TECHNICAL_STAFF,
                                totalCount: 12,
                            },
                        })];
                case 41:
                    cleaningStaff = _a.sent();
                    return [4 /*yield*/, prisma.resource.create({
                            data: {
                                name: 'Catering Staff',
                                description: 'Professional catering and food service personnel',
                                category: prisma_1.ResourceCategory.CATERING,
                                totalCount: 10,
                            },
                        })
                        // Create events  const event1 = await prisma.event.create({
                        // Create events
                    ];
                case 42:
                    cateringStaff = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.HIGH,
                                createdById: coordinator.id,
                            },
                        })];
                case 43:
                    event1 = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.NORMAL,
                                createdById: student1.id,
                            },
                        })];
                case 44:
                    event2 = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.EMERGENCY,
                                createdById: admin.id,
                            },
                        })]; // Create a recurring event (Weekly Chapel Service)
                case 45:
                    event3 = _a.sent() // Create a recurring event (Weekly Chapel Service)
                    ;
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.NORMAL,
                                category: 'SPIRITUAL',
                                createdById: coordinator4.id,
                                isRecurring: true,
                                recurrenceType: 'WEEKLY',
                                recurrenceEnd: new Date('2025-12-31'), // Ends at end of year
                            },
                        })];
                case 46:
                    recurringEvent = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.HIGH,
                                category: 'ACADEMIC',
                                createdById: coordinator3.id,
                            },
                        })];
                case 47:
                    event4 = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.NORMAL,
                                category: 'ACADEMIC',
                                createdById: coordinator.id,
                            },
                        })];
                case 48:
                    event5 = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.HIGH,
                                category: 'SPORTS',
                                createdById: coordinator2.id,
                            },
                        })];
                case 49:
                    event6 = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.NORMAL,
                                category: 'CULTURAL',
                                createdById: student3.id,
                            },
                        })];
                case 50:
                    event7 = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.HIGH,
                                category: 'ADMINISTRATIVE',
                                createdById: coordinator3.id,
                            },
                        })];
                case 51:
                    event8 = _a.sent();
                    return [4 /*yield*/, prisma.event.create({
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
                                priority: prisma_1.Priority.NORMAL,
                                category: 'ACADEMIC',
                                createdById: admin.id,
                            },
                        })
                        // Note: Recurring instances will be calculated dynamically, no need to create them in the database
                        // Create organizer relationships for the many-to-many system
                        // Event 1: Science Fair - John as primary, Sarah as co-organizer
                    ];
                case 52:
                    event9 = _a.sent();
                    // Note: Recurring instances will be calculated dynamically, no need to create them in the database
                    // Create organizer relationships for the many-to-many system
                    // Event 1: Science Fair - John as primary, Sarah as co-organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event1.id,
                                userId: coordinator.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })];
                case 53:
                    // Note: Recurring instances will be calculated dynamically, no need to create them in the database
                    // Create organizer relationships for the many-to-many system
                    // Event 1: Science Fair - John as primary, Sarah as co-organizer
                    _a.sent();
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event1.id,
                                userId: coordinator2.id,
                                role: 'CO_ORGANIZER',
                                addedBy: coordinator.id,
                            },
                        })
                        // Event 2: Study Group - Alice as primary organizer
                    ];
                case 54:
                    _a.sent();
                    // Event 2: Study Group - Alice as primary organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event2.id,
                                userId: student1.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })
                        // Event 3: Faculty Meeting - Admin as primary, John as co-organizer
                    ];
                case 55:
                    // Event 2: Study Group - Alice as primary organizer
                    _a.sent();
                    // Event 3: Faculty Meeting - Admin as primary, John as co-organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event3.id,
                                userId: admin.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })];
                case 56:
                    // Event 3: Faculty Meeting - Admin as primary, John as co-organizer
                    _a.sent();
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event3.id,
                                userId: coordinator.id,
                                role: 'CO_ORGANIZER',
                                addedBy: admin.id,
                            },
                        })]; // Recurring Event: Chapel Service - Rev. Emmanuel as primary organizer
                case 57:
                    _a.sent(); // Recurring Event: Chapel Service - Rev. Emmanuel as primary organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: recurringEvent.id,
                                userId: coordinator4.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })
                        // Event 4: Freshers Orientation - Dr. Patricia as primary, Sarah as co-organizer
                    ];
                case 58:
                    _a.sent();
                    // Event 4: Freshers Orientation - Dr. Patricia as primary, Sarah as co-organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event4.id,
                                userId: coordinator3.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })];
                case 59:
                    // Event 4: Freshers Orientation - Dr. Patricia as primary, Sarah as co-organizer
                    _a.sent();
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event4.id,
                                userId: coordinator2.id,
                                role: 'CO_ORGANIZER',
                                addedBy: coordinator3.id,
                            },
                        })
                        // Event 5: Engineering Workshop - John as primary organizer
                    ];
                case 60:
                    _a.sent();
                    // Event 5: Engineering Workshop - John as primary organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event5.id,
                                userId: coordinator.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })
                        // Event 6: Sports Competition - Sarah as primary, John as co-organizer
                    ];
                case 61:
                    // Event 5: Engineering Workshop - John as primary organizer
                    _a.sent();
                    // Event 6: Sports Competition - Sarah as primary, John as co-organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event6.id,
                                userId: coordinator2.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })];
                case 62:
                    // Event 6: Sports Competition - Sarah as primary, John as co-organizer
                    _a.sent();
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event6.id,
                                userId: coordinator.id,
                                role: 'CO_ORGANIZER',
                                addedBy: coordinator2.id,
                            },
                        })
                        // Event 7: Cultural Night - Emma as primary organizer (student event)
                    ];
                case 63:
                    _a.sent();
                    // Event 7: Cultural Night - Emma as primary organizer (student event)
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event7.id,
                                userId: student3.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })
                        // Event 8: Career Fair - Dr. Patricia as primary, Admin as co-organizer
                    ];
                case 64:
                    // Event 7: Cultural Night - Emma as primary organizer (student event)
                    _a.sent();
                    // Event 8: Career Fair - Dr. Patricia as primary, Admin as co-organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event8.id,
                                userId: coordinator3.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })];
                case 65:
                    // Event 8: Career Fair - Dr. Patricia as primary, Admin as co-organizer
                    _a.sent();
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event8.id,
                                userId: admin.id,
                                role: 'CO_ORGANIZER',
                                addedBy: coordinator3.id,
                            },
                        })
                        // Event 9: Research Symposium - Admin as primary organizer
                    ];
                case 66:
                    _a.sent();
                    // Event 9: Research Symposium - Admin as primary organizer
                    return [4 /*yield*/, prisma.eventOrganizer.create({
                            data: {
                                eventId: event9.id,
                                userId: admin.id,
                                role: 'PRIMARY_ORGANIZER',
                            },
                        })
                        // Create RSVPs
                    ];
                case 67:
                    // Event 9: Research Symposium - Admin as primary organizer
                    _a.sent();
                    // Create RSVPs
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event1.id,
                                userId: student1.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 68:
                    // Create RSVPs
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event1.id,
                                userId: student2.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 69:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event2.id,
                                userId: student2.id,
                                status: 'ACCEPTED',
                            },
                        })
                        // Additional RSVPs for other events
                    ];
                case 70:
                    _a.sent();
                    // Additional RSVPs for other events
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event4.id, // Freshers Orientation
                                userId: student3.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 71:
                    // Additional RSVPs for other events
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event4.id,
                                userId: student4.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 72:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event4.id,
                                userId: student5.id,
                                status: 'PENDING',
                            },
                        })];
                case 73:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event5.id, // Engineering Workshop
                                userId: student4.id, // David (EE student)
                                status: 'ACCEPTED',
                            },
                        })];
                case 74:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event5.id,
                                userId: student5.id, // Grace (ME student)
                                status: 'ACCEPTED',
                            },
                        })];
                case 75:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event6.id, // Sports Competition
                                userId: student1.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 76:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event6.id,
                                userId: student2.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 77:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event6.id,
                                userId: student6.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 78:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event7.id, // Cultural Night
                                userId: student1.id,
                                status: 'ACCEPTED',
                            },
                        })];
                case 79:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event7.id,
                                userId: student2.id,
                                status: 'PENDING',
                            },
                        })];
                case 80:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: event8.id, // Career Fair
                                userId: student6.id, // Final year CS student
                                status: 'ACCEPTED',
                            },
                        })];
                case 81:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventRSVP.create({
                            data: {
                                eventId: recurringEvent.id, // Chapel Service
                                userId: student3.id,
                                status: 'ACCEPTED',
                            },
                        })
                        // Create resource allocations
                        // Science Fair resources
                    ];
                case 82:
                    _a.sent();
                    // Create resource allocations
                    // Science Fair resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event1.id,
                                resourceId: projector.id,
                                quantityNeeded: 2,
                                status: 'APPROVED',
                                notes: 'For main presentation and demo stations',
                            },
                        })];
                case 83:
                    // Create resource allocations
                    // Science Fair resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event1.id,
                                resourceId: microphone.id,
                                quantityNeeded: 3,
                                status: 'APPROVED',
                            },
                        })];
                case 84:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event1.id,
                                resourceId: tables.id,
                                quantityNeeded: 10,
                                status: 'APPROVED',
                                notes: 'For project displays',
                            },
                        })];
                case 85:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event1.id,
                                resourceId: securityGuard.id,
                                quantityNeeded: 2,
                                status: 'APPROVED',
                                notes: 'For crowd control and security',
                            },
                        })
                        // Study Group resources
                    ];
                case 86:
                    _a.sent();
                    // Study Group resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event2.id,
                                resourceId: projector.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                            },
                        })
                        // Faculty Meeting resources
                    ];
                case 87:
                    // Study Group resources
                    _a.sent();
                    // Faculty Meeting resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event3.id,
                                resourceId: microphone.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                            },
                        })];
                case 88:
                    // Faculty Meeting resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event3.id,
                                resourceId: avTechnician.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                                notes: 'For video conferencing setup',
                            },
                        })
                        // Chapel Service resources
                    ];
                case 89:
                    _a.sent();
                    // Chapel Service resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: recurringEvent.id,
                                resourceId: soundSystem.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                                notes: 'For worship music and speaking',
                            },
                        })];
                case 90:
                    // Chapel Service resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: recurringEvent.id,
                                resourceId: microphone.id,
                                quantityNeeded: 2,
                                status: 'APPROVED',
                            },
                        })
                        // Freshers Orientation resources
                    ];
                case 91:
                    _a.sent();
                    // Freshers Orientation resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event4.id,
                                resourceId: projector.id,
                                quantityNeeded: 2,
                                status: 'APPROVED',
                                notes: 'For presentation and video displays',
                            },
                        })];
                case 92:
                    // Freshers Orientation resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event4.id,
                                resourceId: soundSystem.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                            },
                        })];
                case 93:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event4.id,
                                resourceId: tables.id,
                                quantityNeeded: 15,
                                status: 'APPROVED',
                                notes: 'For registration and information booths',
                            },
                        })];
                case 94:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event4.id,
                                resourceId: chairs.id,
                                quantityNeeded: 100,
                                status: 'APPROVED',
                            },
                        })
                        // Engineering Workshop resources
                    ];
                case 95:
                    _a.sent();
                    // Engineering Workshop resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event5.id,
                                resourceId: projector.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                            },
                        })];
                case 96:
                    // Engineering Workshop resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event5.id,
                                resourceId: avTechnician.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                                notes: 'For technical equipment setup',
                            },
                        })
                        // Sports Competition resources
                    ];
                case 97:
                    _a.sent();
                    // Sports Competition resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event6.id,
                                resourceId: soundSystem.id,
                                quantityNeeded: 2,
                                status: 'APPROVED',
                                notes: 'For announcements and music',
                            },
                        })];
                case 98:
                    // Sports Competition resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event6.id,
                                resourceId: securityGuard.id,
                                quantityNeeded: 4,
                                status: 'APPROVED',
                                notes: 'For crowd control and safety',
                            },
                        })];
                case 99:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event6.id,
                                resourceId: cateringTables.id,
                                quantityNeeded: 8,
                                status: 'APPROVED',
                                notes: 'For refreshment stations',
                            },
                        })];
                case 100:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event6.id,
                                resourceId: cateringStaff.id,
                                quantityNeeded: 6,
                                status: 'APPROVED',
                            },
                        })
                        // Cultural Night resources
                    ];
                case 101:
                    _a.sent();
                    // Cultural Night resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event7.id,
                                resourceId: lightingRig.id,
                                quantityNeeded: 2,
                                status: 'PENDING',
                                notes: 'For stage performances',
                            },
                        })];
                case 102:
                    // Cultural Night resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event7.id,
                                resourceId: soundSystem.id,
                                quantityNeeded: 2,
                                status: 'PENDING',
                            },
                        })];
                case 103:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event7.id,
                                resourceId: tents.id,
                                quantityNeeded: 4,
                                status: 'PENDING',
                                notes: 'For weather protection',
                            },
                        })];
                case 104:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event7.id,
                                resourceId: generators.id,
                                quantityNeeded: 2,
                                status: 'PENDING',
                                notes: 'For outdoor power supply',
                            },
                        })];
                case 105:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event7.id,
                                resourceId: securityGuard.id,
                                quantityNeeded: 6,
                                status: 'PENDING',
                                notes: 'For large crowd management',
                            },
                        })
                        // Career Fair resources
                    ];
                case 106:
                    _a.sent();
                    // Career Fair resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event8.id,
                                resourceId: tables.id,
                                quantityNeeded: 20,
                                status: 'APPROVED',
                                notes: 'For company booths',
                            },
                        })];
                case 107:
                    // Career Fair resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event8.id,
                                resourceId: chairs.id,
                                quantityNeeded: 80,
                                status: 'APPROVED',
                            },
                        })];
                case 108:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event8.id,
                                resourceId: projector.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                                notes: 'For presentations',
                            },
                        })];
                case 109:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event8.id,
                                resourceId: avTechnician.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                            },
                        })
                        // Research Symposium resources
                    ];
                case 110:
                    _a.sent();
                    // Research Symposium resources
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event9.id,
                                resourceId: projector.id,
                                quantityNeeded: 1,
                                status: 'APPROVED',
                            },
                        })];
                case 111:
                    // Research Symposium resources
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event9.id,
                                resourceId: microphone.id,
                                quantityNeeded: 2,
                                status: 'APPROVED',
                            },
                        })];
                case 112:
                    _a.sent();
                    return [4 /*yield*/, prisma.eventResource.create({
                            data: {
                                eventId: event9.id,
                                resourceId: cameras.id,
                                quantityNeeded: 2,
                                status: 'APPROVED',
                                notes: 'For documentation and recording',
                            },
                        })
                        // Create feedback entries
                    ];
                case 113:
                    _a.sent();
                    // Create feedback entries
                    return [4 /*yield*/, prisma.feedback.create({
                            data: {
                                eventId: event1.id, // Science Fair
                                userId: student1.id,
                                rating: 5,
                                comment: 'Excellent event! The projects were very innovative and inspiring.',
                            },
                        })];
                case 114:
                    // Create feedback entries
                    _a.sent();
                    return [4 /*yield*/, prisma.feedback.create({
                            data: {
                                eventId: event1.id,
                                userId: student2.id,
                                rating: 4,
                                comment: 'Great organization and variety of projects. Could use better crowd management.',
                            },
                        })];
                case 115:
                    _a.sent();
                    return [4 /*yield*/, prisma.feedback.create({
                            data: {
                                eventId: event2.id, // Study Group
                                userId: student2.id,
                                rating: 5,
                                comment: 'Very helpful study sessions. The collaborative environment really helps learning.',
                            },
                        })];
                case 116:
                    _a.sent();
                    return [4 /*yield*/, prisma.feedback.create({
                            data: {
                                eventId: event6.id, // Sports Competition
                                userId: student1.id,
                                rating: 4,
                                comment: 'Fun and competitive event. Great way to bond with fellow students from other faculties.',
                            },
                        })];
                case 117:
                    _a.sent();
                    return [4 /*yield*/, prisma.feedback.create({
                            data: {
                                eventId: event6.id,
                                userId: student6.id,
                                rating: 5,
                                comment: 'Amazing sports day! Well organized with good facilities and refreshments.',
                            },
                        })];
                case 118:
                    _a.sent();
                    console.log('Database seeded successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
