import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import {
  RequireAuth,
  RequireAdminRole,
  RequireRecruiterOrAdmin,
  RequirePermission,
} from "./components/RouteGuards";
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
import InterviewManagementPage from "./pages/Admin/InterviewManagementPage";
import AutomationPage from "./pages/Admin/AutomationPage";
import OutcomePage from "./pages/Admin/OutcomePage";
import ActionsPage from "./pages/Admin/ActionsPage";
import AdminSetup from "./pages/Admin/AdminSetup";
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
        {/* ============ PUBLIC ROUTES ============ */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* Authentication Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/EmailVerification" element={<EmailVerification />} />
        <Route path="/verified" element={<VerificationSuccess />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        
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
        
        {/* ============ ADMIN FLOW (WITH RBAC) ============ */}
        {/* Dashboard - Admin/Recruiter/Hiring Manager only */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <RequireRecruiterOrAdmin>
                <MainLayout>
                  <AdminDashboardPage />
                </MainLayout>
              </RequireRecruiterOrAdmin>
            </RequireAuth>
          }
        />
        
        {/* Candidate Management - Admin/Recruiter only */}
        <Route
          path="/candidates"
          element={
            <RequireAuth>
              <RequireRecruiterOrAdmin>
                <MainLayout>
                  <Candidates />
                </MainLayout>
              </RequireRecruiterOrAdmin>
            </RequireAuth>
          }
        />
        
        {/* Candidate Profile - Admin/Recruiter/Hiring Manager */}
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
        
        {/* CV Viewer - Admin/Recruiter/Hiring Manager */}
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
        
        {/* Duplicate Resolution - Admin/Recruiter only */}
        <Route
          path="/duplicates-admin"
          element={
            <RequireAuth>
              <RequireRecruiterOrAdmin>
                <MainLayout>
                  <RequirePermission requiredPermission="canViewDuplicates">
                    <DuplicateResolution />
                  </RequirePermission>
                </MainLayout>
              </RequireRecruiterOrAdmin>
            </RequireAuth>
          }
        />
        
        {/* Interview Management - Admin/Recruiter/Hiring Manager */}
        <Route
          path="/interviews"
          element={
            <RequireAuth>
              <RequireRecruiterOrAdmin>
                <MainLayout>
                  <RequirePermission requiredPermission="canManageInterviews">
                    <InterviewManagementPage />
                  </RequirePermission>
                </MainLayout>
              </RequireRecruiterOrAdmin>
            </RequireAuth>
          }
        />
        
        {/* Automation - Admin only */}
        <Route
          path="/automation"
          element={
            <RequireAuth>
              <RequireAdminRole>
                <MainLayout>
                  <AutomationPage />
                </MainLayout>
              </RequireAdminRole>
            </RequireAuth>
          }
        />
        
        {/* Outcomes - Admin/Recruiter/Hiring Manager */}
        <Route
          path="/outcomes"
          element={
            <RequireAuth>
              <RequireRecruiterOrAdmin>
                <MainLayout>
                  <RequirePermission requiredPermission="canViewReports">
                    <OutcomePage />
                  </RequirePermission>
                </MainLayout>
              </RequireRecruiterOrAdmin>
            </RequireAuth>
          }
        />
        
        {/* Actions - Admin/Recruiter only */}
        <Route
          path="/actions"
          element={
            <RequireAuth>
              <RequireRecruiterOrAdmin>
                <MainLayout>
                  <ActionsPage />
                </MainLayout>
              </RequireRecruiterOrAdmin>
            </RequireAuth>
          }
        />
        
        {/* Admin Settings - Admin only */}
        <Route
          path="/admin/settings"
          element={
            <RequireAuth>
              <RequireAdminRole>
                <Settings />
              </RequireAdminRole>
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