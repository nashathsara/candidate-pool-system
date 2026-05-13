import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {
  ensureFirebaseAuthReady,
  firebaseSetupError,
  firebaseStorage,
  firestoreDb,
  isFirebaseConfigured,
} from "../config/firebase";
import type { CandidateRecord, ListStatusTone, VerificationStatus } from "../utils/candidateTypes";

const CANDIDATE_CACHE_KEY = "candidatePool_candidates_firebase_cache";
const ADMIN_PROFILE_ID = "primary";

export type AdminProfileSettings = {
  fullName: string;
  email: string;
  bio: string;
  profileVisibility: boolean;
  profilePhoto: string;
  updatedAt?: string;
};

export type AdminNotification = {
  id: string;
  message: string;
  read: boolean;
  createdAt?: string;
};

export const defaultAdminProfile: AdminProfileSettings = {
  fullName: "Alex Jordan",
  email: "alex.jordan@candidate.pulse",
  bio: "Recruitment administrator focused on maintaining a high-quality, verified candidate pool and supporting hiring teams with timely profile reviews.",
  profileVisibility: true,
  profilePhoto: "",
};

const assertFirestore = () => {
  if (!isFirebaseConfigured || !firestoreDb) {
    throw new Error(firebaseSetupError || "Firebase is not configured.");
  }

  return firestoreDb;
};

