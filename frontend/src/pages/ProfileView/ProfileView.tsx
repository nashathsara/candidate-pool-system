import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiEdit2,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShare2,
  FiTrendingUp,
} from "react-icons/fi";
import { getCandidateById, getPreferredCandidate, setActiveCandidateId } from "../../services/candidateService";
import type { CandidateProfile } from "../../types/candidate";
import { formatDateLabel, getInitials, getStatusBadgeStyles } from "../../utils/formatters";

const ProfileView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const wasUpdated = searchParams.get("updated") === "1";
  const duplicateResolved = searchParams.get("duplicateResolved") === "1";
  const fromDuplicate = searchParams.get("fromDuplicate") === "1";

  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCandidate = async () => {
      setIsLoading(true);

      const nextCandidate = candidateId
        ? await getCandidateById(candidateId)
        : await getPreferredCandidate();

      if (nextCandidate) {
        setActiveCandidateId(nextCandidate.id);
      }

      setCandidate(nextCandidate);
      setIsLoading(false);
    };

    void loadCandidate();
  }, [candidateId]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Loading profile view...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-700">
        Candidate profile not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {wasUpdated || duplicateResolved || fromDuplicate ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {duplicateResolved
            ? "Profile updated successfully and the duplicate warning was marked as keep separate."
            : fromDuplicate
              ? "Viewing the existing profile matched by the duplicate detection flow."
              : "Profile updated successfully."}
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200">
          <FiShare2 className="h-4 w-4" />
          Share Profile
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600"
          onClick={() => navigate(`/settings?candidateId=${candidate.id}`)}
          type="button"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-6">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-lg">
                {getInitials(candidate.fullName)}
              </div>
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-green-500" />
            </div>

            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">{candidate.fullName}</h2>
              <p className="mb-2 text-lg font-medium text-blue-500">{candidate.title}</p>
              <p className="mb-3 flex items-center gap-2 text-gray-500">
                <FiMapPin className="h-4 w-4" />
                {candidate.location}
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:gap-4">
                <span className="flex items-center gap-2">
                  <FiMail className="h-4 w-4" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-2">
                  <FiPhone className="h-4 w-4" />
                  {candidate.phone || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadgeStyles(candidate.status)}`}>
              {candidate.status}
            </span>
            <p className="text-xs text-slate-400">Updated {formatDateLabel(candidate.updatedAt)}</p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 border-b-2 border-gray-200 pb-2 text-xl font-semibold text-gray-900">
          <FiBriefcase className="h-5 w-5 text-blue-500" />
          Experience
        </h3>

        {candidate.experience.map((experienceItem) => (
          <div className="mb-6 last:mb-0" key={`${experienceItem.role}-${experienceItem.company}`}>
            <h4 className="mb-1 font-semibold text-gray-900">{experienceItem.role}</h4>
            <p className="mb-2 text-sm font-medium text-blue-500">
              {experienceItem.company} • {experienceItem.employmentType}
            </p>
            <p className="mb-2 text-xs font-medium text-slate-400">{experienceItem.period}</p>
            <p className="text-sm leading-relaxed text-gray-600">{experienceItem.summary}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.6fr]">
        <div className="left-column space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 border-b-2 border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              <FiBookOpen className="h-5 w-5 text-green-500" />
              Education
            </h3>

            {candidate.education.map((educationItem) => (
              <div className="mb-6 last:mb-0" key={`${educationItem.degree}-${educationItem.institution}`}>
                <h4 className="mb-1 font-semibold text-gray-900">{educationItem.degree}</h4>
                <p className="mb-2 text-sm font-medium text-blue-500">{educationItem.institution}</p>
                <p className="text-xs text-gray-500">Graduated {educationItem.graduated}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 border-b-2 border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              <FiTrendingUp className="h-5 w-5 text-purple-500" />
              Review Progress
            </h3>

            <ProgressBar label="Technical" value={candidate.reviewScores.technical} />
            <ProgressBar label="Communication" value={candidate.reviewScores.communication} />
            <ProgressBar label="Culture" value={candidate.reviewScores.culture} />
          </section>
        </div>

        <div className="right-column space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 border-b-2 border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              <FiCpu className="h-5 w-5 text-orange-500" />
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {candidate.skills.map((skill) => (
                <span
                  className="cursor-default rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 border-b-2 border-gray-200 pb-2 text-xl font-semibold text-gray-900">
              <FiCheckCircle className="h-5 w-5 text-emerald-500" />
              Profile Summary
            </h3>
            <dl className="space-y-4 text-sm text-slate-600">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Department</dt>
                <dd className="mt-1">{candidate.department}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Experience</dt>
                <dd className="mt-1">{candidate.yearsExperience} years</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Profile Visibility</dt>
                <dd className="mt-1">{candidate.visibility ? "Visible in talent pool" : "Hidden from talent pool"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Duplicate Status</dt>
                <dd className="mt-1 capitalize">{candidate.duplicateStatus.replace("-", " ")}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-6 last:mb-0">
    <div className="mb-2 flex justify-between">
      <span className="font-medium text-gray-900">{label}</span>
      <span className="font-semibold text-blue-500">{value}%</span>
    </div>
    <progress
      className="mb-2 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500"
      max={100}
      value={value}
    />
    <span className="text-xs font-medium text-gray-500">Fit</span>
  </div>
);

export default ProfileView;