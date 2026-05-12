import type { DashboardSnapshot } from "../types/candidate";
import { getExperienceCategory } from "../utils/formatters";
import { listCandidates } from "./candidateService";
import { listDuplicateCases } from "./duplicateService";

const isToday = (value: string) => {
  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const getDashboardSnapshot = async (): Promise<DashboardSnapshot> => {
  const [candidates, duplicateCases] = await Promise.all([
    listCandidates(),
    listDuplicateCases(),
  ]);

  const activeDuplicateCases = duplicateCases.filter((duplicateCase) => duplicateCase.status === "pending");
  const pendingReviews = candidates.filter((candidate) => candidate.status === "Pending Review").length;
  const recentlyUpdated = candidates.filter((candidate) => isToday(candidate.updatedAt)).length;
  const activelyLooking = candidates.filter((candidate) => candidate.status === "Actively Looking").length;

  const departmentCounts = candidates.reduce<Record<string, number>>((accumulator, candidate) => {
    accumulator[candidate.department] = (accumulator[candidate.department] ?? 0) + 1;
    return accumulator;
  }, {});

  const experienceCounts = candidates.reduce<Record<string, number>>((accumulator, candidate) => {
    const label = getExperienceCategory(candidate.yearsExperience);
    accumulator[label] = (accumulator[label] ?? 0) + 1;
    return accumulator;
  }, {});

  return {
    metrics: [
      {
        label: "Total Candidates",
        value: candidates.length,
        changeLabel: "+12% talent pool growth",
      },
      {
        label: "Profiles Updated Today",
        value: recentlyUpdated,
        changeLabel: `${recentlyUpdated} updated in the last 24 hours`,
      },
      {
        label: "Actively Looking",
        value: activelyLooking,
        changeLabel: "Ready for new opportunities",
      },
      {
        label: "Pending Reviews",
        value: pendingReviews + activeDuplicateCases.length,
        changeLabel: `${activeDuplicateCases.length} duplicate cases need attention`,
      },
    ],
    departmentBreakdown: Object.entries(departmentCounts)
      .map(([label, value]) => ({
        label,
        value,
        percentage: candidates.length ? Math.round((value / candidates.length) * 100) : 0,
      }))
      .sort((left, right) => right.value - left.value),
    experienceBreakdown: Object.entries(experienceCounts).map(([label, value]) => ({
      label,
      value,
      percentage: candidates.length ? Math.round((value / candidates.length) * 100) : 0,
    })),
    recentCandidates: [...candidates]
      .sort((left, right) => new Date(right.lastActiveAt).getTime() - new Date(left.lastActiveAt).getTime())
      .slice(0, 5),
    pendingDuplicates: activeDuplicateCases.slice(0, 5),
  };
};
