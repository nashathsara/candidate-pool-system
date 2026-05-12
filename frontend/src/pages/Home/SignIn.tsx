import './SignIn.css'

function SignIn() {
  return (
    <div className="signin-page">
      <div className="signin-header-bar">
        <div className="brand-logo">
          <span className="brand-mark">🗂️</span>
          CandidateHub
        </div>
      </div>

      <div className="signin-wrapper">
        <div className="signin-card">
          <div className="card-header">
            <h1>Sign In</h1>
            <p>Welcome back to the TalentPulse Portal</p>
          </div>

          <div className="social-actions">
            <button type="button" className="social-btn google">
              <span className="icon">G</span>
              Google
            </button>
            <button type="button" className="social-btn linkedin">
              <span className="icon">in</span>
              LinkedIn
            </button>
          </div>

          <div className="divider">
            <span>OR EMAIL</span>
          </div>

          <form className="auth-form">
            <label className="field">
              <span>Email Address</span>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input type="email" placeholder="name@company.com" />
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
                <span className="input-icon">🔒</span>
                <input type="password" placeholder="••••••••" />
              </div>
            </label>

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button type="submit" className="primary-btn">
              Sign In to Portal
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
  )
}

export default SignIn
