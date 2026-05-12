import AdminDashboard from "../../components/admin/AdminDashboard/AdminDashboard";
import { useCandidates } from "../../hooks/useCandidates";

const AdminDashboardPage = () => {
  const { candidates } = useCandidates();

  return <AdminDashboard pipelineCandidates={candidates} />;
};

export default AdminDashboardPage;
