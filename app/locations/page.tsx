import { MainLayout } from "@/components/layout/main-layout";
import { LocationsList } from "@/components/locations/locations-list";

export default function LocationsPage() {
  return (
    <MainLayout title="Locations">
      <LocationsList />
    </MainLayout>
  );
}
