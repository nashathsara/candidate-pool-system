import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiArrowRight, FiBarChart2, FiCheckCircle, FiFilter, FiSearch } from "react-icons/fi";
import type { DashboardSnapshot } from "../../types/candidate";
import { formatRelativeTime, getStatusBadgeStyles } from "../../utils/formatters";
import { getDashboardSnapshot } from "../../services/dashboardService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      const snapshot = await getDashboardSnapshot();
      setDashboard(snapshot);
      setIsLoading(false);
    };

    void loadDashboard();
  }, []);

  const totalDepartmentShare = useMemo(
    () => dashboard?.departmentBreakdown.reduce((sum, department) => sum + department.percentage, 0) ?? 0,
    [dashboard],
  );

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        Unable to load dashboard data right now.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        </div>

        <div className="flex w-full max-w-xl items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Global Candidate Search..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300">
            <FiFilter />
            Filters
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{metric.value}</p>
              </div>
              <div className="rounded-full bg-slate-50 p-2 text-slate-500">
                <FiBarChart2 />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">{metric.changeLabel}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Department Distribution</h2>
              <p className="mt-1 text-sm text-slate-500">Share of the current talent pool</p>
            </div>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-slate-100 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalDepartmentShare || 100}%</p>
                <p className="text-xs text-slate-500">Talent pool</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {dashboard.departmentBreakdown.map((department) => (
              <div key={department.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="h-3 w-3 rounded-full bg-slate-700" />
                    {department.label}
                  </div>
                  <span className="font-semibold text-slate-900">{department.percentage}%</span>
                </div>
                <progress
                  className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-slate-900 [&::-moz-progress-bar]:bg-slate-900"
                  max={100}
                  value={department.percentage}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Experience Categories</h2>
              <p className="mt-1 text-sm text-slate-500">Candidate count by seniority band</p>
            </div>
            <span className="text-xs font-medium text-slate-400">Candidate count / trend</span>
          </div>

          <div className="mt-6 space-y-5">
            {dashboard.experienceBreakdown.map((experience) => (
              <div key={experience.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{experience.label}</span>
                  <span className="font-semibold text-slate-900">{experience.value}</span>
                </div>
                <progress
                  className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
                  max={100}
                  value={experience.percentage}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Talent Availability Pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">Most recent candidate activity</p>
            </div>
            <button
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
              onClick={() => navigate("/candidates")}
              type="button"
            >
              View All Records
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Verification Status</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard.recentCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{candidate.fullName}</p>
                      <p className="text-xs text-slate-500">{candidate.title}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{candidate.department}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatRelativeTime(candidate.lastActiveAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        onClick={() => navigate(`/profile?candidateId=${candidate.id}`)}
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
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Potential Duplicates</h2>
              <p className="mt-1 text-sm text-slate-500">Newest flagged records</p>
            </div>
            <FiAlertCircle className="text-slate-300" />
          </div>

          <div className="mt-6 space-y-4">
            {dashboard.pendingDuplicates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                No active duplicate cases right now.
              </div>
            ) : (
              dashboard.pendingDuplicates.map((duplicateCase) => (
                <button
                  key={duplicateCase.id}
                  className="block w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                  onClick={() =>
                    navigate(`/duplicates?duplicateId=${duplicateCase.id}&candidateId=${duplicateCase.candidateId}`)
                  }
                  type="button"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{duplicateCase.candidateSnapshot.fullName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Possible match with {duplicateCase.matchedCandidateSnapshot.fullName}
                      </p>
                    </div>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      {duplicateCase.confidence}% match
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{duplicateCase.reasons[0] ?? "Potential duplicate detected"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                      Review
                      <FiArrowRight />
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            <div className="flex items-center gap-2 font-semibold">
              <FiCheckCircle />
              Firebase-aware dashboard ready
            </div>
            <p className="mt-2 text-emerald-600">
              Reads live Firestore data when configured, and falls back to local demo records otherwise.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
