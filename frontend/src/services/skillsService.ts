/**
 * Skills Lookup Service
 * Provides dynamic skill suggestions based on selected field/role
 */

export type FieldType =
  | "Software Engineering"
  | "Data Science"
  | "Product Management"
  | "Design"
  | "Cybersecurity"
  | "Infrastructure Engineering";

export interface SkillsMap {
  [key: string]: string[];
}

export const FIELD_SKILLS_MAP: Record<FieldType, string[]> = {
  "Software Engineering": [
    "React.js",
    "TypeScript",
    "Node.js",
    "Docker",
    "AWS",
    "REST APIs",
    "Git",
    "SQL",
    "MongoDB",
    "Microservices",
  ],
  "Data Science": [
    "Python",
    "Machine Learning",
    "TensorFlow",
    "Pandas",
    "Jupyter",
    "SQL",
    "Statistics",
    "Data Visualization",
    "PyTorch",
    "Scikit-learn",
  ],
  "Product Management": [
    "Product Strategy",
    "Roadmapping",
    "User Research",
    "Analytics",
    "A/B Testing",
    "Agile",
    "Stakeholder Management",
    "Figma",
    "JIRA",
    "OKRs",
  ],
  Design: [
    "UI/UX Design",
    "Figma",
    "Prototyping",
    "User Research",
    "Wireframing",
    "Design Systems",
    "Sketch",
    "Adobe XD",
    "Accessibility",
    "CSS",
  ],
  Cybersecurity: [
    "Network Security",
    "Penetration Testing",
    "Firewalls",
    "Cryptography",
    "SIEM",
    "Risk Assessment",
    "Incident Response",
    "OWASP",
    "Linux",
    "Python",
  ],
  "Infrastructure Engineering": [
    "Kubernetes",
    "Terraform",
    "CI/CD",
    "AWS",
    "Docker",
    "Linux",
    "Monitoring",
    "Ansible",
    "GCP",
    "Infrastructure as Code",
  ],
};

/**
 * Get skills for a given field
 * @param field - The field/role selected by user
 * @returns Array of suggested skills
 */
export const getSkillsByField = (field: FieldType): string[] => {
  return FIELD_SKILLS_MAP[field] || [];
};

/**
 * Get all available fields
 */
export const getAllFields = (): FieldType[] => {
  return Object.keys(FIELD_SKILLS_MAP) as FieldType[];
};

/**
 * Enrich candidate data with skills based on field
 */
export const enrichCandidateWithSkills = (
  candidateData: any,
  field: FieldType
): any => {
  const suggestedSkills = getSkillsByField(field);
  return {
    ...candidateData,
    suggestedSkills,
    field,
  };
};

/**
 * Calculate skill match percentage between candidate and job
 */
export const calculateSkillMatch = (
  candidateSkills: string[],
  jobSkills: string[]
): number => {
  if (jobSkills.length === 0) return 0;
  const matches = candidateSkills.filter((skill) =>
    jobSkills.some(
      (jobSkill) =>
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  return Math.round((matches.length / jobSkills.length) * 100);
};
