import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import ProfileView from "./pages/ProfileView/ProfileView";
import MainLayout from "./Layout/MainLayout";
import Candidates from "./pages/Candidates/Candidates";

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
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfileView />
            </MainLayout>
          }
        />
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
              <Duplicates />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;