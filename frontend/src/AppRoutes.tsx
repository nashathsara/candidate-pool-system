import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import ProfileView from "./pages/ProfileView/ProfileView";
import ProfileMerge from "./pages/ProfileMerge/ProfileMerge";
import ProfileCancel from "./pages/ProfileCancel/ProfileCancel";
import MainLayout from "./Layout/MainLayout";
import Candidates from "./pages/Candidates/Candidates";
import ViewCV from './components/ViewCV';
import DuplicateResolution from "./pages/Admin/DuplicateResolution";
import CandidateSettings from "./pages/Candidates/CandidateSettings";
import DuplicationView from "./pages/Candidates/DuplicationView";
import ApplicationSuccess from "./pages/ApplicationSuccess/ApplicationSuccess";
import BrowseJobs from "./pages/BrowseJobs/BrowseJobs";
import SignIn from "./pages/Home/SignIn";
import Signup from "./pages/Admin/Signup";
import TicketSubmitForm from "./pages/TicketSubmitForm/TicketSubmitForm";
import Settings from "./pages/Admin/Settings";
import TicketSuccess from "./pages/TicketSuccess/TicketSuccess";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import ProfileCreate from "./pages/ProfileCreate/ProfileCreate";
import Home from "./pages/Home/Home";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";
import Applications from "./pages/Applications/Applications";
import CandidateSettingsPage from "./pages/CandidateSettingsPage/CandidateSettingsPage";

import HelpCenter from "./pages/HelpCenter/HelpCenter";
// Wrapper component to extract candidateId from URL params
const ViewCVWrapper = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  
  if (!candidateId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Invalid Candidate ID</h2>
        <p className="mt-2">No candidate ID provided in the URL.</p>
      </div>
    );
  }
  
  return <ViewCV candidateId={candidateId} />;
};


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (without MainLayout) */}
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/verified" element={<VerificationSuccess />} />
        <Route path="/EmailVerification" element={<EmailVerification />} />
        {/* <Route path="/candidate/duplicate-check" element={<DuplicationView />} /> */}
        <Route path="/applications" element={<Applications />} />
        <Route path="/application-success" element={<Navigate to="/browse" replace />} />
        <Route path="/application-success/:jobId" element={<ApplicationSuccess />} />

        {/* Case-insensitive-ish aliases (React Router paths are case-sensitive) */}
        <Route path="/BrowseJobs" element={<Navigate to="/browse" replace />} />
        <Route path="/browse" element={<BrowseJobs />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile/create" element={<ProfileCreate />} />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <AdminDashboardPage />
            </MainLayout>
          }
        />

        <Route
          path="/candidates"
          element={
            <MainLayout>
              <Candidates />
            </MainLayout>
          }
        />
        <Route
          path="/view-cv/:candidateId"
          element={
            <MainLayout>
              <ViewCVWrapper />
            </MainLayout>
          }
        />
        
        <Route
          path="/candidate-profile/:id"
          element={
            <MainLayout>
              <ProfileView />
            </MainLayout>
          }
        />
        <Route
          path="/profile-merge"
          element={
            <MainLayout>
              <ProfileMerge />
            </MainLayout>
          }
        />
        <Route
          path="/profile-cancel"
          element={
            <MainLayout>
              <ProfileCancel />
            </MainLayout>
          }
        />
        <Route
          path="/duplicates-admin"
          element={
            <MainLayout>
              <DuplicateResolution />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <CandidateSettings />
            </MainLayout>
          }
        />

        <Route
          path="/support"
          element={
            <MainLayout>
              <TicketSubmitForm />
            </MainLayout>
          }
        />

        <Route path="/ticket-success" element={<TicketSuccess />} />

        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;