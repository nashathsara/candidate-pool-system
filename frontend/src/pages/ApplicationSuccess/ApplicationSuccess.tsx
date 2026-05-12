import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { submitApplication } from "../../services/firebaseService";

type RouteParams = {
  jobId?: string;
};

function ApplicationSuccess() {
  const navigate = useNavigate();
  const { jobId } = useParams<RouteParams>();
  const { user, loading, isSignedIn } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const canSubmit = useMemo(() => isSignedIn && !loading && !!jobId, [isSignedIn, loading, jobId]);

  useEffect(() => {
    // If we finished loading and are missing requirements, show an error instead of hanging
    if (!loading && (!isSignedIn || !jobId)) {
      setError(!isSignedIn ? "You must be signed in to submit an application." : "No Job ID found in URL.");
      return;
    }

    if (!canSubmit || submitting || submitted) return;

    const submit = async () => {
      try {
        setSubmitting(true);
        setError("");

        // Only pass a minimal userData; Firestore rules only require status/createdAt,
        // but your app may want more fields later.
        const result = await submitApplication(jobId as string, {
          // You can extend this when you have real profile data
          email: user?.email ?? null,
        });

        if (result?.success) {
          setSubmitted(true);
        } else {
          setError("Application submission failed.");
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Application submission failed.";
        setError(message);
      } finally {
        setSubmitting(false);
      }
    };

    void submit();
  }, [canSubmit, jobId, submitted, submitting, user?.email]);

  return (
    <div className="submitted-page">
      <main className="submitted-main">
        <div className="success-badge">
          <div className="success-icon">{submitted ? "✓" : "…"}</div>
        </div>

        <h1>{submitted ? "Application Submitted Successfully" : "Submitting Application..."}</h1>

        {error ? (
          <div className="error-banner" style={{ marginTop: 12 }}>
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <p>
            {submitted
              ? "Your profile has been shared with the recruitment team. We'll be in touch shortly regarding the next steps."
              : "Please wait while we submit your application."}
          </p>
        )}

        <div className="actions-row">
          <button
            className="primary-button"
            type="button"
            disabled={!submitted || submitting}
            onClick={() => navigate("/browse")}
          >
            Go to Browse Jobs →
          </button>
          <button className="secondary-button" type="button" onClick={() => navigate("/candidates")}>
            View Submitted Profile
          </button>
        </div>

        <p className="support-copy">
          Questions about your application? <Link to="/support">Contact Support</Link>
        </p>
      </main>

      <footer className="submitted-footer">
        <span>© 2024 WHS Solution Recruitment Suite. All rights reserved.</span>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
}

export default ApplicationSuccess;
