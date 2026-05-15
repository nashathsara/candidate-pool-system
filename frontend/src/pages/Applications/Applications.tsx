import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, FileText, HelpCircle, Bell, Search, Settings, LogOut } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
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

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const CandidateApplicationView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const candidateName =
    user?.displayName?.trim() ||
    user?.email?.split('@')[0] ||
    'Candidate';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Applications sign out failed:', error);
    }
    navigate('/', { replace: true });
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    linkedIn: '',
    interestedField: INTERESTED_FIELDS[0],
    experienceYears: '0',
    status: STATUS_OPTIONS[0],
    availability: AVAILABILITY_OPTIONS[0],
    contactMethods: ['Email', 'Call'] as string[],
    salaryMin: '',
    salaryMax: '',
    cvFile: null as File | null,
    cvFileName: '',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const currentFieldSkills = FIELD_SKILLS[formData.interestedField] ?? [];
  
  useEffect(() => {
    setSelectedSkills((current) => current.filter((skill) => currentFieldSkills.includes(skill)));
  }, [formData.interestedField, currentFieldSkills]);

  const age = useMemo(() => calculateAge(formData.dob), [formData.dob]);
  const salaryRange = formData.salaryMin && formData.salaryMax 
    ? `${formData.salaryMin}-${formData.salaryMax}` 
    : '';

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
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

  const handleSubmit = async () => {
    // Reset messages
    setSubmitError(null);
    setUploadProgress(0);
    
    // Validation
    if (!agreeToTerms) {
      setSubmitError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    // Validate phone number (basic validation)
    if (formData.phone.replace(/[\s\-\(\)\+]/g, '').length < 10) {
      setSubmitError('Please enter a valid phone number');
      return;
    }

    if (!formData.cvFile) {
      setSubmitError('Please upload your CV');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Convert CV to Base64
      console.log('Converting file to Base64...');
      const base64CV = await fileToBase64(formData.cvFile);
      console.log('File converted, size:', (base64CV.length / 1024 / 1024).toFixed(2), 'MB');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Generate a unique application ID
      const applicationId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare application data with CV embedded as Base64
      const applicationData = {
        applicationId: applicationId,
        fullName: formData.fullName,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        dateOfBirth: formData.dob || null,
        age: age || null,
        linkedIn: formData.linkedIn || null,
        interestedField: formData.interestedField,
        skills: selectedSkills,
        experienceYears: parseInt(formData.experienceYears) || 0,
        status: formData.status,
        availability: formData.availability,
        contactMethods: formData.contactMethods,
        expectedSalaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        expectedSalaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        cvData: {
          fileName: formData.cvFile.name,
          fileType: formData.cvFile.type,
          fileSize: formData.cvFile.size,
          content: base64CV, // Store CV content directly in Firestore
          uploadedAt: new Date().toISOString()
        },
        cvFileName: formData.cvFileName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        applicationStatus: 'pending',
        source: 'direct_application'
      };

      // Save to Firestore - CHANGED from 'candidates' to 'applications'
      console.log('Saving to Firestore...');
      const applicationsCollection = collection(db, 'applications');
      const docRef = await addDoc(applicationsCollection, applicationData);
      
      console.log('Application submitted with ID:', docRef.id);
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/application-success', { 
          state: { 
            applicationId: docRef.id,
            candidateName: formData.fullName,
            candidateEmail: formData.email
          } 
        });
      }, 1500);
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      console.error('Error details:', error.message, error.code);
      
      if (error.code === 'permission-denied') {
        setSubmitError('Firestore permission denied. Please check your Firestore security rules.');
      } else if (error.message && error.message.includes('exceeds')) {
        setSubmitError('File is too large. Please use a smaller file (under 1MB recommended).');
      } else {
        setSubmitError(error.message || 'Failed to submit application. Please try again.');
      }
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <div className="applications-page">
      <header className="browse-header">
        <div className="header-left">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={28} />
            <h1 className="logo">Applications</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <Link to="/candidate-dashboard" className="nav-link">
            <Briefcase size={18} />
            Dashboard
          </Link>
          <Link to="/browse" className="nav-link">
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
          <Link to="/settings" className="icon-btn" aria-label="Settings">
            <Settings size={18} />
          </Link>
          <Link to="/candidate-dashboard" className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">{candidateName}</span>
              <span className="user-role">Candidate</span>
            </div>
          </Link>
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

        {/* Upload Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress" style={{
            backgroundColor: '#e3f2fd',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #90caf9'
          }}>
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
              Processing CV: {Math.round(uploadProgress)}%
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: '#2196f3',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="success-message" style={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #a5d6a7',
            textAlign: 'center'
          }}>
            ✓ Application submitted successfully! Redirecting...
          </div>
        )}

        {submitError && (
          <div className="error-message" style={{
            backgroundColor: '#fee',
            color: '#c00',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            ⚠ {submitError}
          </div>
        )}

        <section className="form-section">
          <div className="section-header">
            <h2>Candidate Details</h2>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              Please fill in your information accurately. All fields marked with * are required.
            </p>
          </div>
          <div className="field-grid">
            <label className="field-label">
              Full Name *
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </label>
            <label className="field-label">
              Email Address *
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="field-label">
              Mobile Number *
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+1 555 000 0000"
                required
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
              Interested Field *
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
                placeholder="0"
              />
            </label>
            <label className="field-label">
              Status *
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
              Availability *
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
              CV Upload *
              <span className="help-text">Upload your PDF/DOC/DOCX resume from your device. Max 5MB.</span>

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
                    if (file && file.size > 5 * 1024 * 1024) {
                      setSubmitError('File size must be less than 5MB');
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      cvFile: file,
                      cvFileName: file?.name ?? '',
                    }));
                    setSubmitError(null);
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
              <p className="help-text" style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Note: Your CV will be stored securely in the database.
              </p>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-header">
            <h2>Compensation & Permissions</h2>
          </div>
          <div className="field-grid">
            <div className="field-label salary-block full-width">
              <span className="sub-label">Expected Salary Range (Annual USD)</span>
              <div className="salary-range">
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Minimum"
                  min="0"
                />
                <span style={{ margin: '0 10px', alignSelf: 'center' }}>to</span>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Maximum"
                  min="0"
                />
              </div>
              {salaryRange && <div className="salary-hint">Standard range format: ${salaryRange}</div>}
            </div>
            <div className="field-label full-width">
              <span className="sub-label">Preferred Contact Methods *</span>
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
                  <li>We reserve the right to modify these terms at any time.</li>
                  <li>Your data will be handled in accordance with applicable laws.</li>
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
                  We collect data you provide during registration (including your CV) to support recruitment.
                </p>
                <ul>
                  <li>Your CV is used for matching you with relevant opportunities.</li>
                  <li>We keep data for as long as needed to operate and comply with legal obligations.</li>
                  <li>Your data is not shared with third parties without your consent.</li>
                  <li>You can request data deletion at any time by contacting support.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        <label className="terms-row">
          <input 
            type="checkbox" 
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
          />
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
            regarding my candidate data submission. *
          </span>
        </label>

        <button 
          className="submit-btn" 
          type="button" 
          onClick={handleSubmit}
          disabled={isSubmitting || submitSuccess}
          style={{
            opacity: (isSubmitting || submitSuccess) ? 0.7 : 1,
            cursor: (isSubmitting || submitSuccess) ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Processing Application...' : submitSuccess ? 'Submitted!' : 'Complete Registration →'}
        </button>
      </main>
    </div>
  );
};

export default CandidateApplicationView;