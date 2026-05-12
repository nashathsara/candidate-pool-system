import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiFilter, FiSearch } from "react-icons/fi";
import { listCandidates, setActiveCandidateId } from "../../services/candidateService";
import type { CandidateProfile } from "../../types/candidate";
import { formatRelativeTime, getInitials, getStatusBadgeStyles } from "../../utils/formatters";

const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCandidates = async () => {
      setIsLoading(true);
      const nextCandidates = await listCandidates();
      setCandidates(nextCandidates);
      setIsLoading(false);
    };

    void loadCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return candidates;
    }

    return candidates.filter((candidate) =>
      [candidate.fullName, candidate.email, candidate.title, candidate.skills.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [candidates, searchValue]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
          <p className="mt-2 text-sm text-slate-500">{candidates.length} total profiles in the pool</p>
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300">
            <FiFilter />
            Filters
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300">
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by name, email, role, or skill..."
            value={searchValue}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-sm text-slate-500">Loading candidate list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-4">Candidate Name</th>
                  <th className="px-6 py-4">Primary Skills</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                          {getInitials(candidate.fullName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{candidate.fullName}</p>
                          <p className="text-xs text-slate-500">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 ? (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            +{candidate.skills.length - 3}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{candidate.location}</td>
                    <td className="px-6 py-4 text-slate-600">{candidate.yearsExperience} years</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatRelativeTime(candidate.lastActiveAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        onClick={() => {
                          setActiveCandidateId(candidate.id);
                          navigate(`/profile?candidateId=${candidate.id}`);
                        }}
                        type="button"
                      >
                        Review Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </span>
        <button
          className="font-semibold text-slate-700 transition hover:text-slate-900"
          onClick={() => navigate("/settings")}
          type="button"
        >
          Open current candidate settings
        </button>
      </div>
    </div>
  );
};

export default Candidates;

