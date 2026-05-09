import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import ProfileView from './pages/ProfileView/ProfileView';
import EmailVerification from './pages/EmailVerification/EmailVerification';
import './App.css';

// Move dashboard, duplicates, settings components here or import them
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route 
            path="/dashboard" 
            element={
              <MainLayout>
                <Dashboard />
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
      </div>
    </Router>
  );
}

export default App;