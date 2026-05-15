import AdminDashboardWrapper from "../../components/admin/AdminDashboard/AdminDashboardWrapper";
import { useCandidates } from "../../hooks/useCandidates";

const AdminDashboardPage = () => {
  const { candidates } = useCandidates();

  return <AdminDashboardWrapper pipelineCandidates={candidates} />;
};

export default AdminDashboardPage;
