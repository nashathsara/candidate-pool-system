import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerificationSuccess from "./pages/VerificationSuccess/VerificationSuccess";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VerificationSuccess />} />
        <Route path="*" element={
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '18px', color: '#666' }}>
            Page not found - Try <a href="/">home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
