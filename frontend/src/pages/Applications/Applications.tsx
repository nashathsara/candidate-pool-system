import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, FileText, HelpCircle, Bell, Settings, Search, LogOut } from 'lucide-react';
import './Applications.css';

const INTERESTED_FIELDS = [
  'Software Engineering / Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Quality Assurance (QA) / Testing',
  'Data Science / Data Analysis',
  'DevOps / Cloud Engineering',
  'Cybersecurity',
  'Digital Marketing',
  'Sales / Business Development',
  'Customer Support / BPO',
  'HR / Recruitment',
  'Finance / Accounting',
  'Operations / Project Management',
  'Content Writing / Copywriting',
  'Graphic Design / Video Editing',
];

const FIELD_SKILLS: Record<string, string[]> = {
  'Software Engineering / Web Development': ['React.js', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL'],
  'Mobile App Development': ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Android SDK'],
  'UI/UX Design': ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
  'Quality Assurance (QA) / Testing': ['Selenium', 'Cypress', 'TestRail', 'Jira', 'API Testing'],
  'Data Science / Data Analysis': ['Python', 'Pandas', 'SQL', 'Machine Learning', 'Tableau'],
  'DevOps / Cloud Engineering': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  'Cybersecurity': ['Penetration Testing', 'SOC', 'SIEM', 'Vulnerability Assessment', 'Network Security'],
  'Digital Marketing': ['SEO', 'Google Ads', 'Social Media', 'Analytics', 'Content Strategy'],
  'Sales / Business Development': ['Lead Generation', 'CRM', 'Negotiation', 'Revenue Forecasting', 'Account Management'],
  'Customer Support / BPO': ['Zendesk', 'Live Chat', 'Escalation Handling', 'Customer Satisfaction', 'Helpdesk'],
  'HR / Recruitment': ['Talent Acquisition', 'Interviewing', 'Onboarding', 'HRIS', 'Payroll'],
  'Finance / Accounting': ['Excel', 'Financial Reporting', 'Bookkeeping', 'Auditing', 'Tax Compliance'],
  'Operations / Project Management': ['Scrum', 'Kanban', 'Budgeting', 'Stakeholder Management', 'Risk Management'],
  'Content Writing / Copywriting': ['SEO Writing', 'Storytelling', 'Editing', 'Content Planning', 'Brand Voice'],
  'Graphic Design / Video Editing': ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Motion Graphics'],
};

const STATUS_OPTIONS = ['Actively Looking', 'Open to Opportunities'];
const AVAILABILITY_OPTIONS = ['Immediate', '2 Weeks', '1 Month', '2 Months', '3 Months'];
const CONTACT_METHODS = ['Call', 'Email', 'WhatsApp', 'SMS', 'LinkedIn Message'];



const calculateAge = (dob: string) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return String(age);
};

