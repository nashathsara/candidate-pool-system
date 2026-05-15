import './Home.css'
import { Link } from 'react-router-dom'
import { Search, Check, Star, Users, Shield, Clock, TrendingUp, Globe, Award, ChevronRight, ArrowRight } from 'lucide-react'

function Home() {
  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>CandidateHub</h2>
          </div>
          <div className="nav-actions">
            <Link to="/signup" className="nav-btn nav-btn-outline">Sign Up</Link>
            <Link to="/signin" className="nav-btn nav-btn-primary">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Find & Hire Expert Freelancers</h1>
            <p className="hero-description">
              Work with the best freelance talent from around the world on our secure collaborative platform.
            </p>
            <div className="hero-search">
              <div className="search-container">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Try &quot;building mobile app&quot;" 
                  className="search-input"
                />
                <button className="search-btn">Find Talent</button>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">60M+</span>
                <span className="stat-label">Total Freelancers</span>
              </div>
              <div className="stat">
                <span className="stat-number">220+</span>
                <span className="stat-label">Countries Served</span>
              </div>
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">Client Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/api/placeholder/600/400" alt="Freelancer working" />
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="what-you-get">
        <div className="container">
          <h2 className="section-title">What you get</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3>Talent to scale</h3>
              <p>Access a network of skilled professionals ready to help your business grow</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Verified work</h3>
              <p>Every freelancer is vetted to ensure quality and reliability</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock />
              </div>
              <h3>Fast hiring</h3>
              <p>Find and hire talent in as little as 24 hours</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award />
              </div>
              <h3>Quality guarantee</h3>
              <p>Get the results you need or your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Top Talent Section */}
      <section className="find-talent">
        <div className="container">
          <h2 className="section-title">Find Top Talent</h2>
          <div className="talent-grid">
            {[
              { title: 'Software Engineer', desc: 'Build, test, and maintain software applications' },
              { title: 'Data Scientist', desc: 'Analyze complex data and provide insights' },
              { title: 'UI/UX Designer', desc: 'Create beautiful and functional user interfaces' },
              { title: 'Mobile Developer', desc: 'Build native and cross-platform mobile apps' },
              { title: 'DevOps Engineer', desc: 'Streamline development and deployment processes' },
              { title: 'Product Manager', desc: 'Lead product strategy and development' },
              { title: 'Content Writer', desc: 'Create engaging content for your audience' },
              { title: 'Digital Marketer', desc: 'Drive growth through digital marketing strategies' },
              { title: 'Business Analyst', desc: 'Analyze business processes and recommend improvements' }
            ].map((talent, index) => (
              <div key={index} className="talent-card">
                <div className="talent-icon">
                  <Users />
                </div>
                <h3>{talent.title}</h3>
                <p>{talent.desc}</p>
              </div>
            ))}
          </div>
          <button className="see-all-btn">See All Talent <ChevronRight /></button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose">
        <div className="why-choose-container">
          <div className="why-choose-content">
            <h2>Why Over 2M+ People Choose Us</h2>
            <p>Trusted by millions of businesses and freelancers worldwide</p>
            <ul className="why-features">
              <li><Check /> Trusted by millions of businesses</li>
              <li><Check /> Secure payment protection</li>
              <li><Check /> 24/7 customer support</li>
              <li><Check /> Easy collaboration tools</li>
            </ul>
            <button className="learn-more-btn">Learn More <ArrowRight /></button>
          </div>
          <div className="why-choose-image">
            <img src="/api/placeholder/500/600" alt="Professional working" />
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome">
        <div className="container">
          <h2 className="section-title">Welcome to Your New Work Place</h2>
          <div className="welcome-grid">
            <div className="welcome-card">
              <div className="welcome-icon">
                <TrendingUp />
              </div>
              <h3>Grow Your Business</h3>
              <p>Access top talent to scale your operations efficiently</p>
            </div>
            <div className="welcome-card">
              <div className="welcome-icon">
                <Globe />
              </div>
              <h3>Global Talent Pool</h3>
              <p>Connect with professionals from around the world</p>
            </div>
            <div className="welcome-card">
              <div className="welcome-icon">
                <Shield />
              </div>
              <h3>Secure Platform</h3>
              <p>Your data and payments are always protected</p>
            </div>
            <div className="welcome-card">
              <div className="welcome-icon">
                <Clock />
              </div>
              <h3>Fast Results</h3>
              <p>Get started quickly and see results in days, not months</p>
            </div>
          </div>
          <button className="feedback-btn">Get Your Feedback <ArrowRight /></button>
        </div>
      </section>

      {/* Work Your Way Section */}
      <section className="work-your-way">
        <div className="work-container">
          <div className="work-image">
            <img src="/api/placeholder/600/400" alt="Laptop with work interface" />
          </div>
          <div className="work-content">
            <h2>Work Your Way</h2>
            <p>Choose the working arrangement that fits your needs</p>
            <div className="work-options">
              <div className="work-option">
                <h3>Hire for a project</h3>
                <p>Get specific tasks done by experts</p>
              </div>
              <div className="work-option">
                <h3>Hire full-time</h3>
                <p>Find long-term team members</p>
              </div>
              <div className="work-option">
                <h3>Hire hourly</h3>
                <p>Pay for time as you need it</p>
              </div>
            </div>
            <button className="learn-more-btn">Learn More <ArrowRight /></button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security">
        <div className="security-container">
          <div className="security-content">
            <h2>Security You Can Trust</h2>
            <p>Enterprise-grade security to protect your business</p>
            <ul className="security-features">
              <li><Check /> End-to-end encryption</li>
              <li><Check /> Two-factor authentication</li>
              <li><Check /> Regular security audits</li>
              <li><Check /> GDPR compliant</li>
            </ul>
            <button className="get-started-btn">Get Started Now <ArrowRight /></button>
          </div>
          <div className="security-visual">
            <div className="gears">
              <div className="gear gear-1"></div>
              <div className="gear gear-2"></div>
              <div className="gear gear-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Meet Our Clients</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src="/api/placeholder/60/60" alt="Client" />
                <div>
                  <h4>Sarah Johnson</h4>
                  <p>CEO, TechStart</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => <Star key={i} className="star" fill="#FFB800" />)}
              </div>
              <p>"CandidateHub helped us find amazing talent quickly. The quality of freelancers is outstanding!"</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src="/api/placeholder/60/60" alt="Client" />
                <div>
                  <h4>Michael Chen</h4>
                  <p>CTO, InnovateCo</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => <Star key={i} className="star" fill="#FFB800" />)}
              </div>
              <p>"We've hired over 20 freelancers through CandidateHub. The platform is secure and reliable."</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <img src="/api/placeholder/60/60" alt="Client" />
                <div>
                  <h4>Emily Davis</h4>
                  <p>Product Manager, GrowthLab</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => <Star key={i} className="star" fill="#FFB800" />)}
              </div>
              <p>"The best platform for finding specialized talent. Saved us months of recruitment time."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Insights Section */}
      <section className="insights">
        <div className="container">
          <h2 className="section-title">Global Insights</h2>
          <div className="insights-grid">
            {[
              {
                image: '/api/placeholder/300/200',
                title: 'The Future of Remote Work',
                date: 'March 15, 2024',
                desc: 'How companies are adapting to distributed teams...'
              },
              {
                image: '/api/placeholder/300/200',
                title: 'Hiring Trends in Tech',
                date: 'March 12, 2024',
                desc: 'Latest insights on tech recruitment and skill demands...'
              },
              {
                image: '/api/placeholder/300/200',
                title: 'Freelance Economy Growth',
                date: 'March 10, 2024',
                desc: 'The rapid expansion of the global freelance market...'
              },
              {
                image: '/api/placeholder/300/200',
                title: 'AI and the Future of Work',
                date: 'March 8, 2024',
                desc: 'How artificial intelligence is changing work...'
              }
            ].map((insight, index) => (
              <div key={index} className="insight-card">
                <img src={insight.image} alt={insight.title} />
                <div className="insight-content">
                  <h3>{insight.title}</h3>
                  <p className="insight-date">{insight.date}</p>
                  <p>{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Insights <ChevronRight /></button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Find the right talent for your business</h2>
          <p>Join millions of companies already using CandidateHub</p>
          <button className="post-job-btn">Post a Job Now <ArrowRight /></button>
        </div>
      </section>

      {/* Browse Freelancers Section */}
      <section className="browse-freelancers">
        <div className="container">
          <h2 className="section-title">Browse Freelancers by Category</h2>
          <div className="categories-grid">
            {[
              'Development & IT', 'Design & Creative', 'Digital Marketing', 
              'Writing & Translation', 'Video & Animation', 'Music & Audio',
              'Business', 'Sales & Marketing', 'Engineering & Architecture'
            ].map((category, index) => (
              <div key={index} className="category-card">
                <Link to={`/browse?category=${category.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>
                  {category} <ChevronRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/press">Press</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Categories</h3>
              <ul>
                <li><Link to="/categories/development">Development & IT</Link></li>
                <li><Link to="/categories/design">Design & Creative</Link></li>
                <li><Link to="/categories/marketing">Digital Marketing</Link></li>
                <li><Link to="/categories/writing">Writing & Translation</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/community">Community</Link></li>
                <li><Link to="/events">Events</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Support</h3>
              <ul>
                <li><Link to="/support">24/7 Support</Link></li>
                <li><Link to="/trust">Trust & Safety</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Community</h3>
              <ul>
                <li><Link to="/forum">Forum</Link></li>
                <li><Link to="/meetups">Meetups</Link></li>
                <li><Link to="/podcast">Podcast</Link></li>
                <li><Link to="/newsletter">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="social-links">
              {/* Add social media icons here */}
            </div>
            <p>&copy; 2024 CandidateHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
