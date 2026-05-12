import type { CandidateRecord } from "../../../utils/candidateTypes";
import {
  FiBriefcase,
  FiBookOpen,
  FiCpu,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { CandidateStatusBadge } from "../CandidateStatusBadge/CandidateStatusBadge";

export interface CandidateProfileProps {
  candidate: CandidateRecord;
  /** When true, shows admin-oriented status row */
  showAdminMeta?: boolean;
}

export function CandidateProfile({
  candidate,
  showAdminMeta,
}: CandidateProfileProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-start gap-6">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            }}
          >
            {candidate.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {candidate.name}
            </h2>
            <p className="text-lg text-blue-600 font-medium mb-2">
              {candidate.role}
            </p>
            <p className="text-gray-500 mb-3 flex items-center gap-2 text-sm">
              <FiMapPin className="w-4 h-4 shrink-0" />
              {candidate.location}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 text-sm">
              <span className="flex items-center gap-2">
                <FiMail className="w-4 h-4 shrink-0" />
                {candidate.email}
              </span>
              {candidate.phone ? (
                <span className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 shrink-0" />
                  {candidate.phone}
                </span>
              ) : null}
            </div>
            {showAdminMeta ? (
              <div className="mt-6 flex flex-wrap gap-4 items-center text-sm">
                <div>
                  <span className="text-gray-500 mr-2">Verification:</span>
                  <CandidateStatusBadge status={candidate.verificationStatus} />
                </div>
                <div>
                  <span className="text-gray-500 mr-2">Category:</span>
                  <span className="font-semibold text-gray-800">
                    {candidate.category}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 mr-2">Last active:</span>
                  <span className="font-semibold text-gray-800">
                    {candidate.lastActiveLabel}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b border-gray-200 flex items-center gap-2">
          <FiBriefcase className="w-5 h-5 text-blue-500" />
          Experience snapshot
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {candidate.experience} of professional experience · Primary focus
          aligned with{" "}
          <span className="font-medium text-gray-800">{candidate.role}</span>.
          Skills include {candidate.skills.join(", ")}
          {candidate.extraSkillsCount
            ? ` and ${candidate.extraSkillsCount} more areas`
            : ""}
          .
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.55fr] gap-6">
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b border-gray-200 flex items-center gap-2">
            <FiBookOpen className="w-5 h-5 text-emerald-500" />
            Education & credentials
          </h3>
          <p className="text-gray-600 text-sm">
            Detailed education history will appear here once connected to your
            backend. This preview is generated from the candidate pool record.
          </p>
        </section>
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b border-gray-200 flex items-center gap-2">
            <FiCpu className="w-5 h-5 text-amber-500" />
            Technical skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium"
              >
                {s}
              </span>
            ))}
            {candidate.extraSkillsCount ? (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                +{candidate.extraSkillsCount} more
              </span>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
