import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCamera,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiLock,
  FiSave,
  FiSettings,
  FiTrash2,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';
import {
  defaultAdminProfile,
  getAdminProfile,
  updateAdminProfile,
  type AdminProfileSettings,
} from '../../services/firebaseAdminService';

export const SETTINGS_STORAGE_KEY = 'candidate-hub:profile-settings';
export const PROFILE_SETTINGS_UPDATED_EVENT = 'candidate-hub:profile-settings-updated';

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const readLocalSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw
      ? { ...defaultAdminProfile, ...(JSON.parse(raw) as Partial<AdminProfileSettings>) }
      : defaultAdminProfile;
  } catch {
    return defaultAdminProfile;
  }
};

const writeLocalSettings = (settings: AdminProfileSettings) => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(PROFILE_SETTINGS_UPDATED_EVENT, { detail: settings }));
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AD';

const CandidateSettings: React.FC = () => {
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<AdminProfileSettings>(defaultAdminProfile);
  const [draftProfile, setDraftProfile] = useState<AdminProfileSettings>(defaultAdminProfile);
  const [password, setPassword] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const localSettings = readLocalSettings();
      setProfile(localSettings);
      setDraftProfile(localSettings);

      try {
        const firebaseSettings = await getAdminProfile();
        setProfile(firebaseSettings);
        setDraftProfile(firebaseSettings);
        writeLocalSettings(firebaseSettings);
      } catch (loadError) {
        showError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load admin profile from Firebase.',
        );
      }
    };

    void loadSettings();
  }, []);

  const showMessage = (nextMessage: string) => {
    setError('');
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(''), 3200);
  };

  const showError = (nextError: string) => {
    setMessage('');
    setError(nextError);
  };

  const validateProfile = () => {
    if (!draftProfile.fullName.trim()) return 'Full name is required.';
    if (!draftProfile.email.trim()) return 'Email address is required.';
    if (!/^\S+@\S+\.\S+$/.test(draftProfile.email)) return 'Enter a valid email address.';
    if (!draftProfile.bio.trim()) return 'Professional bio is required.';
    return '';
  };

  const saveProfile = async () => {
    const validationError = validateProfile();
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsSavingProfile(true);

    try {
      const savedProfile = await updateAdminProfile(draftProfile);
      writeLocalSettings(savedProfile);
      setProfile(savedProfile);
      setDraftProfile(savedProfile);
      showMessage('Profile updated successfully.');
      setIsEditing(false);
      navigate('/admin/profile?updated=1', { state: { profile: savedProfile } });
    } catch (saveError) {
      showError(saveError instanceof Error ? saveError.message : 'Firebase profile update failed.');
    } finally {
      setIsSavingProfile(false);
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
    window.setTimeout(() => {
      setIsSavingPassword(false);
      showError('Password update is not connected yet. Firebase Auth reauthentication is required before changing passwords.');
    }, 400);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      showError('Profile photo must be a JPG, JPEG, or PNG file.');
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setDraftProfile((current) => ({ ...current, profilePhoto: dataUrl }));
    event.target.value = '';
  };

  const deleteProfilePhoto = () => {
    const nextProfile = { ...draftProfile, profilePhoto: '' };
    setDraftProfile(nextProfile);
    if (!isEditing) {
      void updateAdminProfile({ ...nextProfile, profilePhoto: '' })
        .then((savedProfile) => {
          setProfile(savedProfile);
          setDraftProfile(savedProfile);
          writeLocalSettings(savedProfile);
          showMessage('Profile photo deleted.');
        })
        .catch((deleteError) => {
          setDraftProfile(profile);
          showError(deleteError instanceof Error ? deleteError.message : 'Firebase photo delete failed.');
        });
    }
  };

  const cancelEditing = () => {
    setDraftProfile(profile);
    setIsEditing(false);
    setError('');
  };

  const fieldDisabled = !isEditing || isSavingProfile;
  const avatarInitials = getInitials(draftProfile.fullName);
  const navClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
      : 'hover:text-blue-600 transition';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-slate-800">CandidateHub</span>
          <nav className="flex gap-6 text-sm font-medium text-slate-500">
            <NavLink to="/browse" className={navClassName}>Browse Jobs</NavLink>
            <NavLink to="/applications" className={navClassName}>Applications</NavLink>
            <NavLink to="/settings" className={navClassName}>Profile & Settings</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((current) => !current)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
              aria-label="Open notifications"
            >
              <FiBell />
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 top-11 z-30 w-72 rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-xl">
                <p className="font-bold text-slate-900">Notifications</p>
                <div className="mt-3 space-y-2 text-slate-600">
                  <p className="rounded bg-slate-50 px-3 py-2">Admin profile settings are ready.</p>
                  <p className="rounded bg-slate-50 px-3 py-2">Candidate review queue synced with Firebase.</p>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSettingsMenuOpen((current) => !current)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
              aria-label="Open settings menu"
            >
              <FiSettings />
            </button>
            {isSettingsMenuOpen && (
              <div className="absolute right-0 top-11 z-30 w-56 rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-xl">
                <button type="button" onClick={() => navigate('/settings')} className="block w-full rounded px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50">
                  Profile Settings
                </button>
                <button type="button" onClick={() => navigate('/admin/profile')} className="block w-full rounded px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50">
                  Admin Profile
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((current) => !current)}
              className="rounded-full"
              aria-label="Open admin profile menu"
            >
              {draftProfile.profilePhoto ? (
                <img src={draftProfile.profilePhoto} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {avatarInitials}
                </div>
              )}
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 z-30 w-56 rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-xl">
                <button type="button" onClick={() => navigate('/admin/profile')} className="block w-full rounded px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50">
                  View Profile
                </button>
                <button type="button" onClick={() => navigate('/settings')} className="block w-full rounded px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50">
                  Settings
                </button>
                <button type="button" onClick={() => navigate('/signin')} className="block w-full rounded px-3 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto py-10 px-6">
        <div className="mb-10">
          <h1 className="text-[34px] font-bold tracking-tight text-slate-950">Profile Settings</h1>
          <p className="text-slate-600 mt-3 max-w-xl text-lg leading-8">
            Manage your admin identity, account security, and profile visibility.
          </p>
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

        <section className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-950">Edit Profile</h2>
              <div className="flex flex-wrap gap-3">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FiEdit3 /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={isSavingProfile}
                      className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
                    >
                      <FiX /> Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void saveProfile()}
                      disabled={isSavingProfile}
                      className="inline-flex items-center gap-2 rounded bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-60"
                    >
                      {isSavingProfile ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <FiSave />}
                      Update Profile
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mb-8 border-b border-slate-200 pb-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                  {draftProfile.profilePhoto ? (
                    <img src={draftProfile.profilePhoto} alt={`${draftProfile.fullName} profile`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-3xl font-black text-indigo-700">
                      {avatarInitials}
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 rounded-full bg-black p-2 text-white shadow">
                    <FiCamera />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">Admin Profile Photo</h3>
                  <p className="mt-1 text-sm text-slate-500">Upload a JPG, JPEG, or PNG image. Preview updates immediately.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <input ref={photoInputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="hidden" onChange={(event) => void handlePhotoUpload(event)} />
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() => photoInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiUploadCloud /> {draftProfile.profilePhoto ? 'Change Profile Photo' : 'Add Profile Photo'}
                    </button>
                    <button
                      type="button"
                      disabled={!draftProfile.profilePhoto}
                      onClick={deleteProfilePhoto}
                      className="inline-flex items-center gap-2 rounded border border-rose-100 bg-white px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiTrash2 /> Delete Profile Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <SettingsField label="Full Name" value={draftProfile.fullName} disabled={fieldDisabled} onChange={(value) => setDraftProfile({ ...draftProfile, fullName: value })} />
              <SettingsField label="Email Address" type="email" value={draftProfile.email} disabled={fieldDisabled} onChange={(value) => setDraftProfile({ ...draftProfile, email: value })} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Bio</label>
              <textarea
                rows={5}
                value={draftProfile.bio}
                disabled={fieldDisabled}
                onChange={(event) => setDraftProfile({ ...draftProfile, bio: event.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none disabled:cursor-not-allowed disabled:text-slate-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-bold text-slate-950">Change Password</h2>
              <FiLock className="text-slate-300 w-6 h-6" />
            </div>

            <div className="space-y-6 max-w-4xl">
              <PasswordField label="Current Password" value={password.currentPassword} onChange={(value) => setPassword({ ...password, currentPassword: value })} />
              <div className="grid md:grid-cols-2 gap-6">
                <PasswordField label="New Password" placeholder="Min. 8 characters" value={password.newPassword} onChange={(value) => setPassword({ ...password, newPassword: value })} />
                <PasswordField label="Confirm New Password" placeholder="Re-type new password" value={password.confirmPassword} onChange={(value) => setPassword({ ...password, confirmPassword: value })} />
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => void savePassword()}
                  disabled={isSavingPassword}
                  className="inline-flex items-center gap-2 px-8 py-2.5 bg-black text-white text-xs font-bold rounded hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-60"
                >
                  {isSavingPassword && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                  {isSavingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-950 mb-8">Account Privacy</h2>
            <div className="flex flex-col gap-5 rounded border border-gray-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  {draftProfile.profileVisibility ? <FiEye className="text-blue-600" /> : <FiEyeOff className="text-slate-400" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Profile Visibility</h4>
                  <p className="text-xs text-slate-500 mt-1">Control if your admin profile is visible within the platform.</p>
                  <p className="mt-2 text-xs font-bold text-slate-700">{draftProfile.profileVisibility ? 'Public profile' : 'Private profile'}</p>
                </div>
              </div>
              <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                <input
                  type="checkbox"
                  checked={draftProfile.profileVisibility}
                  disabled={!isEditing}
                  onChange={() => setDraftProfile({ ...draftProfile, profileVisibility: !draftProfile.profileVisibility })}
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

type SettingsFieldProps = {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  type?: string;
};

const SettingsField = ({ label, value, disabled, onChange, type = 'text' }: SettingsFieldProps) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition disabled:cursor-not-allowed disabled:text-slate-500"
    />
  </div>
);

const PasswordField = ({
  label,
  value,
  onChange,
  placeholder = 'Current password',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500/20 outline-none transition"
    />
  </div>
);

export default CandidateSettings;
