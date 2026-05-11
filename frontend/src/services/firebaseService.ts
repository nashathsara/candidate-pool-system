import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../config/firebase.js";

type JobFilters = {
  department?: string;
  location?: string;
  jobType?: string;
};

type TicketPayload = {
  subject: string;
  category: string;
  description: string;
  attachmentURL?: string | null;
  status?: string;
};

type ApplicationData = Record<string, unknown>;

export async function fetchJobs(
  filters: JobFilters = {},
  pageSize = 6,
  startAfterDoc: QueryDocumentSnapshot | null = null,
) {
  const jobsRef = collection(db, "jobs");
  const constraints: QueryConstraint[] = [];

  if (filters.department) {
    constraints.push(where("department", "==", filters.department));
  }
  if (filters.location) {
    constraints.push(where("location", "==", filters.location));
  }
  if (filters.jobType) {
    constraints.push(where("jobType", "==", filters.jobType));
  }

  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(pageSize));

  if (startAfterDoc) {
    constraints.push(startAfter(startAfterDoc));
  }

  const jobsQuery = query(jobsRef, ...constraints);
  const snapshot = await getDocs(jobsQuery);

  const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { jobs, lastVisible };
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
