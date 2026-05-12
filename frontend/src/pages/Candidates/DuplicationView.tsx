import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiInfo, FiMail, FiPhone, FiUser } from "react-icons/fi";
import type { DuplicateCase } from "../../types/candidate";
import { formatDateLabel, formatRelativeTime } from "../../utils/formatters";
import { getDuplicateCaseById, keepDuplicateSeparate, listDuplicateCases } from "../../services/duplicateService";

const DuplicationView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get("duplicateId");
  const candidateId = searchParams.get("candidateId");

  const [duplicateCase, setDuplicateCase] = useState<DuplicateCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    const loadDuplicateCase = async () => {
      setIsLoading(true);

      let nextCase: DuplicateCase | null = null;
      if (duplicateId) {
        nextCase = await getDuplicateCaseById(duplicateId);
      }

      if (!nextCase) {
        const duplicateCases = await listDuplicateCases();
        nextCase =
          duplicateCases.find((caseItem) => caseItem.candidateId === candidateId) ??
          duplicateCases.find((caseItem) => caseItem.status === "pending") ??
          null;
      }

      setDuplicateCase(nextCase);
      setIsLoading(false);
    };

    void loadDuplicateCase();
  }, [candidateId, duplicateId]);

  const handleKeepSeparate = async () => {
    if (!duplicateCase) {
      return;
    }

    setIsResolving(true);
    const resolvedCase = await keepDuplicateSeparate(duplicateCase.id);
    setIsResolving(false);

    if (resolvedCase) {
      navigate(`/profile?candidateId=${resolvedCase.candidateId}&updated=1&duplicateResolved=1`);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Loading duplicate review...
      </div>
    );
  }

  if (!duplicateCase) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">No duplicate case selected</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update a profile first to trigger duplicate detection or review a flagged case from the
          admin dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            onClick={() => navigate("/settings")}
            type="button"
          >
            Open Profile Settings
          </button>
          <button
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            Go To Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-8 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Potential duplication candidate
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Potential Duplicate Profile Found</h1>
          <p className="mt-2 text-sm text-slate-500">
            We found an existing account that might belong to this candidate. Review the overlap
            before continuing with the update flow.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Case created on {formatDateLabel(duplicateCase.createdAt)}
          </p>
        </div>

        <div className="mx-8 mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <FiInfo className="text-blue-500" />
            High confidence match ({duplicateCase.confidence}%)
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {duplicateCase.reasons.map((reason) => (
              <MatchReasonBadge key={reason} reason={reason} />
            ))}
          </div>
        </div>

        <div className="grid gap-6 p-8 md:grid-cols-2">
          <CandidateCard
            footerLabel={formatRelativeTime(duplicateCase.candidateSnapshot.updatedAt)}
            heading="Updated Candidate"
            isPrimary
            profile={duplicateCase.candidateSnapshot}
          />
          <CandidateCard
            footerLabel={formatRelativeTime(duplicateCase.matchedCandidateSnapshot.lastActiveAt)}
            heading="Existing Profile"
            profile={duplicateCase.matchedCandidateSnapshot}
          />
        </div>

        <div className="mx-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Suggested next steps
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Review the overlapping profile fields and confirm whether both records belong to the same person.</li>
            <li>Use the existing profile view if the original record should remain the primary source of truth.</li>
            <li>Choose keep separate when this is a legitimate new submission.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 bg-emerald-50 px-8 py-6 md:flex-row md:justify-center">
          <button
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={() =>
              navigate(`/profile?candidateId=${duplicateCase.matchedCandidateId}&fromDuplicate=1`)
            }
            type="button"
          >
            View Existing Profile
          </button>
          <button
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            onClick={handleKeepSeparate}
            disabled={isResolving}
            type="button"
          >
            {isResolving ? "Saving decision..." : "Keep Separate"}
          </button>
          <button
            className="rounded-xl bg-transparent px-6 py-3 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            onClick={() => navigate(`/settings?candidateId=${duplicateCase.candidateId}`)}
            type="button"
          >
            Back to Editing
          </button>
        </div>
      </div>
    </div>
  );
};

const MatchReasonBadge = ({ reason }: { reason: string }) => {
  const icon =
    reason.toLowerCase().includes("email") ? (
      <FiMail />
    ) : reason.toLowerCase().includes("phone") ? (
      <FiPhone />
    ) : (
      <FiUser />
    );

  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-4 text-sm text-slate-700">
      <div className="rounded-xl bg-blue-50 p-2 text-blue-600">{icon}</div>
      <span>{reason}</span>
    </div>
  );
};

const CandidateCard = ({
  heading,
  footerLabel,
  profile,
  isPrimary = false,
}: {
  heading: string;
  footerLabel: string;
  profile: DuplicateCase["candidateSnapshot"];
  isPrimary?: boolean;
}) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isPrimary ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        {heading}
      </span>
      <span className="text-xs text-slate-400">{footerLabel}</span>
    </div>

    <div className="mt-6">
      <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
      <p className="mt-1 text-sm font-medium text-blue-600">{profile.title}</p>
      <p className="mt-3 text-sm text-slate-500">{profile.bio}</p>
    </div>

    <div className="mt-6 grid gap-4 text-sm text-slate-600">
      <ProfileField icon={<FiMail />} label="Email" value={profile.email} />
      <ProfileField icon={<FiPhone />} label="Phone" value={profile.phone || "Not provided"} />
      <ProfileField icon={<FiUser />} label="Location" value={profile.location || "Not provided"} />
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
      {profile.skills.map((skill) => (
        <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const ProfileField = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
    <div className="text-slate-400">{icon}</div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
    </div>
  </div>
);

export default DuplicationView;