import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiLock, FiSettings, FiUser } from 'react-icons/fi';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const SETTINGS_STORAGE_KEY = 'candidate-hub:profile-settings';

type ProfileSettingsForm = {
  fullName: string;
  email: string;
  bio: string;
  profileVisibility: boolean;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const defaultSettings: ProfileSettingsForm = {
  fullName: 'Alex Jordan',
  email: 'alex.jordan@candidate.pulse',
  bio: 'Senior Product Designer with 8+ years of experience in building scalable design systems and user-centric web applications.',
  profileVisibility: true,
};

const readLocalSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw
      ? { ...defaultSettings, ...JSON.parse(raw) as Partial<ProfileSettingsForm> }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const writeLocalSettings = (settings: ProfileSettingsForm) => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

const CandidateSettings: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileSettingsForm>(defaultSettings);
  const [password, setPassword] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const localSettings = readLocalSettings();
      setProfile(localSettings);

      try {
        const response = await fetch(`${API_BASE_URL}/candidates/settings/profile`);
        if (!response.ok) return;
        const result = await response.json();
        if (result.status === 'success' && result.data) {
          const nextSettings = { ...localSettings, ...result.data };
          setProfile(nextSettings);
          writeLocalSettings(nextSettings);
        }
      } catch {
        /* local settings are enough when backend is offline */
      }
    };

    void loadSettings();
  }, []);

  const showMessage = (nextMessage: string) => {
    setError('');
    setMessage(nextMessage);
  };

  const showError = (nextError: string) => {
    setMessage('');
    setError(nextError);
  };

  const saveProfile = async (nextProfile = profile, redirectAfterSave = false) => {
    setIsSavingProfile(true);
    writeLocalSettings(nextProfile);
    setProfile(nextProfile);

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/settings/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextProfile),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Backend update failed.');
      }

      showMessage('Profile updated successfully.');
    } catch (saveError) {
      showMessage('Profile updated locally. Start the backend to sync Firebase.');
      console.warn('Profile settings backend sync failed.', saveError);
    } finally {
      setIsSavingProfile(false);
      if (redirectAfterSave) {
        navigate('/profile?updated=1');
      }
    }
  };

  const savePassword = async () => {
    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      showError('Please complete all password fields.');
      return;
    }
    if (password.newPassword.length < 8) {
      showError('New password must be at least 8 characters.');
      return;
    }
    if (password.newPassword !== password.confirmPassword) {
      showError('New password and confirmation do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/settings/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(password),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Password update failed.');
      }

      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('Password updated successfully.');
    } catch (passwordError) {
      showError(
        passwordError instanceof Error
          ? passwordError.message
          : 'Password update failed. Please start the backend and try again.'
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const toggleVisibility = () => {
    const nextProfile = {
      ...profile,
      profileVisibility: !profile.profileVisibility,
    };
    void saveProfile(nextProfile, false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-slate-800">CandidateHub</span>
          <nav className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition">Browse Jobs</a>
            <a href="#" className="hover:text-blue-600 transition">Applications</a>
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Profile & Settings</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><FiSettings /></button>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">AJ</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-500 mt-2">Manage your visibility, security, and data preferences to keep your professional identity secure and impactful.</p>
        </div>

        {(message || error) && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm font-semibold ${
            error
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}>
            {error || message}
          </div>
        )}

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
              <FiUser className="text-slate-300 w-6 h-6" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Bio</label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void saveProfile(profile, true)}
                disabled={isSavingProfile}
                className="px-8 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-60"
              >
                {isSavingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
              <FiLock className="text-slate-300 w-6 h-6" />
            </div>

            <div className="space-y-6 max-w-3xl">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  value={password.currentPassword}
                  onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })}
                  placeholder="Current password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={password.newPassword}
                    onChange={(event) => setPassword({ ...password, newPassword: event.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    value={password.confirmPassword}
                    onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })}
                    placeholder="Re-type new password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => void savePassword()}
                  disabled={isSavingPassword}
                  className="px-8 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-60"
                >
                  {isSavingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-8">Account Privacy</h2>
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <FiEye className={profile.profileVisibility ? 'text-blue-600' : 'text-slate-400'} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Profile Visibility</h4>
                  <p className="text-xs text-slate-500 mt-1">Control if your profile is searchable within the platform.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.profileVisibility}
                  onChange={toggleVisibility}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CandidateSettings;
