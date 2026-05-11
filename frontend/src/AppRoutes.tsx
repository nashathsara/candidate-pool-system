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

const Dashboard = () => (
  <div className="dashboard">
    <h2>Dashboard</h2>
    <p>Welcome to CandidateHub</p>
  </div>
);

const Duplicates = () => (
  <div className="duplicates">
    <h2>Duplicates</h2>
    <p>Find duplicate candidate records</p>
  </div>
);

const Settings = () => (
  <div className="settings">
    <h2>Settings</h2>
    <p>Manage your account settings</p>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VerificationSuccess />} />
        <Route path="/verified" element={<VerificationSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/profile" element={<ProfileView />} />

        <Route path="/candidate/duplicate-check" element={<DuplicationView />} />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
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
          path="/duplicates"
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
        
        <Route path="/signup" element={<Signup />} />
        {/* Redirect root to signup for now so you see your work immediately */}
        <Route path="/" element={<Navigate to="/signup" />} /> 
        
        {/* Placeholders for your other assigned pages */}
        <Route path="/admin/settings" element={<div>Admin Settings (Coming Soon)</div>} />
        <Route path="/ticket-success" element={<div>Ticket Success (Coming Soon)</div>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
