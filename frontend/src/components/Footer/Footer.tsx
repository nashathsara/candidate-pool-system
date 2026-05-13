import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="browse-footer">
      <div className="footer-brand">
        <strong>CandidateHub</strong>
        <span>© 2024 CandidateHub Engineered for Excellence.</span>
      </div>
      <div className="footer-links">
        <Link to="/help">HELP CENTER</Link>
        <Link to="/terms">LEGAL</Link>
        <Link to="/privacy">PRIVACY POLICY</Link>
        <Link to="/contact">CONTACT SUPPORT</Link>
      </div>
    </footer>
  );
};

export default Footer;
