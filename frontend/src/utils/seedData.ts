import type { CandidateProfile } from "../types/candidate";

const now = new Date();

const hoursAgo = (hours: number) =>
  new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

const daysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const demoCandidates: CandidateProfile[] = [
  {
    id: "cand-alex-rivera",
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (312) 555-0198",
    location: "Chicago, IL",
    title: "Senior Frontend Architect",
    bio: "Leading the frontend migration from monolithic architecture to micro-frontends and mentoring a senior UI engineering team.",
    department: "Tech",
    yearsExperience: 8,
    skills: ["React 18", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "GraphQL", "AWS", "Docker", "Kubernetes"],
    status: "In Review",
    visibility: true,
    createdAt: daysAgo(40),
    updatedAt: hoursAgo(2),
    lastActiveAt: hoursAgo(2),
    duplicateStatus: "none",
    reviewScores: {
      technical: 82,
      communication: 85,
      culture: 78,
    },
    experience: [
      {
        role: "Senior Frontend Architect",
        company: "CloudScale Systems",
        employmentType: "Full-time",
        period: "2021 - Present",
        summary:
          "Leading the frontend migration from monolithic architecture to micro-frontends using React and Next.js while improving performance across 12 product lines.",
      },
      {
        role: "Lead UI Engineer",
        company: "Velocity Dev Studio",
        employmentType: "Full-time",
        period: "2018 - 2021",
        summary:
          "Architected a reusable design system for 50+ client products and scaled the engineering team from 5 to 20 members.",
      },
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        graduated: "2018",
      },
      {
        degree: "B.S. Software Engineering",
        institution: "Georgia Institute of Technology",
        graduated: "2016",
      },
    ],
  },
  {
    id: "cand-janshika-sj",
    fullName: "Janshika Perera",
    email: "janshika@example.com",
    phone: "+94 77 101 2044",
    location: "Colombo, LK",
    title: "Senior UX Designer",
    bio: "Design leader focused on enterprise workflow simplification and accessible product systems.",
    department: "Product",
    yearsExperience: 6,
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping"],
    status: "Pending Review",
    visibility: true,
    createdAt: daysAgo(24),
    updatedAt: hoursAgo(1),
    lastActiveAt: hoursAgo(1),
    duplicateStatus: "none",
    reviewScores: {
      technical: 74,
      communication: 91,
      culture: 88,
    },
    experience: [
      {
        role: "Senior UX Designer",
        company: "Orbit Labs",
        employmentType: "Full-time",
        period: "2022 - Present",
        summary:
          "Owns candidate and recruiter experience design across application, review, and analytics workflows.",
      },
    ],
    education: [
      {
        degree: "B.Des. Interaction Design",
        institution: "University of Moratuwa",
        graduated: "2019",
      },
    ],
  },
  {
    id: "cand-parmila-mr",
    fullName: "Parmila Fernando",
    email: "parmila@example.com",
    phone: "+94 76 700 8822",
    location: "Remote",
    title: "Fullstack Engineer",
    bio: "Fullstack engineer delivering API-first talent workflows and scalable admin tooling.",
    department: "Tech",
    yearsExperience: 5,
    skills: ["React", "Node.js", "Firebase", "PostgreSQL"],
    status: "Profile Updated",
    visibility: true,
    createdAt: daysAgo(17),
    updatedAt: hoursAgo(5),
    lastActiveAt: hoursAgo(5),
    duplicateStatus: "none",
    reviewScores: {
      technical: 88,
      communication: 79,
      culture: 81,
    },
    experience: [
      {
        role: "Fullstack Engineer",
        company: "Talent Forge",
        employmentType: "Full-time",
        period: "2020 - Present",
        summary:
          "Built internal tooling for recruiter workflows, candidate profile search, and scorecard automation.",
      },
    ],
    education: [
      {
        degree: "B.Sc. Computer Science",
        institution: "SLIIT",
        graduated: "2020",
      },
    ],
  },
  {
    id: "cand-anne-existing",
    fullName: "Anne Piyula",
    email: "anne@example.com",
    phone: "+94 74 563 7829",
    location: "Jaffna, LK",
    title: "Lead Systems Architect",
    bio: "Enterprise architect with a strong background in distributed systems, integrations, and technical leadership.",
    department: "Tech",
    yearsExperience: 10,
    skills: ["System Design", "AWS", "Event-Driven Architecture", "Kubernetes"],
    status: "Actively Looking",
    visibility: true,
    createdAt: daysAgo(80),
    updatedAt: daysAgo(3),
    lastActiveAt: daysAgo(3),
    duplicateStatus: "none",
    reviewScores: {
      technical: 93,
      communication: 89,
      culture: 84,
    },
    experience: [
      {
        role: "Lead Systems Architect",
        company: "Northstar Platforms",
        employmentType: "Full-time",
        period: "2022 - Present",
        summary:
          "Leads architecture reviews and platform modernization programs for high-scale systems.",
      },
    ],
    education: [
      {
        degree: "M.Sc. Information Systems",
        institution: "University of Colombo",
        graduated: "2015",
      },
    ],
  },
  {
    id: "cand-anne-new",
    fullName: "Anne Piyula Arulpirabakar",
    email: "anne@example.com",
    phone: "+94 74 563 7829",
    location: "Jaffna, LK",
    title: "Senior Systems Architect",
    bio: "Recently updated application profile for a senior architecture leadership role.",
    department: "Tech",
    yearsExperience: 9,
    skills: ["Cloud Architecture", "Microservices", "AWS", "Leadership"],
    status: "New",
    visibility: true,
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
    lastActiveAt: hoursAgo(8),
    duplicateStatus: "none",
    reviewScores: {
      technical: 87,
      communication: 83,
      culture: 80,
    },
    experience: [
      {
        role: "Senior Systems Architect",
        company: "CrestScale",
        employmentType: "Contract",
        period: "2023 - Present",
        summary:
          "Designed resilient service platforms and managed strategic client modernization projects.",
      },
    ],
    education: [
      {
        degree: "B.Eng. Software Engineering",
        institution: "University of Jaffna",
        graduated: "2017",
      },
    ],
  },
];
