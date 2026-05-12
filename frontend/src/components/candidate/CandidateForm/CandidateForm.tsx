import { useState, type FormEvent } from "react";
import type { CandidateRecord } from "../../../utils/candidateTypes";
import "./CandidateForm.css";

function initialsFromName(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

export interface CandidateFormProps {
  onSubmit: (draft: Omit<CandidateRecord, "id">) => void;
  submitLabel?: string;
}

export function CandidateForm({
  onSubmit,
  submitLabel = "Submit profile",
}: CandidateFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [skillsRaw, setSkillsRaw] = useState("");
  const [category, setCategory] =
    useState<CandidateRecord["category"]>("Mid-Level");
  const [bio, setBio] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const skills = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    const draft: Omit<CandidateRecord, "id"> = {
      initials: initialsFromName(fullName),
      name: fullName.trim(),
      email: email.trim(),
      role: role.trim() || "Candidate",
      skills: skills.length ? skills : ["General"],
      location: location.trim() || "Remote",
      experience: experience.trim() || "—",
      status: "New",
      statusTone: "gray",
      category,
      verificationStatus: "Profile Submitted",
      lastActiveLabel: "Just now",
      activelyLooking: true,
    };
    onSubmit(draft);
    setFullName("");
    setEmail("");
    setRole("");
    setLocation("");
    setExperience("");
    setSkillsRaw("");
    setBio("");
  };

  return (
    <form className="cbf-form" onSubmit={handleSubmit}>
      <div className="cbf-field">
        <label htmlFor="cbf-name">Full name</label>
        <input
          id="cbf-name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Alex Jordan"
          autoComplete="name"
        />
      </div>
      <div className="cbf-field">
        <label htmlFor="cbf-email">Email address</label>
        <input
          id="cbf-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
        />
      </div>
      <div className="cbf-two">
        <div className="cbf-field">
          <label htmlFor="cbf-role">Current role</label>
          <input
            id="cbf-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Senior Product Designer"
          />
        </div>
        <div className="cbf-field">
          <label htmlFor="cbf-exp">Years of experience</label>
          <input
            id="cbf-exp"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 8 Years"
          />
        </div>
      </div>
      <div className="cbf-field">
        <label htmlFor="cbf-loc">Location</label>
        <input
          id="cbf-loc"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Chicago, IL or Remote"
        />
      </div>
      <div className="cbf-field">
        <label htmlFor="cbf-cat">Seniority category</label>
        <select
          id="cbf-cat"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as CandidateRecord["category"])
          }
        >
          <option value="Junior">Junior (0–2 Years)</option>
          <option value="Mid-Level">Mid-Level (3–6 Years)</option>
          <option value="Lead / Director">Lead / Director (7+ Years)</option>
        </select>
      </div>
      <div className="cbf-field">
        <label htmlFor="cbf-skills">Primary skills (comma-separated)</label>
        <input
          id="cbf-skills"
          value={skillsRaw}
          onChange={(e) => setSkillsRaw(e.target.value)}
          placeholder="React, TypeScript, Figma"
        />
      </div>
      <div className="cbf-field">
        <label htmlFor="cbf-bio">Professional bio</label>
        <textarea
          id="cbf-bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short summary for recruiters and admins..."
        />
      </div>
      <div className="cbf-actions">
        <button type="submit" className="cbf-btn">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
