import { ResourceManagement } from "../../components/resources/resource-management";
import ProtectedHeader from "../../components/layout/protected-header";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProtectedHeader currentPage="resources" />
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <ResourceManagement />
      </div>
    </div>
  );
}
