import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBriefcase, FiPaperclip, FiUploadCloud, FiUser } from "react-icons/fi";
import { createCandidateProfile } from "../../services/candidateService";
import { runDuplicateCheck } from "../../services/duplicateService";
import type { CandidateFormValues } from "../../types/candidate";

const defaultSkills = ["React.js", "TypeScript", "Node.js", "Docker", "AWS"];

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signupState = location.state as
    | (Partial<Pick<CandidateFormValues, "fullName" | "email">> & { candidateId?: string })
    | null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState<CandidateFormValues>({
    fullName: signupState?.fullName ?? "",
    email: signupState?.email ?? "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    department: "Software Engineering",
    yearsExperience: 0,
    skills: defaultSkills,
    visibility: true,
  });

  const updateField = <Field extends keyof CandidateFormValues>(
    field: Field,
    value: CandidateFormValues[Field],
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const candidate = await createCandidateProfile(formValues, {
        id: signupState?.candidateId,
        status: "In Review",
        duplicateStatus: "none",
      });
      const duplicateResult = await runDuplicateCheck(candidate);

      if (duplicateResult.matchFound) {
        navigate(`/candidate/duplicate-check?duplicateId=${duplicateResult.duplicateCase.id}`);
        return;
      }

      navigate("/application-success");
    } catch (error) {
      console.error("Profile registration failed.", error);
      setErrorMessage("We couldn't complete registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Application</h1>
          <p className="text-slate-500 text-sm">
            Complete your professional profile to join our global talent pool.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FiUser className="text-slate-500 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                placeholder="John Doe"
                value={formValues.fullName}
                onChange={(value) => updateField("fullName", value)}
                required
              />
              <FormField
                label="Email Address"
                placeholder="john.doe@example.com"
                type="email"
                value={formValues.email}
                onChange={(value) => updateField("email", value)}
                required
              />
              <FormField
                label="Mobile Number"
                placeholder="+1 (555) 000-0000"
                value={formValues.phone}
                onChange={(value) => updateField("phone", value)}
              />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition"
                />
                <p className="text-[10px] text-slate-400 italic text-right">Auto-calculating age...</p>
              </div>
              <div className="md:col-span-2">
                <FormField
                  label="Location"
                  placeholder="Colombo, Sri Lanka"
                  value={formValues.location}
                  onChange={(value) => updateField("location", value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FiBriefcase className="text-slate-500 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Professional Background</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Interested Field
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                  value={formValues.department}
                  onChange={(event) => updateField("department", event.target.value)}
                >
                  <option>Software Engineering</option>
                  <option>Data Science</option>
                  <option>UI/UX Design</option>
                </select>
              </div>
              <FormField
                label="Years of Experience"
                placeholder="e.g. 5"
                type="number"
                value={String(formValues.yearsExperience)}
                onChange={(value) => updateField("yearsExperience", Number(value))}
              />
              <div className="md:col-span-2">
                <FormField
                  label="Current Role"
                  placeholder="Senior Software Engineer"
                  value={formValues.title}
                  onChange={(value) => updateField("title", value)}
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Key Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {formValues.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Current Status
                </label>
                <div className="space-y-2">
                  <RadioOption label="Actively Looking" name="status" defaultChecked />
                  <RadioOption label="Open to Opportunities" name="status" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Availability
                </label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer">
                  <option>Immediate</option>
                  <option>1 Month Notice</option>
                  <option>3 Months Notice</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FiPaperclip className="text-slate-500 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Preferences &amp; Attachments</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Professional Summary
                  </label>
                  <textarea
                    value={formValues.bio}
                    onChange={(event) => updateField("bio", event.target.value)}
                    placeholder="Briefly describe your background and preferred roles"
                    className="min-h-28 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Expected Annual Salary Range
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Min"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                    />
                    <span className="text-slate-300 font-bold">to</span>
                    <input
                      type="text"
                      placeholder="Max"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                    />
                  </div>
                </div>
                <label className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formValues.visibility}
                    onChange={(event) => updateField("visibility", event.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>
                    <span className="block text-xs font-bold text-slate-700 leading-none mb-1">
                      Willing to be Contacted
                    </span>
                    <span className="block text-[10px] text-slate-400 leading-tight">
                      Allow recruiters to reach out via email or phone for premium opportunities.
                    </span>
                  </span>
                </label>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition cursor-pointer group">
                <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition">
                  <FiUploadCloud className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs font-bold text-slate-700 mb-1">Click to upload or drag &amp; drop</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                  PDF, DOCX up to 10MB
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col items-center gap-6 pt-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500">
                I agree to the{" "}
                <span className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">
                  Privacy Policy
                </span>
                .
              </span>
            </label>
            {errorMessage && <p className="text-sm font-semibold text-rose-600">{errorMessage}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-16 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Checking duplicates..." : "Complete Registration"}
              <span className="text-lg">-&gt;</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

type FormFieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const FormField = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}: FormFieldProps) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      required={required}
      onChange={(event) => onChange(event.target.value)}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition"
    />
  </div>
);

type RadioOptionProps = {
  label: string;
  name: string;
  defaultChecked?: boolean;
};

const RadioOption = ({ label, name, defaultChecked }: RadioOptionProps) => (
  <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 hover:border-blue-200 transition">
    <input
      type="radio"
      name={name}
      defaultChecked={defaultChecked}
      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);

export default CandidateForm;
