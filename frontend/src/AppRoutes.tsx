import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import ProfileView from "./pages/ProfileView/ProfileView";
import MainLayout from "./Layout/MainLayout";
import Candidates from "./pages/Candidates/Candidates";
import DuplicateResolution from './pages/Admin/DuplicateResolution';
import CandidateSettings from './pages/Candidates/CandidateSettings';
import DuplicationView from './pages/Candidates/DuplicationView';
import Signup from './pages/Admin/Signup';
import Settings from './pages/Admin/Settings';

// IMPORTANT: Do not define "const Settings" or "const CandidateSettings" here!
// Doing so creates a conflict with the imports above.

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Your Assigned Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/settings" element={<Settings />} />
        
        {/* Candidate & Team Pages */}
        <Route path="/settings" element={<MainLayout><CandidateSettings /></MainLayout>} />
        <Route path="/candidates" element={<MainLayout><Candidates /></MainLayout>} />
        <Route path="/duplicates" element={<MainLayout><DuplicateResolution /></MainLayout>} />
        
        {/* Verification & Profile */}
        <Route path="/verified" element={<VerificationSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/candidate/duplicate-check" element={<DuplicationView />} />

        {/* Redirect root to your work */}
        <Route path="/" element={<Navigate to="/signup" />} /> 
        
        <Route path="/ticket-success" element={<div>Ticket Success (Coming Soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;