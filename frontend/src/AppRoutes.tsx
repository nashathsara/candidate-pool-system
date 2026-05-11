import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import ProfileView from "./pages/ProfileView/ProfileView";
import AdminLayout from "./layouts/AdminLayout";
import Candidates from "./pages/Candidates/Candidates";
import DuplicateResolution from "./pages/Admin/DuplicateResolution";
import CandidateSettings from "./pages/Candidates/CandidateSettings";
import DuplicationView from "./pages/Candidates/DuplicationView";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import CandidateDetails from "./pages/CandidateDetails/CandidateDetails";
import ProfileCreate from "./pages/ProfileCreate/ProfileCreate";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VerificationSuccess />} />
        <Route path="/verified" element={<VerificationSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/profile" element={<ProfileView />} />

        <Route path="/profile/create" element={<ProfileCreate />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />

        <Route path="/candidate/duplicate-check" element={<DuplicationView />} />

        <Route
          path="/dashboard"
          element={
            <AdminLayout headerTitle="Dashboard Overview">
              <AdminDashboardPage />
            </AdminLayout>
          }
        />
        <Route
          path="/candidates"
          element={
            <AdminLayout>
              <Candidates />
            </AdminLayout>
          }
        />
        <Route
          path="/candidates/:candidateId"
          element={
            <AdminLayout>
              <CandidateDetails />
            </AdminLayout>
          }
        />
        <Route
          path="/duplicates"
          element={
            <AdminLayout>
              <DuplicateResolution />
            </AdminLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AdminLayout>
              <CandidateSettings />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
