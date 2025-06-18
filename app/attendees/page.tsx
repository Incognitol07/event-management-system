import { MainLayout } from "@/components/layout/main-layout";
import { AttendeesList } from "@/components/attendees/attendees-list";

export default function AttendeesPage() {
  return (
    <MainLayout title="Attendees">
      <AttendeesList />
    </MainLayout>
  );
}