const toIsoString = (value: unknown, fallback = new Date().toISOString()) => {
  if (typeof value === "string" && value) {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  return fallback;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CH";

const parseSkills = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter((skill): skill is string => typeof skill === "string" && Boolean(skill.trim()));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const getStringField = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

const getResumeField = (value: unknown) => {
  if (typeof value === "string") {
    return getStringField(value);
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const fileData = value as Record<string, unknown>;
  return (
    getStringField(fileData.downloadUrl) ||
    getStringField(fileData.downloadURL) ||
    getStringField(fileData.url) ||
    getStringField(fileData.fullPath) ||
    getStringField(fileData.path) ||
    getStringField(fileData.name)
  );
};

const getStatusTone = (status: string): ListStatusTone => {
  if (status === "Withdrawn" || status === "Rejected") {
    return "red";
  }

  if (status === "Not Yet Reviewed" || status === "New") {
    return "gray";
  }

  return "blue";
};

const getCategory = (data: Record<string, unknown>): CandidateRecord["category"] => {
  const explicitCategory = data.category;
  if (explicitCategory === "Junior" || explicitCategory === "Mid-Level" || explicitCategory === "Lead / Director") {
    return explicitCategory;
  }

  const years = Number(data.yearsExperience ?? 0);
  if (years <= 2) return "Junior";
  if (years <= 6) return "Mid-Level";
  return "Lead / Director";
};

const getExperienceLabel = (data: Record<string, unknown>) => {
  if (typeof data.experience === "string" && data.experience) {
    return data.experience;
  }

  const years = Number(data.yearsExperience ?? 0);
  return `${years} ${years === 1 ? "Year" : "Years"}`;
};

const mapCandidate = (id: string, data: Record<string, unknown>): CandidateRecord => {
  const name =
    (typeof data.name === "string" && data.name) ||
    (typeof data.fullName === "string" && data.fullName) ||
    "Unnamed Candidate";
  const role =
    (typeof data.role === "string" && data.role) ||
    (typeof data.title === "string" && data.title) ||
    (typeof data.currentRole === "string" && data.currentRole) ||
    "Candidate";
  const verificationStatus = ((data.verificationStatus || data.status || "New") as VerificationStatus);

  return {
    id,
    initials: typeof data.initials === "string" && data.initials ? data.initials : getInitials(name),
    name,
    email: typeof data.email === "string" ? data.email : "",
    role,
    skills: parseSkills(data.skills),
    extraSkillsCount: typeof data.extraSkillsCount === "number" ? data.extraSkillsCount : undefined,
    location: typeof data.location === "string" ? data.location : "",
    experience: getExperienceLabel(data),
    status: typeof data.status === "string" ? data.status : verificationStatus,
    statusTone: getStatusTone(verificationStatus),
    category: getCategory(data),
    verificationStatus,
    lastActiveLabel: typeof data.lastActiveLabel === "string" ? data.lastActiveLabel : "Recently",
    phone: typeof data.phone === "string" ? data.phone : "",
    availability: typeof data.availability === "string" ? data.availability : typeof data.availabilityStatus === "string" ? data.availabilityStatus : "",
    activelyLooking:
      typeof data.activelyLooking === "boolean"
        ? data.activelyLooking
        : data.status === "Actively Looking" || data.availability === "Available",
    resumeUrl: getResumeField(data.resumeUrl),
    cvUrl: getResumeField(data.cvUrl),
    resumeFile: getResumeField(data.resumeFile),
    resumeDownloadUrl: getResumeField(data.resumeDownloadUrl),
    cvDownloadUrl: getResumeField(data.cvDownloadUrl),
  };
};

const resumeFieldPriority = [
  "resumeDownloadUrl",
  "cvDownloadUrl",
  "resumeUrl",
  "cvUrl",
  "resumeFile",
] as const;

const isWebUrl = (value: string) => /^https?:\/\//i.test(value);

export const getCandidateResumeSource = (candidate: CandidateRecord) => {
  for (const fieldName of resumeFieldPriority) {
    const value = candidate[fieldName];
    if (value) {
      return { fieldName, value };
    }
  }

  return null;
};

export const hasCandidateResume = (candidate: CandidateRecord) => Boolean(getCandidateResumeSource(candidate));

export const getCandidateResumeDownloadUrl = async (candidate: CandidateRecord) => {
  const resumeSource = getCandidateResumeSource(candidate);
  if (!resumeSource) {
    return null;
  }

  if (isWebUrl(resumeSource.value)) {
    return resumeSource.value;
  }

  if (!firebaseStorage) {
    throw new Error("No resume uploaded for this candidate.");
  }

  const downloadUrl = await getDownloadURL(ref(firebaseStorage, resumeSource.value));

  if (firestoreDb) {
    await setDoc(
      doc(firestoreDb, "candidates", candidate.id),
      {
        resumeDownloadUrl: downloadUrl,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    ).catch((error) => {
      console.warn("Resume download URL resolved but could not be saved to Firestore.", error);
    });
  }

  return downloadUrl;
};

const cacheCandidates = (candidates: CandidateRecord[]) => {
  try {
    localStorage.setItem(CANDIDATE_CACHE_KEY, JSON.stringify(candidates));
  } catch {
    /* cache is optional */
  }
};

export const readCachedCandidates = () => {
  try {
    const rawValue = localStorage.getItem(CANDIDATE_CACHE_KEY);
    return rawValue ? (JSON.parse(rawValue) as CandidateRecord[]) : [];
  } catch {
    return [];
  }
};

export const getCandidates = async () => {
  const db = assertFirestore();
  const snapshot = await getDocs(collection(db, "candidates"));
  const candidates = snapshot.docs
    .map((candidateDoc) => mapCandidate(candidateDoc.id, candidateDoc.data()))
    .sort((left, right) => right.lastActiveLabel.localeCompare(left.lastActiveLabel));
  cacheCandidates(candidates);
  return candidates;
};

export const getCandidateById = async (id: string) => {
  const db = assertFirestore();
  const snapshot = await getDoc(doc(db, "candidates", id));

  if (!snapshot.exists()) {
    return null;
  }

  return mapCandidate(snapshot.id, snapshot.data());
};

export const updateCandidate = async (id: string, data: Partial<CandidateRecord>) => {
  const db = assertFirestore();
  await updateDoc(doc(db, "candidates", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  return getCandidateById(id);
};

export const updateCandidateStatus = async (id: string, status: VerificationStatus) => {
  const db = assertFirestore();
  const user = await ensureFirebaseAuthReady();
  const statusTone = getStatusTone(status);
  await updateDoc(doc(db, "candidates", id), {
    status,
    verificationStatus: status,
    statusTone,
    lastActiveLabel: "Just now",
    updatedAt: new Date().toISOString(),
    reviewedBy: user?.uid ?? "admin",
  });
  return getCandidateById(id);
};

export const getAdminProfile = async () => {
  const db = assertFirestore();
  const snapshot = await getDoc(doc(db, "adminProfiles", ADMIN_PROFILE_ID));

  if (!snapshot.exists()) {
    return defaultAdminProfile;
  }

  const data = snapshot.data();
  return {
    ...defaultAdminProfile,
    ...data,
    updatedAt: toIsoString(data.updatedAt, defaultAdminProfile.updatedAt),
  } as AdminProfileSettings;
};

const uploadAdminProfilePhoto = async (profilePhoto: string) => {
  if (!profilePhoto || !profilePhoto.startsWith("data:") || !firebaseStorage) {
    return profilePhoto;
  }

  try {
    const imageRef = ref(firebaseStorage, `adminProfiles/${ADMIN_PROFILE_ID}/profile-photo`);
    await uploadString(imageRef, profilePhoto, "data_url");
    return getDownloadURL(imageRef);
  } catch (error) {
    console.warn("Firebase Storage upload failed; storing profile image in Firestore for demo.", error);
    return profilePhoto;
  }
};

export const updateAdminProfile = async (data: Partial<AdminProfileSettings>) => {
  const db = assertFirestore();
  const nextProfilePhoto =
    typeof data.profilePhoto === "string" ? await uploadAdminProfilePhoto(data.profilePhoto) : data.profilePhoto;
  const payload = {
    ...data,
    ...(typeof nextProfilePhoto === "string" ? { profilePhoto: nextProfilePhoto } : {}),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "adminProfiles", ADMIN_PROFILE_ID), payload, { merge: true });
  return getAdminProfile();
};

export const getNotifications = async () => {
  const db = assertFirestore();
  const snapshot = await getDocs(collection(db, "notifications"));
  return snapshot.docs.map((notificationDoc) => {
    const data = notificationDoc.data();
    return {
      id: notificationDoc.id,
      message: typeof data.message === "string" ? data.message : "Notification",
      read: Boolean(data.read),
      createdAt: toIsoString(data.createdAt, ""),
    };
  });
};

export const markNotificationsAsRead = async (ids: string[]) => {
  const db = assertFirestore();
  await Promise.all(
    ids.map((id) =>
      updateDoc(doc(db, "notifications", id), {
        read: true,
        updatedAt: new Date().toISOString(),
      }),
    ),
  );
};
