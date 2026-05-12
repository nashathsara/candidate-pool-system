export const formatRelativeTime = (value?: string) => {
  if (!value) {
    return "No activity yet";
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const diffMs = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return "Just now";
  }

  if (diffMs < hour) {
    return `${Math.max(1, Math.round(diffMs / minute))} mins ago`;
  }

  if (diffMs < day) {
    return `${Math.max(1, Math.round(diffMs / hour))} hours ago`;
  }

  return `${Math.max(1, Math.round(diffMs / day))} days ago`;
};

export const formatDateLabel = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const getExperienceCategory = (yearsExperience: number) => {
  if (yearsExperience <= 2) {
    return "Junior (0-2 Years)";
  }

  if (yearsExperience <= 6) {
    return "Mid-Level (3-6 Years)";
  }

  return "Lead/Director (7+ Years)";
};

export const getStatusBadgeStyles = (status: string) => {
  if (status === "Pending Review") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "Profile Updated") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Actively Looking") {
    return "bg-sky-50 text-sky-700";
  }

  if (status === "In Review") {
    return "bg-indigo-50 text-indigo-700";
  }

  return "bg-slate-100 text-slate-700";
};