const CandidateApplicationView = () => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/SignIn');
  };

  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 000-0000',
    dob: '',
    linkedIn: 'linkedin.com/in/username',
    interestedField: INTERESTED_FIELDS[0],
    experienceYears: '5',
    status: STATUS_OPTIONS[0],
    availability: AVAILABILITY_OPTIONS[0],
    contactMethods: ['Email', 'Call'] as string[],
    salaryMin: '80000',
    salaryMax: '120000',
    cvFile: null as File | null,
    cvFileName: '',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>(FIELD_SKILLS[INTERESTED_FIELDS[0]] ?? []);
  // Candidate Filters UI removed from this page, so filters state is not needed.

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const currentFieldSkills = FIELD_SKILLS[formData.interestedField] ?? [];
  useEffect(() => {
    setSelectedSkills((current) => current.filter((skill) => currentFieldSkills.includes(skill)));
  }, [formData.interestedField, currentFieldSkills]);

  const age = useMemo(() => calculateAge(formData.dob), [formData.dob]);
  const salaryRange = `${formData.salaryMin}-${formData.salaryMax}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    );
  };

  const handleContactMethodToggle = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      contactMethods: prev.contactMethods.includes(method)
        ? prev.contactMethods.filter((item) => item !== method)
        : [...prev.contactMethods, method],
    }));
  };



  return (
    <div className="browse-page">
      <header className="browse-header">
        <div className="header-left">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={28} />
            <h1 className="logo">CandidateHub</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <Link to="/candidate-dashboard" className="nav-link">
            <Briefcase size={18} />
            Dashboard
          </Link>
          <Link to="/browse-jobs" className="nav-link">
            <Search size={18} />
            Browse Jobs
          </Link>
          <Link to="/applications" className="nav-link active">
            <FileText size={18} />
            Applications
          </Link>
          <Link to="/help" className="nav-link">
            <HelpCircle size={18} />
            Help Center
          </Link>
        </nav>

        <div className="header-right">
          <div className="notifications">
            <Bell className="notification-bell" size={20} />
            <span className="notification-badge">3</span>
          </div>
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Candidate</span>
            </div>
            <Settings className="settings-icon" size={18} />
          </div>
          <button 
            type="button" 
            className="signout-btn"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="registration-card">

        <h1 className="page-title">Candidate Registration</h1>

        <section className="form-section">
          <div className="section-header">
            <h2>Candidate Details</h2>
          </div>
          <div className="field-grid">
            <label className="field-label">
              Full Name
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
              />
            </label>
            <label className="field-label">
              Email Address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </label>
            <label className="field-label">
              Mobile Number
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+1 555 000 0000"
              />
            </label>
            <label className="field-label">
              Date of Birth
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input-field"
              />
            </label>
            <label className="field-label">
              Age
              <input
                type="text"
                value={age}
                readOnly
                className="input-field readonly-field"
                placeholder="Auto-calculated"
              />
            </label>
            <label className="field-label full-width">
              LinkedIn Profile URL
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className="input-field"
                placeholder="https://linkedin.com/in/username"
              />
            </label>
            <label className="field-label">
              Interested Field
              <select
                name="interestedField"
                value={formData.interestedField}
                onChange={handleChange}
                className="select-field"
              >
                {INTERESTED_FIELDS.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </label>
            <div className="field-label full-width">
              <span className="sub-label">Key Skills</span>
              <div className="skill-tags">
                {currentFieldSkills.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    className={selectedSkills.includes(skill) ? 'skill-pill selected' : 'skill-pill'}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <label className="field-label">
              Years of Experience
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="1"
              />
            </label>
            <label className="field-label">
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select-field"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Availability
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="select-field"
              >
                {AVAILABILITY_OPTIONS.map((availability) => (
                  <option key={availability} value={availability}>{availability}</option>
                ))}
              </select>
            </label>
            <label className="field-label full-width">
              CV Upload
              <span className="help-text">Upload your PDF/DOC/DOCX resume from your device.</span>

              <div
                className={formData.cvFileName ? 'cv-dropzone cv-dropzone--filled' : 'cv-dropzone'}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const input = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null);
                    input?.click();
                  }
                }}
              >
                <input
                  type="file"
                  name="cvFile"
                  accept=".pdf,.doc,.docx"
                  className="file-input"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] ?? null;
                    setFormData((prev) => ({
                      ...prev,
                      cvFile: file,
                      cvFileName: file?.name ?? '',
                    }));
                  }}
                />

                <div className="cv-dropzone-inner" aria-hidden="true">
                  <div className="cv-dropzone-icon">📄</div>
                  <div className="cv-dropzone-text">
                    <div className="cv-dropzone-title">Choose CV</div>
                    <div className="cv-dropzone-sub">PDF / DOC / DOCX (max 5MB)</div>
                  </div>
                </div>

                {formData.cvFileName ? (
                  <div className="cv-selected-row" role="status" aria-live="polite">
                    <div className="cv-selected-meta">
                      <div className="cv-selected-label">Selected file</div>
                      <div className="cv-selected-name" title={formData.cvFileName}>
                        {formData.cvFileName}
                      </div>
                    </div>
                    <div className="cv-selected-actions">
                      <button
                        type="button"
                        className="cv-remove-btn"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            cvFile: null,
                            cvFileName: '',
                          }))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-header">
            <h2>Compensation & Permissions</h2>
          </div>
          <div className="field-grid">
            <div className="field-label salary-block full-width">
              <span className="sub-label">Expected Salary Range</span>
              <div className="salary-range">
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="80000"
                  min="0"
                />
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="120000"
                  min="0"
                />
              </div>
              <div className="salary-hint">Standard range format: {salaryRange}</div>
            </div>
            <div className="field-label full-width">
              <span className="sub-label">Preferred Contact Methods</span>
              <span className="help-text">Select how you would like recruiters to contact you for relevant roles.</span>
              <div className="contact-methods-grid">
                {CONTACT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={formData.contactMethods.includes(method) ? 'contact-method-btn active' : 'contact-method-btn'}
                    onClick={() => handleContactMethodToggle(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Terms/Privacy modals */}
        {showTerms ? (
          <div
            className="policy-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Terms of Service"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowTerms(false);
            }}
          >
            <div className="policy-modal">
              <div className="policy-modal-header">
                <h3>Terms of Service</h3>
                <button type="button" className="policy-modal-close" onClick={() => setShowTerms(false)}>
                  ✕
                </button>
              </div>
              <div className="policy-modal-body">
                <p>
                  By using CandidateHub, you agree to these Terms. Please read carefully.
                </p>
                <ul>
                  <li>Candidate information may be used to manage your profile and match roles.</li>
                  <li>Uploaded documents are used for recruitment purposes only.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {showPrivacy ? (
          <div
            className="policy-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Privacy Policy"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPrivacy(false);
            }}
          >
            <div className="policy-modal">
              <div className="policy-modal-header">
                <h3>Privacy Policy</h3>
                <button type="button" className="policy-modal-close" onClick={() => setShowPrivacy(false)}>
                  ✕
                </button>
              </div>
              <div className="policy-modal-body">
                <p>
                  We may collect data you provide during registration (including your CV) to support recruitment.
                </p>
                <ul>
                  <li>Your CV is used for matching you with relevant opportunities.</li>
                  <li>We keep data for as long as needed to operate and comply with legal obligations.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        <label className="terms-row">
          <input type="checkbox" />
          <span>
            I agree to the{' '}
            <button
              type="button"
              className="policy-link"
              onClick={() => setShowTerms(true)}
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="policy-link"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy Policy
            </button>{' '}
            regarding my candidate data submission.
          </span>
        </label>

        <button className="submit-btn" type="button" onClick={() => navigate('/ApplicationSuccess')}>
          Complete Registration →
        </button>
      </main>
    </div>
  );
};

export default CandidateApplicationView;