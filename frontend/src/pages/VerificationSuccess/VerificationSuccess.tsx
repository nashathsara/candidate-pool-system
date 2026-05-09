import "./VerificationSuccess.css";

import { useNavigate } from "react-router-dom";

const VerificationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="card">
        <div className="icon">✔</div>

        <h2>Identity Verified</h2>

        <p>
          Your account credentials have been successfully authenticated.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/candidates")}
        >
          Continue to Dashboard →
        </button>

        <button className="link-btn">
          View Verification Receipt
        </button>
      </div>
    </div>
  );
};

export default VerificationSuccess;