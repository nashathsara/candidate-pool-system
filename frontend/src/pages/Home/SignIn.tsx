import React, { useEffect, useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailPassword, signInWithGoogle, signInWithLinkedIn } from "../../config/firebase.js";
import { useAuth } from "../../hooks/useAuth";

function SignIn() {
  const navigate = useNavigate();
  const { isSignedIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!loading && isSignedIn) navigate("/browse");
  }, [isSignedIn, loading, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await signInWithEmailPassword(email, password);
      navigate("/browse");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      setSubmitting(true);
      await signInWithGoogle();
      navigate("/browse");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkedIn = async () => {
    setError("");
    try {
      setSubmitting(true);
      await signInWithLinkedIn();
      navigate("/browse");
    } catch (err) {
      const message = err instanceof Error ? err.message : "LinkedIn sign-in failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-header-bar">
        <div className="brand-logo">CandidateHub</div>
      </div>

      <div className="signin-wrapper">
        <div className="signin-card">
          <div className="card-header">
            <h1>Sign In</h1>
            <p>Welcome back to the TalentPulse Portal</p>
          </div>

          <div className="social-actions">
            <button
              type="button"
              className="social-btn google"
              onClick={handleGoogle}
              disabled={submitting}
            >
              <span className="social-icon google-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.64 9.2045C17.64 8.5655 17.577 7.9585 17.468 7.3745H9V10.8265H13.84C13.692 11.8725 13.044 12.7545 12.026 13.3065V15.7965H14.938C16.878 14.2035 17.64 11.9725 17.64 9.2045Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18C11.43 18 13.44 17.13 14.94 15.7965L12.026 13.3065C11.25 13.8265 10.264 14.1345 9 14.1345C6.67 14.1345 4.74 12.6385 4.11 10.5425H1.08V13.1515C2.58 15.9765 5.52 18 9 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.11 10.5425C3.96 10.0015 3.86 9.4275 3.86 8.8285C3.86 8.2295 3.96 7.6555 4.11 7.1145V4.5055H1.08C0.39 5.9385 0 7.3695 0 8.8285C0 10.2875 0.39 11.7185 1.08 13.1515L4.11 10.5425Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.5225C10.62 3.5225 11.992 4.1155 12.938 5.1235L15.042 3.0195C13.44 1.5015 11.43 0.6 9 0.6C5.52 0.6 2.58 2.6235 1.08 5.4485L4.11 7.0575C4.74 4.9615 6.67 3.5225 9 3.5225Z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              Google
            </button>

            <button
              type="button"
              className="social-btn linkedin"
              onClick={handleLinkedIn}
              disabled={submitting}
            >
              <span className="social-icon linkedin-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.25 6.75H5.25V16.5H2.25V6.75ZM3.75 0.75C2.3 0.75 1.125 1.925 1.125 3.375C1.125 4.825 2.3 6 3.75 6C5.2 6 6.375 4.825 6.375 3.375C6.375 1.925 5.2 0.75 3.75 0.75ZM7.875 6.75H10.5V8.25H10.575C11.025 7.425 12.075 6.75 13.575 6.75C16.35 6.75 16.875 8.55 16.875 11.025V16.5H13.875V11.925C13.875 10.575 13.875 9.075 12.075 9.075C10.275 9.075 10.05 10.35 10.05 11.85V16.5H7.05V6.75H7.875Z"
                    fill="#0A66C2"
                  />
                </svg>
              </span>
              LinkedIn
            </button>
          </div>

          <div className="divider">
            <span>OR EMAIL</span>
          </div>

          <form className="auth-form" onSubmit={handleEmailSubmit}>
            <label className="field">
              <span>Email Address</span>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 4.5H15.75C16.1642 4.5 16.5 4.83579 16.5 5.25V12.75C16.5 13.1642 16.1642 13.5 15.75 13.5H2.25C1.83579 13.5 1.5 13.1642 1.5 12.75V5.25C1.5 4.83579 1.83579 4.5 2.25 4.5Z"
                      stroke="#64748B"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.5 5.25L8.99999 9.375L16.5 5.25"
                      stroke="#64748B"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="field">
              <div className="field-label-row">
                <span>Password</span>
                <a href="#" className="forgot">
                  Forgot password?
                </a>
              </div>

              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5 7.875V6.75C13.5 4.34315 11.4069 2.25 9 2.25C6.59315 2.25 4.5 4.34315 4.5 6.75V7.875"
                      stroke="#64748B"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3.75"
                      y="7.875"
                      width="10.5"
                      height="6.75"
                      rx="1.5"
                      stroke="#64748B"
                      strokeWidth="1.25"
                    />
                    <path
                      d="M9 11.25V12.75"
                      stroke="#64748B"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </label>

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            {error && <div className="error-banner">{error}</div>}

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="card-footer">
            New to TalentMatch? <a href="#">Sign up</a>
          </div>
        </div>

        <footer className="page-footer">
          <p>© 2024 TalentMatch System. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SignIn;
