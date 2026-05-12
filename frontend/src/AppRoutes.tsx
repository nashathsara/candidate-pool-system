
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import ProfileView from "./pages/ProfileView/ProfileView";
import ProfileMerge from "./pages/ProfileMerge/ProfileMerge";
import MainLayout from "./Layout/MainLayout";
import Candidates from "./pages/Candidates/Candidates";
import DuplicateResolution from './pages/Admin/DuplicateResolution';
import CandidateSettings from './pages/Candidates/CandidateSettings';
import DuplicationView from './pages/Candidates/DuplicationView';
import ApplicationSuccess from './pages/ApplicationSuccess/ApplicationSuccess';
import BrowseJobs from './pages/BrowseJobs/BrowseJobs';
import SignIn from './pages/Home/SignIn';
import Signup from './pages/Admin/Signup';
import TicketSubmitForm from "./pages/TicketSubmitForm/TicketSubmitForm";
import Settings from './pages/Admin/Settings';


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (without MainLayout) */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/" element={<VerificationSuccess />} />
        <Route path="/verified" element={<VerificationSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        {/* <Route path="/candidate/duplicate-check" element={<DuplicationView />} /> */}
        <Route path="/application-success" element={<Navigate to="/browse" replace />} />
        <Route path="/application-success/:jobId" element={<ApplicationSuccess />} />

        {/* Case-insensitive-ish aliases (React Router paths are case-sensitive) */}
        <Route path="/BrowseJobs" element={<Navigate to="/browse" replace />} />
        <Route path="/browse" element={<BrowseJobs />} />

        <Route path="/signin" element={<SignIn />} />
        
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
          path="/support"
          element={
            <MainLayout>
              <TicketSubmitForm />
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
