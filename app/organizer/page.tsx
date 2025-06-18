import { OrganizerPortal } from "@/components/organizer/organizer-portal";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function OrganizerPage() {
  return (
    <ProtectedRoute requiredRoles={["admin", "organizer"]}>
      <MainLayout title="Organizer Portal">
        <OrganizerPortal />
      </MainLayout>
    </ProtectedRoute>
  );
}
