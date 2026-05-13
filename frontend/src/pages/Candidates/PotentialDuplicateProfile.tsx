import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiCalendar, FiChevronRight, FiHelpCircle, FiLogIn, FiSearch, FiUser } from "react-icons/fi";
import CandidatePublicLayout from "../../layouts/CandidatePublicLayout";
import { getDuplicateCaseById, keepDuplicateSeparate } from "../../services/duplicateService";
import type { CandidateProfile, DuplicateCase } from "../../types/candidate";

const formatMonthYear = (value?: string) => {
  if (!value) {
    return "Recently active";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently active";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CH";

const PotentialDuplicateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get("duplicateId") ?? "";
  const routeState = location.state as { existingProfile?: Partial<CandidateProfile> } | null;
  const [duplicateCase, setDuplicateCase] = useState<DuplicateCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDuplicateCase = async () => {
      setIsLoading(true);
      const nextDuplicateCase = await getDuplicateCaseById(duplicateId);

      if (isMounted) {
        setDuplicateCase(nextDuplicateCase);
        setIsLoading(false);
      }
    };

    loadDuplicateCase();

    return () => {
      isMounted = false;
    };
  }, [duplicateId]);

  const matchedCandidate = useMemo<CandidateProfile | null>(
    () => {
      if (duplicateCase?.matchedCandidateSnapshot) {
        return duplicateCase.matchedCandidateSnapshot;
      }

      if (routeState?.existingProfile?.fullName && routeState.existingProfile.email) {
        const now = new Date().toISOString();

        return {
          id: routeState.existingProfile.id ?? "existing-profile",
          fullName: routeState.existingProfile.fullName,
          email: routeState.existingProfile.email,
          phone: routeState.existingProfile.phone ?? "",
          location: routeState.existingProfile.location ?? "",
          title: routeState.existingProfile.title ?? "Candidate",
          bio: routeState.existingProfile.bio ?? "",
          department: routeState.existingProfile.department ?? "Tech",
          yearsExperience: routeState.existingProfile.yearsExperience ?? 0,
          skills: routeState.existingProfile.skills ?? [],
          status: routeState.existingProfile.status ?? "In Review",
          visibility: routeState.existingProfile.visibility ?? true,
          createdAt: routeState.existingProfile.createdAt ?? now,
          updatedAt: routeState.existingProfile.updatedAt ?? now,
          lastActiveAt: routeState.existingProfile.lastActiveAt ?? routeState.existingProfile.updatedAt ?? now,
          duplicateStatus: routeState.existingProfile.duplicateStatus ?? "none",
          duplicateCaseId: routeState.existingProfile.duplicateCaseId,
          reviewScores: routeState.existingProfile.reviewScores ?? {
            technical: 70,
            communication: 70,
            culture: 70,
          },
          experience: routeState.existingProfile.experience ?? [],
          education: routeState.existingProfile.education ?? [],
          userId: routeState.existingProfile.userId,
        };
      }

      return null;
    },
    [duplicateCase, routeState],
  );

  const handleContinue = async () => {
    if (!duplicateCase) {
      navigate("/application-success");
      return;
    }

    setIsContinuing(true);
    await keepDuplicateSeparate(duplicateCase.id);
    navigate("/application-success");
  };

  if (isLoading) {
    return (
      <CandidatePublicLayout>
        <div className="min-h-[70vh] flex items-center justify-center text-sm font-semibold text-slate-500">
          Checking duplicate profile details...
        </div>
      </CandidatePublicLayout>
    );
  }

  if (!matchedCandidate) {
    return (
      <CandidatePublicLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-2xl bg-blue-100 p-5 text-blue-600">
            <FiSearch className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">No duplicate profile found</h1>
          <p className="max-w-xl text-slate-500">
            Your registration can continue because we did not find a matching existing account.
          </p>
          <button
            type="button"
            onClick={() => navigate("/application-success")}
            className="rounded-md bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Continue
          </button>
        </div>
      </CandidatePublicLayout>
    );
  }

  return (
    <CandidatePublicLayout>
      <div className="min-h-[78vh] py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiSearch className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Potential Duplicate Profile Found</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            We found an existing account that might belong to you. To keep your information secure and
            centralized, we recommend logging into your existing profile.
          </p>
        </div>

        <section className="mx-auto mt-10 max-w-3xl rounded-lg border border-slate-300 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-4">
            <FiUser className="h-6 w-6 text-slate-950" />
            <h2 className="text-xl font-bold text-slate-950">Account Preview</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <PreviewField label="Full Name" value={matchedCandidate.fullName} />
            <PreviewField label="Email Address" value={matchedCandidate.email} />
            <PreviewField
              label="Last Active"
              value={formatMonthYear(matchedCandidate.lastActiveAt || matchedCandidate.updatedAt)}
              icon={<FiCalendar className="h-4 w-4" />}
            />
            <div className="flex items-center justify-between rounded-md border border-dashed border-slate-300 bg-blue-50 px-5 py-4">
              <div className="flex -space-x-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-slate-700">
                  {getInitials(matchedCandidate.fullName)}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-slate-950">
                  <FiUser className="h-4 w-4" />
                </span>
              </div>
              <span className="text-sm font-medium text-slate-600">Verified Candidate</span>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-5">
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-slate-800 px-6 py-5 text-base font-bold text-white hover:bg-slate-900"
          >
            Log In to Existing Account <FiLogIn className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={isContinuing}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-5 text-base font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isContinuing ? "Continuing registration..." : "This isn't me, continue with registration"}
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>

        <aside className="mx-auto mt-12 flex max-w-3xl gap-4 rounded-lg border border-blue-200 bg-blue-50 p-6 text-left">
          <FiHelpCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
          <div>
            <h2 className="font-bold text-slate-950">Why am I seeing this?</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Our system identifies duplicate profiles based on several factors, including your name,
              previous email addresses, and professional history to ensure data integrity and prevent
              multiple application streams.
            </p>
          </div>
        </aside>
      </div>
    </CandidatePublicLayout>
  );
};

type PreviewFieldProps = {
  label: string;
  value: string;
  icon?: ReactNode;
};

const PreviewField = ({ label, value, icon }: PreviewFieldProps) => (
  <div>
    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="flex items-center gap-2 text-base font-semibold text-slate-950">
      {icon}
      {value}
    </p>
  </div>
);

export default PotentialDuplicateProfile;
