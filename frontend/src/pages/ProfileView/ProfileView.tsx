import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiActivity,
  FiBriefcase,
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSettings,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi';
import {
  defaultAdminProfile,
  getAdminProfile,
  updateAdminProfile,
  type AdminProfileSettings,
} from '../../services/firebaseAdminService';

const SETTINGS_STORAGE_KEY = 'candidate-hub:profile-settings';
const PROFILE_SETTINGS_UPDATED_EVENT = 'candidate-hub:profile-settings-updated';

type LocationState = {
  profile?: Partial<AdminProfileSettings>;
};

const adminMeta = {
  role: 'Admin Profile Manager',
  location: 'Colombo, Sri Lanka',
  phone: '+94 77 555 0100',
  status: 'Active Admin',
};

const readProfileSettings = (): AdminProfileSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw
      ? { ...defaultAdminProfile, ...(JSON.parse(raw) as Partial<AdminProfileSettings>) }
      : defaultAdminProfile;
  } catch {
    return defaultAdminProfile;
  }
};

const writeProfileSettings = (settings: AdminProfileSettings) => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(PROFILE_SETTINGS_UPDATED_EVENT, { detail: settings }));
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AD';

const formatDate = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(Number.isNaN(date.getTime()) ? new Date() : date);
};

const ProfileView = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState | null;
  const [showToast, setShowToast] = useState(searchParams.get('updated') === '1');
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState<AdminProfileSettings>(() => ({
    ...readProfileSettings(),
    ...(locationState?.profile ?? {}),
  }));

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setErrorMessage('');
      try {
        const firebaseProfile = await getAdminProfile();
        const nextProfile = {
          ...firebaseProfile,
          ...(locationState?.profile ?? {}),
        };
        if (isMounted) {
          setProfile(nextProfile);
          writeProfileSettings(nextProfile);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load admin profile from Firebase.');
          setProfile({
            ...readProfileSettings(),
            ...(locationState?.profile ?? {}),
          });
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [locationState?.profile]);

  const initials = getInitials(profile.fullName);
  const lastUpdated = formatDate(profile.updatedAt);

  const deleteProfilePhoto = () => {
    setErrorMessage('');
    void updateAdminProfile({ ...profile, profilePhoto: '' })
      .then((nextProfile) => {
        setProfile(nextProfile);
        writeProfileSettings(nextProfile);
        setShowToast(true);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : 'Firebase photo delete failed.');
      });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] px-5 py-6 pb-24">
      <div className="mx-auto max-w-6xl space-y-5">
        {errorMessage && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {errorMessage}
          </div>
        )}

        <section className="rounded-lg border border-[#c6c6cd] bg-white p-7 shadow-[0_3px_8px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
            <div className="h-36 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-indigo-100 shadow-sm">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-black text-indigo-700">
                  {initials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Admin Profile
                  </p>
                  <h1 className="mt-2 text-3xl font-bold leading-tight text-[#191c1e]">
                    {profile.fullName}
                  </h1>
                  <p className="mt-1 text-base font-semibold text-[#45464d]">{adminMeta.role}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                    {adminMeta.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                    Updated {lastUpdated}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-[#45464d] md:grid-cols-2 xl:grid-cols-4">
                <InfoCard icon={<FiMapPin />} label="Location" value={adminMeta.location} />
                <InfoCard icon={<FiMail />} label="Email" value={profile.email} />
                <InfoCard icon={<FiPhone />} label="Phone" value={adminMeta.phone} />
                <InfoCard icon={profile.profileVisibility ? <FiEye /> : <FiEyeOff />} label="Visibility" value={profile.profileVisibility ? 'Public' : 'Private'} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-[#c6c6cd] bg-white p-7 shadow-[0_3px_8px_rgba(15,23,42,0.08)]">
            <SectionTitle icon={<FiUser />} title="Professional Bio" />
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#45464d]">{profile.bio}</p>
          </section>

          <section className="rounded-lg border border-[#c6c6cd] bg-white p-7 shadow-[0_3px_8px_rgba(15,23,42,0.08)]">
            <SectionTitle icon={<FiBriefcase />} title="Account Information" />
            <div className="mt-5 space-y-3">
              <DetailRow label="Role" value={adminMeta.role} />
              <DetailRow label="Status" value={adminMeta.status} />
              <DetailRow label="Last Updated" value={lastUpdated} />
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-lg border border-[#c6c6cd] bg-white p-7 shadow-[0_3px_8px_rgba(15,23,42,0.08)]">
            <SectionTitle icon={profile.profileVisibility ? <FiEye /> : <FiEyeOff />} title="Profile Visibility" />
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-lg font-bold text-slate-900">
                {profile.profileVisibility ? 'Public Profile' : 'Private Profile'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {profile.profileVisibility
                  ? 'Your admin profile is visible within the CandidateHub workspace.'
                  : 'Your admin profile is hidden from general workspace visibility.'}
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-[#c6c6cd] bg-white p-7 shadow-[0_3px_8px_rgba(15,23,42,0.08)]">
            <SectionTitle icon={<FiActivity />} title="Recent Activity" />
            <div className="mt-5 space-y-4">
              <ActivityItem title="Admin profile updated" detail={`Profile settings saved on ${lastUpdated}.`} />
              <ActivityItem title="Profile visibility checked" detail={`Current visibility is ${profile.profileVisibility ? 'public' : 'private'}.`} />
              <ActivityItem title="Account ready" detail="Admin profile details are available for dashboard workflows." />
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-[#c6c6cd] bg-white p-7 shadow-[0_3px_8px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#191c1e]">Admin Profile Actions</h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage your admin profile data and profile photo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <FiSettings />
                Back to Settings
              </button>
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="inline-flex items-center gap-2 rounded bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <FiEdit3 />
                Edit Profile
              </button>
              <button
                type="button"
                disabled={!profile.profilePhoto}
                onClick={deleteProfilePhoto}
                className="inline-flex items-center gap-2 rounded border border-rose-100 bg-white px-5 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiTrash2 />
                Delete Profile Photo
              </button>
            </div>
          </div>
        </section>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 z-30 w-[420px] max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-md bg-[#2f7a70] px-5 py-4 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="h-5 w-5 shrink-0 text-[#89e4d6]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Profile Updated Successfully</p>
              <p className="text-[11px] text-white/75">Your admin profile is now up to date.</p>
            </div>
            <Link
              to="/settings"
              className="text-[11px] font-bold uppercase tracking-wider text-[#89e4d6]"
            >
              Undo
            </Link>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setShowToast(false)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <h2 className="flex items-center gap-2 text-xl font-semibold text-[#191c1e]">
    <span className="text-[#1b3a4b]">{icon}</span>
    {title}
  </h2>
);

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
    <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
      <span>{icon}</span>
      {label}
    </div>
    <p className="truncate text-sm font-semibold text-slate-700">{value || 'Not provided'}</p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
    <span className="text-sm font-semibold text-slate-500">{label}</span>
    <strong className="text-right text-sm text-slate-900">{value}</strong>
  </div>
);

const ActivityItem = ({ title, detail }: { title: string; detail: string }) => (
  <div className="flex gap-3">
    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#1b3a4b] shadow-[0_0_0_4px_#d0e1fb]" />
    <div>
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  </div>
);

export default ProfileView;
