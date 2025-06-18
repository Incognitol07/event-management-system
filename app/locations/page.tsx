import { MainLayout } from "@/components/layout/main-layout";
import { LocationsList } from "@/components/locations/locations-list";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function LocationsPage() {
  return (
    <ProtectedRoute requiredRoles={["admin", "organizer"]}>
      <MainLayout title="Locations">
        <LocationsList />
      </MainLayout>
    </ProtectedRoute>
  );
}
