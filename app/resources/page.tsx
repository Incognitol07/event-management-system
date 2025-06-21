import { ResourceManagement } from "../../components/resources/resource-management";
import ProtectedHeader from "../../components/layout/protected-header";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProtectedHeader currentPage="resources" />
      <div >
        <ResourceManagement />
      </div>
    </div>
  );
}
