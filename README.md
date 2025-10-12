# Campus Event Management System

**Run campus events smarter: faster approvals, higher engagement, and a developer-friendly codebase.**

A full-stack university event management system designed to help organizers, admins, and students manage events efficiently. Focused on clarity, transparency, and actionable insights, the platform reduces approval delays, improves student attendance, and provides a structured foundation for developers.

---

## 🎯 Key Goals

* Streamline event approval workflows for administrators.
* Improve event visibility and attendance for students.
* Provide role-specific dashboards for organizers, students, and admins.
* Offer a clean, modular codebase for developers to extend and customize.

---

## 💡 Features

| Feature                  | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| Event Approval Workflow  | Track submissions, approvals, and rejections in one place. |
| Venue & Resource Booking | Prevent double-booked venues with automated scheduling.    |
| Role-Specific Dashboards | Tailored views for admins, organizers, and students.       |
| Feedback & Reporting     | Gather insights from events to improve future planning.    |

---

## 🛠 Technology Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, ShadCN UI
* **Backend:** Node.js, Prisma ORM, MySQL
* **Authentication & Roles:** RBAC for admin, student, and organizer accounts
* **Dev Tools:** pnpm, Docker (optional for local development)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/incognitol07/event-management-system.git
cd event-management-system
```

### 2. Install Dependencies

```bash
pnpm install
cp .env.example .env  # configure your database
pnpm prisma migrate dev
```

### 3. Start the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🧪 Developer Notes

* Modular architecture makes it easy to extend features without rewriting the core.
* Role-based access control ensures that users only see what they need.
* Prisma ORM provides type-safe database interactions and migrations.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes and add tests
4. Submit a pull request

---

## 📄 License

MIT License — see the LICENSE file for details.
