import {
  collection,
  query,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../config/firebase.js";

type JobFilters = {
  department?: string;
  location?: string;
  jobType?: string;
};

type Job = {
  department?: string;
  location?: string;
  jobType?: string;
  title?: string;
  salary?: string;
  badge?: string;
  description?: string;
  [key: string]: unknown;
};

type TicketPayload = {
  subject: string;
  category: string;
  description: string;
  attachmentURL?: string | null;
  status?: string;
};

type ApplicationData = Record<string, unknown>;

async function fetchJobsFromCollection(collectionName: string, sliceSize: number) {
  const jobsRef = collection(db, collectionName);
  const jobsQuery = query(jobsRef, limit(sliceSize));
  const snapshot = await getDocs(jobsQuery);

  const jobs = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
    const data = doc.data() as Job;
    return { id: doc.id, ...data };
  });

  return { jobs, count: jobs.length };
}

function normalize(v: unknown): string {
  return String(v ?? "").trim().toLowerCase();
}

async function seedJobsIfEmpty() {
  // Try the canonical collection first.
  const seedCandidates = ["jobs", "job", "Job"];

  for (const name of seedCandidates) {
    const { count } = await fetchJobsFromCollection(name, 1);
    if (count > 0) return { seeded: false, collectionUsed: name };
  }

  const jobsCollectionToSeed = "jobs";
  const samples: Array<Partial<Job>> = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote - EMEA",
      jobType: "Full-time",
      salary: "$140k - $190k",
      badge: "ENGINEERING",
      description: "A high-level technical role focused on building and maintaining complex web applications. You’ll be responsible for the full development lifecycle—from writing clean code to mentoring junior staff—ensuring that global platforms remain scalable, secure, and high-performing.",
    },
    {
      title: "Principal UX Designer",
      department: "Product Design",
      location: "San Francisco, CA",
      jobType: "Full-time",
      salary: "$160k - $210k",
      badge: "PRODUCT DESIGN",
      description: "A strategic leadership position that oversees the look and feel of digital products. This role combines user research with hands-on design (wireframing and prototyping) to create intuitive experiences, while also maintaining a cohesive design system across the entire organization.",
    },
    {
      title: "Backend Developer (Rust)",
      department: "Engineering",
      location: "London, UK / Remote",
      jobType: "Full-time",
      salary: "$130k - $180k",
      badge: "ENGINEERING",
      description: "A specialized engineering role focused on high-performance infrastructure. Using the Rust programming language, you will design the \"under-the-hood\" systems, such as APIs and microservices, that ensure data flows quickly and reliably across distributed networks.",
    },
    {
      title: "Technical Project Manager",
      department: "Operations",
      location: "Hybrid - Berlin",
      jobType: "Full-time",
      salary: "$110k - $150k",
      badge: "OPERATIONS",
      description: "The bridge between business goals and technical execution. This role involves planning timelines, managing risks, and leading Agile ceremonies (like sprint planning) to ensure that software projects are delivered on time, within budget, and according to quality standards.",
    },
    {
      title: "Security Analyst",
      department: "Engineering",
      location: "Tokyo, Japan",
      jobType: "Full-time",
      salary: "$120k - $170k",
      badge: "ENGINEERING",
      description: "A critical defense role dedicated to protecting company data from cyber threats. You will spend your time monitoring for vulnerabilities, conducting risk assessments, and responding to incidents to ensure the company's digital infrastructure remains secure and compliant.",
    },
    {
      title: "Product Owner",
      department: "Product Design",
      location: "Remote - US",
      jobType: "Full-time",
      salary: "$130k - $175k",
      badge: "PRODUCT DESIGN",
      description: "A leadership role that acts as the \"voice of the customer\" within the development team. You are responsible for defining the product roadmap, prioritizing the feature backlog, and ensuring that every technical task aligns with the overall business strategy and user needs.",
    },
  ];

  const jobsRef = collection(db, jobsCollectionToSeed);
  const createdAt = serverTimestamp();

  // Insert sample docs
  await Promise.all(
    samples.map((s, idx) =>
      addDoc(jobsRef, {
        ...s,
        createdAt,
        // Helps debugging and makes duplicates less likely if re-run
        seedKey: `default-seed-${idx}`,
      }),
    ),
  );

  return { seeded: true, collectionUsed: jobsCollectionToSeed };
}

export async function fetchJobs(
  filters: JobFilters = {},
  _pageSize = 6,
  _startAfterDoc: QueryDocumentSnapshot | null = null,
) {
  const seedResult = await seedJobsIfEmpty();

  // Try common collection names after seeding attempt.
  const collectionCandidates = ["jobs", "job", "Job"];

  const jobsSliceSize = 80;

  let rawJobs: Job[] = [];
  let totalFetched = 0;
  let usedCollection: string | null = null;

  for (const name of collectionCandidates) {
    const result = await fetchJobsFromCollection(name, jobsSliceSize);
    if (result.count > 0) {
      rawJobs = result.jobs;
      totalFetched = result.count;
      usedCollection = name;
      break;
    }
  }

  // Apply filters in-memory (case-insensitive/trim)
  const filteredJobs = rawJobs.filter((job) => {
    const matchesDepartment =
      !filters.department || normalize(job.department) === normalize(filters.department);
    const matchesLocation = !filters.location || normalize(job.location) === normalize(filters.location);
    const matchesJobType = !filters.jobType || normalize(job.jobType) === normalize(filters.jobType);
    return matchesDepartment && matchesLocation && matchesJobType;
  });

  // Ensure UI still shows something if filtering doesn't match any of the fetched window.
  const jobsToReturn = filteredJobs.length > 0 ? filteredJobs : rawJobs;

  return {
    jobs: jobsToReturn,
    lastVisible: null,
    totalFetched,
    usedCollection,
    seeded: seedResult.seeded,
  };
}

export async function fetchJobById(jobId: string) {
  await seedJobsIfEmpty();
  const collectionCandidates = ["jobs", "job", "Job"];

  for (const name of collectionCandidates) {
    const jobRef = doc(db, name, jobId);
    const snapshot = await getDoc(jobRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...(snapshot.data() as Job) };
    }
  }

  throw new Error("Job not found.");
}

export async function submitApplication(jobId: string, userData: ApplicationData) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be signed in to submit an application.");
  }

  const applicationRef = collection(db, "applications");
  const docRef = await addDoc(applicationRef, {
    jobId,
    userId: user.uid,
    email: user.email || null,
    status: "submitted",
    createdAt: serverTimestamp(),
    ...userData,
  });

  return {
    success: true,
    applicationId: docRef.id,
  };
}

export async function uploadTicketAttachment(file: File) {
  if (!auth.currentUser) {
    throw new Error("User must be signed in to upload an attachment.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and PDF attachments are allowed.");
  }

  const fileName = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `tickets/${auth.currentUser.uid}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function createTicket(ticketData: TicketPayload) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be signed in to create a support ticket.");
  }

  const ticketRef = collection(db, "tickets");
  const docRef = await addDoc(ticketRef, {
    userId: user.uid,
    subject: ticketData.subject,
    category: ticketData.category,
    description: ticketData.description,
    attachmentURL: ticketData.attachmentURL || null,
    status: ticketData.status || "open",
    createdAt: serverTimestamp(),
  });

  return {
    success: true,
    ticketId: docRef.id,
  };
}
