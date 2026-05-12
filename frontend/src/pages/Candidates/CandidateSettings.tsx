import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiEye, FiSave, FiUser } from "react-icons/fi";
import { firebaseSetupError } from "../../config/firebase";
import {
  getPreferredCandidate,
  setActiveCandidateId,
  updateCandidateProfile,
} from "../../services/candidateService";
import { runDuplicateCheck } from "../../services/duplicateService";
import type { CandidateFormValues } from "../../types/candidate";

const emptyForm: CandidateFormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  title: "",
  bio: "",
  department: "Tech",
  yearsExperience: 0,
  skills: [],
  visibility: true,
};

const CandidateSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedCandidateId = searchParams.get("candidateId");

  const [candidateId, setCandidateId] = useState("");
  const [formValues, setFormValues] = useState<CandidateFormValues>(emptyForm);
  const [skillsInput, setSkillsInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const loadCandidate = async () => {
      setIsLoading(true);
      const candidate = await getPreferredCandidate(requestedCandidateId);

      if (!candidate) {
        setIsLoading(false);
        return;
      }

      setCandidateId(candidate.id);
      setActiveCandidateId(candidate.id);
      setFormValues({
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        title: candidate.title,
        bio: candidate.bio,
        department: candidate.department,
        yearsExperience: candidate.yearsExperience,
        skills: candidate.skills,
        visibility: candidate.visibility,
      });
      setSkillsInput(candidate.skills.join(", "));
      setIsLoading(false);
    };

    void loadCandidate();
  }, [requestedCandidateId]);

  const updateField = <Key extends keyof CandidateFormValues>(
    field: Key,
    value: CandidateFormValues[Key],
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!candidateId) {
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    const savedCandidate = await updateCandidateProfile(candidateId, {
      ...formValues,
      email: formValues.email.toLowerCase().trim(),
      skills: skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });

    const duplicateResult = await runDuplicateCheck(savedCandidate);
    setIsSubmitting(false);

    if (duplicateResult.matchFound && duplicateResult.duplicateCase) {
      navigate(
        `/duplicates?candidateId=${savedCandidate.id}&duplicateId=${duplicateResult.duplicateCase.id}`,
      );
      return;
    }

    setFeedback("Profile updated successfully.");
    navigate(`/profile?candidateId=${savedCandidate.id}&updated=1`);
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        Loading candidate profile settings...
      </div>
    );
  }

  if (!candidateId) {
    return (
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 text-amber-700">
        No candidate profile is available to update yet.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Candidate profile settings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Update candidate details</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Save profile edits, then automatically run the duplicate check flow. If a close
            match is found, the candidate will be routed to the duplicate review page.
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          onClick={() => navigate(`/profile?candidateId=${candidateId}`)}
          type="button"
        >
          <FiArrowRight />
          Open Profile View
        </button>
      </div>

      {firebaseSetupError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Firebase config is missing, so the app is using local demo data until valid
          `VITE_FIREBASE_*` values are provided.
        </div>
      ) : null}

      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {feedback}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
        <form
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Edit profile</h2>
              <p className="mt-2 text-sm text-slate-500">
                Keep the core profile fields updated before admin review.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-slate-400">
              <FiUser className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Full name</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => updateField("fullName", event.target.value)}
                value={formValues.fullName}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Email address</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => updateField("email", event.target.value)}
                type="email"
                value={formValues.email}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Phone number</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => updateField("phone", event.target.value)}
                value={formValues.phone}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Location</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => updateField("location", event.target.value)}
                value={formValues.location}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Current role</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => updateField("title", event.target.value)}
                value={formValues.title}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Department</span>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => updateField("department", event.target.value)}
                value={formValues.department}
              >
                <option value="Tech">Tech</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
              </select>
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="font-semibold text-slate-600">Professional bio</span>
              <textarea
                className="min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => updateField("bio", event.target.value)}
                value={formValues.bio}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Years of experience</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                min={0}
                onChange={(event) => updateField("yearsExperience", Number(event.target.value))}
                type="number"
                value={formValues.yearsExperience}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-600">Skills</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                onChange={(event) => setSkillsInput(event.target.value)}
                placeholder="React, Firebase, TypeScript"
                value={skillsInput}
              />
            </label>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <FiEye className={formValues.visibility ? "text-blue-600" : "text-slate-400"} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Profile visibility</p>
                <p className="text-sm text-slate-500">
                  Control whether this candidate is searchable in the talent pool.
                </p>
              </div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                aria-label="Toggle candidate profile visibility"
                checked={formValues.visibility}
                className="peer sr-only"
                onChange={() => updateField("visibility", !formValues.visibility)}
                type="checkbox"
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition" />
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              <FiSave />
              {isSubmitting ? "Saving profile..." : "Update Profile"}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Update flow
            </p>
            <ol className="mt-4 space-y-4 text-sm text-slate-600">
              <li>1. Save the latest candidate profile details.</li>
              <li>2. Run duplicate detection using email, phone, and name overlap.</li>
              <li>3. Redirect to duplicate review or the updated profile view.</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Editing snapshot</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Candidate</p>
                <p className="mt-1 font-semibold text-slate-900">{formValues.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Role</p>
                <p className="mt-1">{formValues.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Searchable</p>
                <p className="mt-1">{formValues.visibility ? "Visible in pool" : "Hidden from pool"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Skills</p>
                <p className="mt-1">{skillsInput || "No skills added yet"}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CandidateSettings;