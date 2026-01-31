# Campus Event Management System

Event management for universities: approval workflows, venue booking, and RSVP tracking. Built with Next.js and Prisma.

## What it does

- Event approvals: Organizers submit events, admins approve/reject, everyone sees the status
- Venue booking: Pick a room, pick a time, system prevents double-booking
- Role-based dashboards: Different views for admins, organizers, and students
- Feedback collection: Gather post-event responses to see what worked

## Tech stack

- Next.js 14 (App Router) + Tailwind + ShadCN
- Prisma ORM with MySQL
- Role-based auth (admin, organizer, student)

## Setup

```bash
git clone https://github.com/incognitol07/event-management-system.git
cd event-management-system
pnpm install
cp .env.example .env  # add your database URL
pnpm prisma migrate dev
pnpm dev
```

Then open [localhost:3000](http://localhost:3000).

## Project structure

The codebase uses a modular layout each feature lives in its own directory with its own components, hooks, and API routes. Prisma handles all DB stuff with type-safe queries.

## Contributing

Fork it, make a branch, open a PR. Keep changes focused and add tests if you're touching logic.

## License

MIT
