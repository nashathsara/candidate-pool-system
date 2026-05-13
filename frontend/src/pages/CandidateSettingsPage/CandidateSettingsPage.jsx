import React from 'react';
import { ArrowLeft, User, Lock, Shield, Edit, Save, X, Eye, EyeOff, ChevronRight } from 'lucide-react';
import './CandidateSettingsPage.css';

const CandidateSettingsPage = () => {
  const [activeSection, setActiveSection] = React.useState('profile');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Handle cancel logic here
  };

  return (
    <div className="candidate-settings">
      {/* Header */}
      <header className="settings-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="header-title">
            <h1>Settings</h1>
            <p>Manage your account settings and preferences</p>
          </div>
        </div>
        <div className="header-right">
          {isEditing ? (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <Edit size={16} />
              Edit
            </button>
          )}
        </div>
      </header>

      <div className="settings-content">
        {/* Sidebar Navigation */}
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <User size={18} />
              <span>Edit Profile</span>
              <ChevronRight size={16} className="nav-arrow" />
            </button>
            <button 
              className={`nav-item ${activeSection === 'password' ? 'active' : ''}`}
              onClick={() => setActiveSection('password')}
            >
              <Lock size={18} />
              <span>Change Password</span>
              <ChevronRight size={16} className="nav-arrow" />
            </button>
            <button 
              className={`nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveSection('privacy')}
            >
              <Shield size={18} />
              <span>Account Privacy</span>
              <ChevronRight size={16} className="nav-arrow" />
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="settings-main">
          {/* Edit Profile Section */}
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Edit Profile</h2>
                <p>Update your personal information and contact details</p>
              </div>
              
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      defaultValue="John" 
                      disabled={!isEditing}
                      className={!isEditing ? 'disabled' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      defaultValue="Doe" 
                      disabled={!isEditing}
                      className={!isEditing ? 'disabled' : ''}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="john.doe@example.com" 
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    defaultValue="+1 (555) 123-4567" 
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    defaultValue="San Francisco, CA" 
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                  />
                </div>
                
                <div className="form-group">
                  <label>Professional Summary</label>
                  <textarea 
                    defaultValue="Experienced software developer with expertise in full-stack development and a passion for creating innovative solutions."
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled' : ''}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Change Password Section */}
          {activeSection === 'password' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Change Password</h2>
                <p>Update your password to keep your account secure</p>
              </div>
              
              <div className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Enter current password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input">
                    <input 
                      type={showNewPassword ? 'text' : 'password'} 
                      placeholder="Enter new password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input">
                    <input 
                      type={showNewPassword ? 'text' : 'password'} 
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  <ul>
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Includes at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Account Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Account Privacy</h2>
                <p>Control your privacy settings and data sharing preferences</p>
              </div>
              
              <div className="privacy-settings">
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Profile Visibility</h4>
                    <p>Control who can see your profile information</p>
                  </div>
                  <select className="privacy-select">
                    <option>Public - Anyone can view</option>
                    <option>Recruiters Only</option>
                    <option>Private - Hidden from search</option>
                  </select>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Contact Information</h4>
                    <p>Share your contact details with recruiters</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Job Recommendations</h4>
                    <p>Receive personalized job suggestions based on your profile</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Email Notifications</h4>
                    <p>Get updates about your applications and profile views</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Data Analytics</h4>
                    <p>Help us improve our services with anonymous usage data</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CandidateSettingsPage;
