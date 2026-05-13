import AdminDashboard from "../../components/admin/AdminDashboard/AdminDashboard";
import { useCandidates } from "../../hooks/useCandidates";

const AdminDashboardPage = () => {
  const { candidates, error, isLoading, reloadCandidates } = useCandidates();

  return (
    <AdminDashboard
      error={error}
      isLoading={isLoading}
      onRetry={reloadCandidates}
      pipelineCandidates={candidates}
    />
  );
};

export default AdminDashboardPage;
