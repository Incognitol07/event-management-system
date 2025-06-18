# EventFlow - University Event Management System

A comprehensive, role-based event management system designed specifically for universities. Built with Next.js, React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🏠 **Marketing Home Page**

- **Visual Appeal**: Modern, "Apple-like" design with gradients and smooth animations
- **Feature Showcase**: Comprehensive overview of system capabilities
- **Live Calendar**: Full event calendar integration on the home page
- **Role-based CTAs**: Smart call-to-action buttons based on user authentication status

### 🔐 **Authentication & Role Management**

- **Three User Roles**: Admin, Organizer, and Attendee with distinct permissions
- **Demo Access**: Quick role switching for demonstration purposes
- **Protected Routes**: Secure access control for sensitive features
- **Persistent Sessions**: User sessions maintained across browser sessions

### 📊 **Role-Based Dashboard**

Each user role sees a completely different dashboard tailored to their needs:

#### 👨‍💼 **Admin Dashboard**

- **System Overview**: Total events, attendees, organizers, and system health
- **Management Tools**: Quick access to create events, manage organizers, add locations
- **System Monitoring**: Real-time activity feed and system alerts
- **Analytics**: Comprehensive statistics and performance metrics

#### 🎯 **Organizer Dashboard**

- **Event Management**: Create, edit, and monitor personal events
- **Performance Metrics**: Attendance rates, feedback scores, and growth statistics
- **Quick Actions**: Event creation, analytics, feedback review, and data export
- **Event Overview**: Visual timeline of upcoming and past events

#### 👨‍🎓 **Attendee Dashboard**

- **Personal Events**: Registered events and attendance history
- **Recommendations**: Smart event suggestions based on preferences
- **Categories**: Favorite event types and personalized content
- **Registration Management**: Easy event discovery and registration

### 📅 **Event Management**

- **Smart Calendar**: Interactive calendar with event registration
- **Event Creation**: Rich event forms with location and resource management
- **Capacity Management**: Real-time availability and registration limits
- **Recurring Events**: Support for weekly, monthly, and custom recurrence

### 👥 **User Management**

- **Attendee Profiles**: Comprehensive attendee information and history
- **Organizer Tools**: Role-specific management capabilities
- **Registration Tracking**: Complete registration and attendance analytics

### 🏢 **Location & Resource Management**

- **Venue Coordination**: Location capacity and availability management
- **Resource Allocation**: Equipment and facility booking system
- **Conflict Detection**: Automatic scheduling conflict prevention

### 💬 **Feedback System**

- **Post-Event Surveys**: Automated feedback collection
- **Rating Analytics**: Performance tracking and improvement insights
- **Response Management**: Centralized feedback review and response

## 🚀 **Technical Architecture**

### **Frontend Stack**

- **Next.js 14**: App Router with server-side rendering
- **React 18**: Modern hooks and component patterns
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first styling with custom design system

### **UI Components**

- **Reusable Components**: Button, Input, Card, Badge, Modal, Textarea
- **Layout System**: Responsive sidebar navigation and header
- **Design System**: Consistent spacing, colors, and typography
- **Accessibility**: WCAG compliant components and navigation

### **State Management**

- **Context API**: Authentication and user state management
- **Local Storage**: Session persistence and user preferences
- **React Hooks**: Component state and lifecycle management

### **Database Schema**

Comprehensive Prisma schema supporting:

- **Events**: Full event lifecycle management
- **Users**: Multi-role user system (Admin, Organizer, Attendee)
- **Locations**: Venue and resource management
- **Feedback**: Rating and comment system
- **Relationships**: Complex many-to-many associations

## 🎨 **Design Philosophy**

### **Visual Design**

- **Modern Aesthetic**: Clean, minimalist interface with strategic use of color
- **Responsive Layout**: Mobile-first design that scales beautifully
- **Apple-inspired**: Subtle gradients, rounded corners, and smooth animations
- **Accessibility**: High contrast ratios and screen reader support

### **User Experience**

- **Role-based Interface**: Each user sees only relevant features and data
- **Intuitive Navigation**: Logical information architecture and clear paths
- **Performance Focused**: Fast loading times and smooth interactions
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

## 🛡️ **Security & Access Control**

### **Authentication**

- **Role-based Access**: Granular permissions for different user types
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Secure token handling and logout functionality

### **Authorization**

- **Admin**: Full system access - manage all events, users, and settings
- **Organizer**: Event management - create, edit, and monitor own events
- **Attendee**: Event participation - browse, register, and provide feedback

## 📱 **Responsive Design**

- **Mobile First**: Optimized for smartphones and tablets
- **Flexible Layouts**: Grid systems that adapt to any screen size
- **Touch Friendly**: Large tap targets and intuitive gestures
- **Cross Browser**: Tested across modern browsers and devices

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+ and npm/pnpm
- Modern web browser
- Git for version control

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd event-management

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize the database
npx prisma migrate dev

# Start the development server
npm run dev
# or
pnpm dev
```

### **Demo Access**

Visit the home page and use the demo buttons to experience different user roles:

- **Admin Demo**: Full system access and management capabilities
- **Organizer Demo**: Event creation and management tools
- **Attendee Demo**: Event browsing and registration experience

## 🎯 **Key Differentiators**

1. **True Role-Based Experience**: Each user type gets a completely different interface
2. **Marketing-First Approach**: Beautiful home page that sells the system's value
3. **Integrated Calendar**: Full calendar functionality right on the home page
4. **University-Focused**: Purpose-built for academic institutions and campus life
5. **Modern Tech Stack**: Latest Next.js features with TypeScript and Tailwind
6. **Demo-Ready**: Instant role switching for presentations and testing

## 📈 **Future Enhancements**

- **Real-time Notifications**: WebSocket integration for live updates
- **Email Integration**: Automated event reminders and confirmations
- **Calendar Sync**: Integration with Google Calendar, Outlook, etc.
- **Mobile App**: React Native companion application
- **Analytics Dashboard**: Advanced reporting and insights
- **Multi-tenant Support**: Multiple university instances

## 🤝 **Contributing**

This is a demonstration project showcasing modern web development practices for university event management systems.

## 📄 **License**

This project is for educational and demonstration purposes.

---

**EventFlow** - *Streamlining Campus Events, One Click at a Time* 🎓✨
