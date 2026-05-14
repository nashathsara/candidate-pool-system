// AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import ProfileView from "./pages/ProfileView/ProfileView";
import ProfileMerge from "./pages/ProfileMerge/ProfileMerge";
import ProfileCancel from "./pages/ProfileCancel/ProfileCancel";
import MainLayout from "./Layout/MainLayout";
import Candidates from "./pages/Candidates/Candidates";
import CandidateSettings from './pages/Candidates/CandidateSettings';
import ApplicationSuccess from './pages/ApplicationSuccess/ApplicationSuccess';
import BrowseJobs from './pages/BrowseJobs/BrowseJobs';
import SignIn from './pages/Home/SignIn';
import Signup from './pages/Admin/Signup';
import Settings from './pages/Admin/Settings';
import CandidateSubmission from './components/CandidateSubmission';
import ViewCV from './components/ViewCV';
import Applications from "./pages/Applications/Applications";
import DuplicateResolution from "./pages/Admin/DuplicateResolution";

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
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/verified" element={<VerificationSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
        <Route path="/browse" element={<BrowseJobs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/applications" element={<Applications />} />
        
        {/* Candidate submission routes */}
        <Route 
          path="/submit-candidate" 
          element={
            <MainLayout>
              <CandidateSubmission />
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
        
        {/* View CV Route - with candidateId parameter */}
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
          path="/settings"
          element={
            <MainLayout>
              <CandidateSettings />
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
        
        <Route path="/" element={<Navigate to="/signup" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;