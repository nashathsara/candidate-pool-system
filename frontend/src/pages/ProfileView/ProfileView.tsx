import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiMail,
  FiMapPin,
  FiPhone,
  FiX,
} from 'react-icons/fi';

const SETTINGS_STORAGE_KEY = 'candidate-hub:profile-settings';

type ProfileSettings = {
  fullName: string;
  email: string;
  bio: string;
};

const defaultProfile: ProfileSettings = {
  fullName: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  bio: 'Leading the frontend migration from monolithic architecture to micro-frontends using React and Next.js. Reduced bundle sizes by 40% and improved Core Web Vitals across 12 product lines. Mentoring a team of 15 senior engineers and defining global UI standards.',
};

const readProfileSettings = (): ProfileSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw
      ? { ...defaultProfile, ...(JSON.parse(raw) as Partial<ProfileSettings>) }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
};

const technicalSkills = [
  'React 18',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'GraphQL',
  'AWS',
  'Docker',
  'Kubernetes',
];

const ProfileView = () => {
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(searchParams.get('updated') === '1');

  const profile = useMemo(() => readProfileSettings(), []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] px-4 py-5 pb-24">
      <div className="mx-auto max-w-[920px] space-y-5">
        <section className="rounded-lg border border-[#c6c6cd] bg-white p-6 shadow-[0_3px_6px_rgba(15,23,42,0.1)]">
          <div className="flex items-start gap-8">
            <img
              src="https://i.pravatar.cc/300?img=12"
              alt={profile.fullName}
              className="h-[116px] w-[116px] rounded-md object-cover shadow-sm"
            />

            <div className="min-w-0 flex-1">
              <h1 className="text-[26px] font-bold leading-tight text-[#191c1e]">
                {profile.fullName}
              </h1>
              <p className="mt-1 text-[15px] text-[#45464d]">Senior Frontend Architect</p>

              <div className="mt-5 space-y-3 text-[13px] text-[#45464d]">
                <ProfileLine icon={<FiMapPin />} text="Chicago, IL" />
                <ProfileLine icon={<FiMail />} text={profile.email} />
                <ProfileLine icon={<FiPhone />} text="+1 (312) 555-0198" />
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex min-w-[92px] justify-center rounded-sm bg-[#eaf2ff] px-4 py-2 text-[11px] font-bold text-[#2563eb]">
                In Review
              </span>
              <p className="mt-3 text-[11px] font-semibold text-[#76777d]">Applied 4 days ago</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#c6c6cd] bg-white p-8 shadow-[0_3px_6px_rgba(15,23,42,0.1)]">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-[#191c1e]">
            <FiBriefcase className="h-5 w-5" />
            Experience
          </h2>

          <div className="space-y-10">
            <ExperienceItem
              active
              title="Senior Frontend Architect"
              company="CloudScale Systems - Full-time"
              period="2021 - Present"
              description={profile.bio}
            />
            <ExperienceItem
              title="Lead UI Engineer"
              company="Velocity Dev Studio - Full-time"
              period="2018 - 2021"
              description="Architected a custom design system used by over 50 clients. Scaled the engineering team from 5 to 20 members while maintaining a rigorous code quality standard and 98% unit test coverage."
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="min-h-[260px] rounded-lg border border-[#c6c6cd] bg-white p-8 shadow-[0_3px_6px_rgba(15,23,42,0.1)]">
            <h2 className="mb-7 flex items-center gap-2 text-xl font-semibold text-[#191c1e]">
              <FiCpu className="h-5 w-5" />
              Education
            </h2>
            <EducationItem
              degree="M.S. Computer Science"
              school="Stanford University"
              graduated="2018"
            />
            <div className="my-5 h-px bg-[#e6e8ea]" />
            <EducationItem
              degree="B.S. Software Engineering"
              school="Georgia Institute of Technology"
              graduated="2016"
            />
          </section>

          <section className="min-h-[260px] rounded-lg border border-[#c6c6cd] bg-white p-8 shadow-[0_3px_6px_rgba(15,23,42,0.1)]">
            <h2 className="mb-7 flex items-center gap-2 text-xl font-semibold text-[#191c1e]">
              <FiCpu className="h-5 w-5" />
              Technical Skills
            </h2>
            <div className="flex max-w-[260px] flex-wrap gap-3">
              {technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-[#eceef0] px-4 py-2 text-[13px] font-semibold text-[#45464d]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 z-30 w-[380px] max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-md bg-[#2f7a70] px-5 py-4 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="h-5 w-5 shrink-0 text-[#89e4d6]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Profile Updated Successfully</p>
              <p className="text-[11px] text-white/75">
                Duplicate resolution completed for Marcus Sterling.
              </p>
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

const ProfileLine = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[#191c1e]">{icon}</span>
    <span>{text}</span>
  </div>
);

const ExperienceItem = ({
  active,
  title,
  company,
  period,
  description,
}: {
  active?: boolean;
  title: string;
  company: string;
  period: string;
  description: string;
}) => (
  <div className="relative grid grid-cols-[22px_1fr_auto] gap-4">
    <div className="relative flex justify-center">
      <span className={`mt-1 h-3 w-3 rounded-full ${active ? 'bg-black' : 'bg-[#d9dce0]'}`} />
      <span className="absolute top-6 h-[calc(100%+28px)] w-px bg-[#e0e3e5] last:hidden" />
    </div>
    <div>
      <h3 className="text-base font-bold text-[#191c1e]">{title}</h3>
      <p className="mt-1 text-[13px] font-semibold text-[#54647a]">{company}</p>
      <p className="mt-4 max-w-[520px] text-[13px] leading-6 text-[#45464d]">
        {description}
      </p>
    </div>
    <span className="pt-1 text-[11px] font-semibold text-[#76777d]">{period}</span>
  </div>
);

const EducationItem = ({
  degree,
  school,
  graduated,
}: {
  degree: string;
  school: string;
  graduated: string;
}) => (
  <div>
    <h3 className="text-[13px] font-bold text-[#191c1e]">{degree}</h3>
    <p className="mt-1 text-[13px] font-semibold text-[#45464d]">{school}</p>
    <p className="text-[13px] text-[#76777d]">Graduated {graduated}</p>
  </div>
);

export default ProfileView;
