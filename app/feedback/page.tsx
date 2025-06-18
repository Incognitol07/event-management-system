import { FeedbackList } from "@/components/feedback/feedback-list";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function FeedbackPage() {
  return (
    <ProtectedRoute requiredRoles={["admin", "organizer"]}>
      <MainLayout title="Feedback">
        <FeedbackList />
      </MainLayout>
    </ProtectedRoute>
  );
}
