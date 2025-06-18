import { EventCalendar } from "@/components/calendar/event-calendar";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <MainLayout title="Calendar">
        <EventCalendar />
      </MainLayout>
    </ProtectedRoute>
  );
}
