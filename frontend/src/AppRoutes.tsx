import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
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
import ApplicationSuccess from "./pages/ApplicationSuccess/ApplicationSuccess";
import BrowseJobs from "./pages/BrowseJobs/BrowseJobs";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";
import HelpCenter from "./pages/HelpCenter/HelpCenter";
import SignIn from "./pages/Home/SignIn";
import Signup from "./pages/Admin/Signup";
import TicketSubmitForm from "./pages/TicketSubmitForm/TicketSubmitForm";
import Settings from "./pages/Admin/Settings";
import TicketSuccess from "./pages/TicketSuccess/TicketSuccess";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import CandidateDetails from "./pages/CandidateDetails/CandidateDetails";
import ProfileCreate from "./pages/ProfileCreate/ProfileCreate";
import Home from "./pages/Home/Home";
import Applications from "./pages/Applications/Applications";
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

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { isSignedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============ PUBLIC ROUTES ============ */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* Authentication Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/EmailVerification" element={<EmailVerification />} />
        <Route path="/verified" element={<VerificationSuccess />} />
        
        {/* ============ CANDIDATE FLOW ============ */}
        {/* Profile Setup */}
        <Route 
          path="/profile/create" 
          element={
            <RequireAuth>
              <ProfileCreate />
            </RequireAuth>
          }
        />
        
        {/* Candidate Protected Routes */}
        <Route
          path="/browse"
          element={
            <RequireAuth>
              <BrowseJobs />
            </RequireAuth>
          }
        />
        <Route
          path="/applications"
          element={
            <RequireAuth>
              <Applications />
            </RequireAuth>
          }
        />
        <Route 
          path="/application-success/:jobId" 
          element={<ApplicationSuccess />} 
        />
        
        <Route
          path="/candidate-dashboard"
          element={
            <RequireAuth>
              <CandidateDashboard />
            </RequireAuth>
          }
        />
        
        <Route
          path="/profile-merge"
          element={
            <RequireAuth>
              <ProfileMerge />
            </RequireAuth>
          }
        />
        
        <Route
          path="/support"
          element={
            <RequireAuth>
              <TicketSubmitForm />
            </RequireAuth>
          }
        />
        <Route path="/ticket-success" element={<TicketSuccess />} />
        
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <CandidateSettings />
            </RequireAuth>
          }
        />
        
        <Route
          path="/help"
          element={
            <RequireAuth>
              <HelpCenter />
            </RequireAuth>
          }
        />
        
        {/* ============ ADMIN FLOW ============ */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <MainLayout>
                <AdminDashboardPage />
              </MainLayout>
            </RequireAuth>
          }
        />
        
        <Route
          path="/candidates"
          element={
            <RequireAuth>
              <MainLayout>
                <Candidates />
              </MainLayout>
            </RequireAuth>
          }
        />
        
        <Route
          path="/candidate-profile/:id"
          element={
            <RequireAuth>
              <MainLayout>
                <ProfileView />
              </MainLayout>
            </RequireAuth>
          }
        />
        
        <Route
          path="/view-cv/:candidateId"
          element={
            <RequireAuth>
              <MainLayout>
                <ViewCVWrapper />
              </MainLayout>
            </RequireAuth>
          }
        />
        
        <Route
          path="/duplicates-admin"
          element={
            <RequireAuth>
              <MainLayout>
                <DuplicateResolution />
              </MainLayout>
            </RequireAuth>
          }
        />
        
        <Route
          path="/admin/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        
        {/* ============ DEPRECATED/LEGACY ROUTES (Redirects) ============ */}
        <Route path="/BrowseJobs" element={<Navigate to="/browse" replace />} />
        <Route path="/browse-jobs" element={<Navigate to="/browse" replace />} />
        <Route path="/jobs" element={<Navigate to="/browse" replace />} />
        <Route path="/profile" element={<Navigate to="/candidate-dashboard" replace />} />
        <Route path="/application-success" element={<Navigate to="/browse" replace />} />
        
        {/* Legacy Route */}
        <Route
          path="/profile-cancel"
          element={
            <RequireAuth>
              <ProfileCancel />
            </RequireAuth>
          }
        />
        
        {/* ============ 404 FALLBACK ============ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;