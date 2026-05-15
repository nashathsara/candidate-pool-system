/**
 * Profile Creation Page with Smart Matching
 * Features:
 * - Dynamic skills loading based on field selection
 * - Smart matching against database (Name, DOB, Phone)
 * - Form validation
 * - Side effects for data enrichment
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUploadCloud,
  FiBriefcase,
  FiUser,
  FiPaperclip,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import type { FieldType } from "../../services/skillsService";
import { getSkillsByField, getAllFields } from "../../services/skillsService";
import {
  performSmartMatch,
  validateCandidateForMatching,
  formatSmartMatchResult,
} from "../../services/smartMatchingService";
import type { SmartMatchResult } from "../../services/smartMatchingService";
import { saveNewCandidateOptimized } from "../../services/duplicateDetection";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  linkedinUrl: string;
  interestedField: FieldType | "";
  yearsOfExperience: string;
  skills: string[];
  currentStatus: "actively_looking" | "open_to_opportunities";
  availability: "immediate" | "1_month" | "3_months";
  minSalary: string;
  maxSalary: string;
  cvFile: File | null;
  willBeContacted: boolean;
}

const ProfileCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    linkedinUrl: "",
    interestedField: "",
    yearsOfExperience: "",
    skills: [],
    currentStatus: "actively_looking",
    availability: "immediate",
    minSalary: "",
    maxSalary: "",
    cvFile: null,
    willBeContacted: false,
  });

  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [smartMatchResult, setSmartMatchResult] =
    useState<SmartMatchResult | null>(null);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Side effect: Load skills when field changes
  useEffect(() => {
    if (formData.interestedField) {
      const skills = getSkillsByField(formData.interestedField);
      setSuggestedSkills(skills);
      // Pre-select first few skills
      setSelectedSkills(skills.slice(0, 5));
      setFormData((prev) => ({
        ...prev,
        skills: skills.slice(0, 5),
      }));
    } else {
      setSuggestedSkills([]);
      setSelectedSkills([]);
      setFormData((prev) => ({
        ...prev,
        skills: [],
      }));
    }
  }, [formData.interestedField]);

  // Side effect: Trigger smart matching when key fields change
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.fullName || formData.phone || formData.dateOfBirth) {
        const validation = validateCandidateForMatching(formData);
        if (validation.isValid) {
          setMatchingInProgress(true);
          try {
            const result = await performSmartMatch(formData);
            setSmartMatchResult(result);
          } catch (error) {
            console.error("Smart matching error:", error);
            setSmartMatchResult(null);
          } finally {
            setMatchingInProgress(false);
          }
        }
      }
    }, 1500); // Debounce for 1.5 seconds

    return () => clearTimeout(delayDebounceFn);
  }, [formData.fullName, formData.phone, formData.dateOfBirth]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const inputElement = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: inputElement.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          cvFile: "File size must be less than 10MB",
        }));
        return;
      }
      if (!["application/pdf", "application/msword"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          cvFile: "Only PDF and DOCX files are allowed",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        cvFile: file,
      }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cvFile;
        return newErrors;
      });
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.interestedField) {
      newErrors.interestedField = "Please select a field";
    }
    if (!formData.cvFile) {
      newErrors.cvFile = "Please upload your CV";
    }
    if (!formData.willBeContacted) {
      newErrors.willBeContacted =
        "You must agree to be contacted to proceed";
    }

    // Smart matching validation
    if (smartMatchResult && smartMatchResult.isDuplicate) {
      newErrors.smartMatch =
        "Duplicate profile detected. Please contact support.";
    } else if (smartMatchResult && smartMatchResult.requiresReview) {
      newErrors.smartMatch =
        "This profile requires manual review. Please wait for admin confirmation.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!smartMatchResult?.canProceedToSuccess) {
      setErrors((prev) => ({
        ...prev,
        smartMatch:
          "Profile did not pass smart matching validation. Please review and try again.",
      }));
      return;
    }

    setSubmitting(true);
    try {
      const candidateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        linkedinUrl: formData.linkedinUrl,
        interestedField: formData.interestedField,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        skills: selectedSkills,
        currentStatus: formData.currentStatus,
        availability: formData.availability,
        salary: {
          min: formData.minSalary ? parseInt(formData.minSalary) : 0,
          max: formData.maxSalary ? parseInt(formData.maxSalary) : 0,
        },
        cvFile: formData.cvFile?.name,
        willBeContacted: formData.willBeContacted,
        metadata: {
          source: "profile_creation",
          duplicateCheckPerformed: true,
          smartMatchResult,
        },
      };

      const savedCandidate = await saveNewCandidateOptimized(candidateData);

      setSuccessMessage("✅ Profile created successfully!");
      setTimeout(() => {
        navigate("/profile-merge", {
          state: { candidateId: savedCandidate.id },
        });
      }, 1500);
    } catch (error) {
      console.error("Profile creation error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to create profile. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const matchResult = smartMatchResult
    ? formatSmartMatchResult(smartMatchResult)
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Create Your Professional Profile
          </h1>
          <p className="text-slate-500 text-sm">
            Complete your profile to join our global talent pool. Your data will
            be checked for duplicates automatically.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Smart Match Status Banner */}
        {matchResult && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              matchResult.statusColor === "success"
                ? "bg-green-50 border-green-200"
                : matchResult.statusColor === "error"
                  ? "bg-red-50 border-red-200"
                  : matchResult.statusColor === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="mt-1">
              {matchResult.statusColor === "success" ? (
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <FiAlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <div
                className={`font-bold text-sm ${
                  matchResult.statusColor === "success"
                    ? "text-green-700"
                    : matchResult.statusColor === "error"
                      ? "text-red-700"
                      : matchResult.statusColor === "warning"
                        ? "text-yellow-700"
                        : "text-blue-700"
                }`}
              >
                {matchResult.statusBadge}
              </div>
              <p className="text-xs mt-1 text-slate-600">
                {matchResult.actionText}
              </p>
            </div>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Section 1: Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FiUser className="text-slate-500 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Personal Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                required
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <FormField
                label="Mobile Number"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
              />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition ${
                    errors.dateOfBirth
                      ? "border-red-300 focus:ring-red-500/10"
                      : "border-slate-200"
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-600 text-xs">{errors.dateOfBirth}</p>
                )}
              </div>
              <FormField
                label="LinkedIn Profile URL"
                name="linkedinUrl"
                placeholder="linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Section 2: Professional Background */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FiBriefcase className="text-slate-500 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Professional Background
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Interested Field *
                </label>
                <select
                  name="interestedField"
                  value={formData.interestedField}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 transition ${
                    errors.interestedField
                      ? "border-red-300 focus:ring-red-500/10"
                      : "border-slate-200"
                  }`}
                >
                  <option value="">Select a field...</option>
                  {getAllFields().map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
                {errors.interestedField && (
                  <p className="text-red-600 text-xs">
                    {errors.interestedField}
                  </p>
                )}
              </div>
              <FormField
                label="Years of Experience"
                name="yearsOfExperience"
                type="number"
                placeholder="e.g. 5"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
              />
            </div>

            {/* Dynamic Skills Section */}
            {suggestedSkills.length > 0 && (
              <div className="space-y-4 mb-8">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Key Skills (Suggested for {formData.interestedField})
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-full border transition ${
                        selectedSkills.includes(skill)
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:border-blue-100"
                      }`}
                    >
                      {selectedSkills.includes(skill) ? "✓ " : "+ "}{skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Current Status
                </label>
                <div className="space-y-2">
                  <RadioOption
                    label="Actively Looking"
                    name="currentStatus"
                    value="actively_looking"
                    checked={formData.currentStatus === "actively_looking"}
                    onChange={handleInputChange}
                  />
                  <RadioOption
                    label="Open to Opportunities"
                    name="currentStatus"
                    value="open_to_opportunities"
                    checked={
                      formData.currentStatus === "open_to_opportunities"
                    }
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 transition"
                >
                  <option value="immediate">Immediate</option>
                  <option value="1_month">1 Month Notice</option>
                  <option value="3_months">3 Months Notice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Preferences & Attachments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FiPaperclip className="text-slate-500 w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Preferences & Attachments
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Expected Annual Salary Range
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="minSalary"
                      placeholder="Min"
                      value={formData.minSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                    <span className="text-slate-300 font-bold">—</span>
                    <input
                      type="text"
                      name="maxSalary"
                      placeholder="Max"
                      value={formData.maxSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="willBeContacted"
                    checked={formData.willBeContacted}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-none mb-1">
                      Willing to be Contacted
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Allow recruiters to reach out via email or phone for
                      premium opportunities.
                    </p>
                  </div>
                </div>
                {errors.willBeContacted && (
                  <p className="text-red-600 text-xs">{errors.willBeContacted}</p>
                )}
              </div>

              {/* CV Upload */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Resume/CV Upload *
                </label>
                <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition cursor-pointer group">
                  <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition">
                    <FiUploadCloud className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 mb-1">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                    PDF, DOCX up to 10MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {formData.cvFile && (
                  <div className="bg-white border border-slate-100 rounded-lg p-2 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] text-slate-500 font-medium truncate italic">
                      {formData.cvFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, cvFile: null }))
                      }
                      className="text-rose-500 text-xs font-bold px-1 hover:bg-rose-50 rounded"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {errors.cvFile && (
                  <p className="text-red-600 text-xs">{errors.cvFile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {errors.smartMatch && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errors.smartMatch}</p>
            </div>
          )}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-6 pt-6">
            <button
              type="submit"
              disabled={
                submitting ||
                matchingInProgress ||
                !!(smartMatchResult && !smartMatchResult.canProceedToSuccess)
              }
              className="w-full md:w-auto px-16 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating Profile..." : "Complete Registration →"}
            </button>
            {matchingInProgress && (
              <p className="text-xs text-slate-500">
                Checking for duplicates...
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-components
const FormField: React.FC<{
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}> = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  required = false,
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
      {label}
      {required && " *"}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition ${
        error ? "border-red-300 focus:ring-red-500/10" : "border-slate-200"
      }`}
    />
    {error && <p className="text-red-600 text-xs">{error}</p>}
  </div>
);

const RadioOption: React.FC<{
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 hover:border-blue-200 transition">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);

export default ProfileCreate;
