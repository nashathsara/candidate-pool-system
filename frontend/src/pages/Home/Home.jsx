import './Home.css'
import { Link } from 'react-router-dom'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import Footer from '../../components/Footer/Footer'

function Home() {
  return (
    <div className="home-page">
      <NavigationBar />
      <header className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <div className="eyebrow">CandidateHub • Global Talent Pool</div>
            <h1>
              Find the right candidates.
              <span className="accent"> Faster</span>.
            </h1>
            <p>
              Browse jobs, manage candidate profiles, and run duplication checks—built for
              speed, clarity, and secure collaboration.
            </p>

            <div className="home-hero-actions">
              <Link to="/browse" className="primary-btn">
                Browse Jobs
              </Link>
              <Link to="/signin" className="secondary-btn">
                Sign In
              </Link>
            </div>

            <div className="home-hero-metrics" aria-label="Key product highlights">
              <div className="metric">
                <div className="metric-top">Duplication protection</div>
                <div className="metric-sub">Catch similar profiles early</div>
              </div>
              <div className="metric">
                <div className="metric-top">Profile management</div>
                <div className="metric-sub">Organize candidates confidently</div>
              </div>
              <div className="metric">
                <div className="metric-top">Guided onboarding</div>
                <div className="metric-sub">Verification & quick success pages</div>
              </div>
            </div>
          </div>

          <div className="home-hero-visual" aria-hidden="true">
            <div className="visual-card">
              <div className="visual-header">
                <span className="dot dot-blue" />
                <span className="dot dot-green" />
                <span className="dot dot-amber" />
                <span className="visual-title">Talent Snapshot</span>
              </div>
              <div className="visual-body">
                <div className="pulse-bar">
                  <div className="pulse-fill" />
                </div>
                <div className="chips">
                  <span className="chip">JavaScript</span>
                  <span className="chip">React</span>
                  <span className="chip">System Design</span>
                  <span className="chip">Data Modeling</span>
                </div>
                <div className="mini-grid">
                  <div className="mini">
                    <div className="mini-label">Match score</div>
                    <div className="mini-value">92</div>
                  </div>
                  <div className="mini">
                    <div className="mini-label">Duplicates</div>
                    <div className="mini-value">Low</div>
                  </div>
                  <div className="mini">
                    <div className="mini-label">Status</div>
                    <div className="mini-value">Verified</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="visual-glow" />
          </div>
        </div>
      </header>

      <section className="home-section">
        <div className="section-head">
          <h2>Why teams choose CandidateHub</h2>
          <p>Everything you need for faster hiring workflows—without the clutter.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              ⏱️
            </div>
            <h3>Speed-first workflow</h3>
            <p>Jump from browsing to candidate actions with a clean, focused UI.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              🛡️
            </div>
            <h3>Duplication checks</h3>
            <p>Reduce rework by catching similar profiles during review.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              🧩
            </div>
            <h3>Profile merging</h3>
            <p>Keep candidate information organized as profiles evolve.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              🔒
            </div>
            <h3>Verified experience</h3>
            <p>Confirmation and success flows keep users informed and confident.</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>How it works</h2>
          <p>Simple steps for a smoother candidate journey.</p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-index">1</div>
            <div className="step-body">
              <h3>Browse</h3>
              <p>Explore available jobs and open candidate tools when ready.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-index">2</div>
            <div className="step-body">
              <h3>Review</h3>
              <p>Check candidate details and run duplication checks to find overlaps.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-index">3</div>
            <div className="step-body">
              <h3>Resolve</h3>
              <p>Merge profiles or move forward—backed by clear confirmation flows.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta-inner">
          <div className="home-cta-copy">
            <h2>Ready to explore candidates?</h2>
            <p>Get started in seconds. Browse jobs or sign in to manage profiles.</p>
          </div>

          <div className="home-cta-actions">
            <Link to="/browse" className="primary-btn">
              Browse Jobs
            </Link>
            <Link to="/signin" className="secondary-btn">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
