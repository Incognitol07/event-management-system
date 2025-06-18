import { MainLayout } from "@/components/layout/main-layout";
import { EventsList } from "@/components/events/events-list";

export default function EventsPage() {
  return (
    <MainLayout title="Events">
      <EventsList />
    </MainLayout>
  );
}
