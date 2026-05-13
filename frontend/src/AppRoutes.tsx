import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import ProfileView from "./pages/ProfileView/ProfileView";
import ProfileMerge from "./pages/ProfileMerge/ProfileMerge";
import ProfileCancel from "./pages/ProfileCancel/ProfileCancel";
import MainLayout from "./Layout/MainLayout";
import Candidates from "./pages/Candidates/Candidates";
import DuplicateResolution from './pages/Admin/DuplicateResolution';
import CandidateSettings from './pages/Candidates/CandidateSettings';
import DuplicationView from './pages/Candidates/DuplicationView';
import ApplicationSuccess from './pages/ApplicationSuccess/ApplicationSuccess';
import BrowseJobs from './pages/BrowseJobs/BrowseJobs';
import SignIn from './pages/Home/SignIn';
import Signup from './pages/Admin/Signup';
import Settings from './pages/Admin/Settings';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import CandidateDetails from "./pages/CandidateDetails/CandidateDetails";
import ProfileCreate from "./pages/ProfileCreate/ProfileCreate";
import Home from "./pages/Home/Home";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";
import Applications from "./pages/Applications/Applications";

import HelpCenter from "./pages/HelpCenter/HelpCenter";

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
        <Route path="/ApplicationSuccess" element={<ApplicationSuccess />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/BrowseJobs" element={<BrowseJobs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/browse-jobs" element={<BrowseJobs />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/messages" element={<div>Messages (Coming Soon)</div>} />
        <Route path="/create-profile" element={
          <MainLayout>
            <ProfileCreate />
          </MainLayout>
        } />
        
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
          path="/profile"
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
          path="/duplicates"
          element={
            <MainLayout>
              <DuplicationView />
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
            </MainLayout>}/>
        <Route
          path="/candidate-details"
          element={
            <MainLayout>
              <CandidateDetails />
            </MainLayout>
          }
        />
        <Route
          path="/profile-create"
          element={
            <MainLayout>
              <ProfileCreate />
            </MainLayout>
          }
        />

          <Route 
          path="/ticket-success" 
          element={<div>Ticket Success (Coming Soon)</div>} />
  
          <Route path="/" element={<Navigate to="/signup" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;