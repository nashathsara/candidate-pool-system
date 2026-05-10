<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import SignIn from './pages/Home/SignIn.tsx'
import BrowseJobs from './pages/BrowseJobs'
import ApplicationSuccess from './pages/ApplicationSuccess'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignIn />} />
          <Route path="/success" element={<ApplicationSuccess />} />
          <Route path="/submitted" element={<ApplicationSuccess />} />
          <Route path="/browse" element={<BrowseJobs />} />
          <Route path="/" element={<BrowseJobs />} />
          <Route path="*" element={<BrowseJobs />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
=======
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return <AppRoutes />;
}

export default App;
>>>>>>> 4d0d5e9cf670627f264b33f3be0a82fea11ad518
