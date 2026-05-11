import './ApplicationSuccess.css'

function ApplicationSuccess() {
  return (
    <div className="submitted-page">
      <main className="submitted-main">
        <div className="success-badge">
          <div className="success-icon">✓</div>
        </div>
        <h1>Application Submitted Successfully</h1>
        <p>
          Your profile has been shared with the recruitment team. We'll be in touch shortly
          regarding the next steps.
        </p>

        <div className="actions-row">
          <button className="primary-button">Go to Dashboard →</button>
          <button className="secondary-button">View Submitted Profile</button>
        </div>

        <p className="support-copy">
          Questions about your application? <a href="/support">Contact Support</a>
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
  )
}

export default ApplicationSuccess
