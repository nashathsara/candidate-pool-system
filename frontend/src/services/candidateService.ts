import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { ensureFirebaseAuthReady, firestoreDb, isFirebaseConfigured } from "../config/firebase";
import type { CandidateFormValues, CandidateProfile, CandidateStatus } from "../types/candidate";
import { demoCandidates } from "../utils/seedData";

const CANDIDATES_STORAGE_KEY = "candidate-hub:candidates";
const ACTIVE_CANDIDATE_STORAGE_KEY = "candidate-hub:active-candidate-id";

const getBrowserStorage = () =>
  typeof window === "undefined" ? null : window.localStorage;

const toIsoString = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value) {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  return fallback;
};

const parseSkills = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const sanitizeCandidate = (
  candidate: Partial<CandidateProfile> & Pick<CandidateProfile, "id" | "fullName" | "email">,
): CandidateProfile => {
  const now = new Date().toISOString();

  return {
    id: candidate.id,
    fullName: candidate.fullName.trim(),
    email: candidate.email.trim().toLowerCase(),
    phone: candidate.phone?.trim() ?? "",
    location: candidate.location?.trim() ?? "",
    title: candidate.title?.trim() ?? "Candidate",
    bio: candidate.bio?.trim() ?? "",
    department: candidate.department?.trim() ?? "Tech",
    yearsExperience: Number(candidate.yearsExperience ?? 0),
    skills: parseSkills(candidate.skills),
    status: (candidate.status as CandidateStatus) ?? "New",
    visibility: candidate.visibility ?? true,
    createdAt: candidate.createdAt ?? now,
    updatedAt: candidate.updatedAt ?? now,
    lastActiveAt: candidate.lastActiveAt ?? candidate.updatedAt ?? now,
    duplicateStatus: candidate.duplicateStatus ?? "none",
    duplicateCaseId: candidate.duplicateCaseId,
    reviewScores: candidate.reviewScores ?? {
      technical: 70,
      communication: 70,
      culture: 70,
    },
    experience: Array.isArray(candidate.experience) ? candidate.experience : [],
    education: Array.isArray(candidate.education) ? candidate.education : [],
    userId: candidate.userId,
  };
};

const readLocalCandidates = () => {
  const storage = getBrowserStorage();
  if (!storage) {
    return [...demoCandidates];
  }

  const rawValue = storage.getItem(CANDIDATES_STORAGE_KEY);
  if (!rawValue) {
    storage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(demoCandidates));
    return [...demoCandidates];
  }

  try {
    const parsed = JSON.parse(rawValue) as CandidateProfile[];
    return parsed.map((candidate) => sanitizeCandidate(candidate));
  } catch (error) {
    console.warn("Failed to parse local candidates, resetting demo dataset.", error);
    storage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(demoCandidates));
    return [...demoCandidates];
  }
};

const writeLocalCandidates = (candidates: CandidateProfile[]) => {
  const storage = getBrowserStorage();
  if (!storage) {
    return;
  }

  storage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidates));
};

const syncLocalCandidates = (candidates: CandidateProfile[]) => {
  const normalized = candidates.map((candidate) => sanitizeCandidate(candidate));
  writeLocalCandidates(normalized);
  return normalized;
};

const mapFirestoreCandidate = (id: string, data: Record<string, unknown>) =>
  sanitizeCandidate({
    ...data,
    id,
    fullName: typeof data.fullName === "string" ? data.fullName : "Unnamed Candidate",
    email: typeof data.email === "string" ? data.email : "",
    createdAt: toIsoString(data.createdAt, new Date().toISOString()),
    updatedAt: toIsoString(data.updatedAt, new Date().toISOString()),
    lastActiveAt: toIsoString(data.lastActiveAt, new Date().toISOString()),
  });

const saveCandidateLocally = (candidate: CandidateProfile) => {
  const candidates = readLocalCandidates();
  const nextCandidates = [...candidates];
  const candidateIndex = nextCandidates.findIndex((item) => item.id === candidate.id);

  if (candidateIndex >= 0) {
    nextCandidates[candidateIndex] = candidate;
  } else {
    nextCandidates.unshift(candidate);
  }

  syncLocalCandidates(nextCandidates);
};

export const listCandidates = async () => {
  if (firestoreDb && isFirebaseConfigured) {
    try {
      const candidatesQuery = query(collection(firestoreDb, "candidates"), orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(candidatesQuery);
      if (!snapshot.empty) {
        const firestoreCandidates = snapshot.docs.map((candidateDoc) =>
          mapFirestoreCandidate(candidateDoc.id, candidateDoc.data()),
        );
        return syncLocalCandidates(firestoreCandidates);
      }
    } catch (error) {
      console.warn("Falling back to local candidates after Firestore read failure.", error);
    }
  }

  return readLocalCandidates();
};

export const getCandidateById = async (candidateId: string) => {
  if (!candidateId) {
    return null;
  }

  if (firestoreDb && isFirebaseConfigured) {
    try {
      const snapshot = await getDoc(doc(firestoreDb, "candidates", candidateId));
      if (snapshot.exists()) {
        const firestoreCandidate = mapFirestoreCandidate(snapshot.id, snapshot.data());
        saveCandidateLocally(firestoreCandidate);
        return firestoreCandidate;
      }
    } catch (error) {
      console.warn("Falling back to local candidate after Firestore read failure.", error);
    }
  }

  return readLocalCandidates().find((candidate) => candidate.id === candidateId) ?? null;
};

export const getActiveCandidateId = () => getBrowserStorage()?.getItem(ACTIVE_CANDIDATE_STORAGE_KEY) ?? "";

export const setActiveCandidateId = (candidateId: string) => {
  if (!candidateId) {
    return;
  }

  getBrowserStorage()?.setItem(ACTIVE_CANDIDATE_STORAGE_KEY, candidateId);
};

const createCandidateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `candidate-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getPreferredCandidate = async (requestedCandidateId?: string | null) => {
  const candidateId = requestedCandidateId || getActiveCandidateId();

  if (candidateId) {
    const candidate = await getCandidateById(candidateId);
    if (candidate) {
      return candidate;
    }
  }

  const candidates = await listCandidates();
  return candidates[0] ?? null;
};

export const updateCandidateProfile = async (
  candidateId: string,
  values: CandidateFormValues,
  extraFields: Partial<CandidateProfile> = {},
) => {
  const existingCandidate = (await getCandidateById(candidateId)) ?? (await getPreferredCandidate());
  const now = new Date().toISOString();

  const nextCandidate = sanitizeCandidate({
    ...existingCandidate,
    ...extraFields,
    ...values,
    id: existingCandidate?.id ?? candidateId,
    fullName: values.fullName,
    email: values.email,
    updatedAt: now,
    lastActiveAt: now,
    createdAt: existingCandidate?.createdAt ?? now,
  });

  saveCandidateLocally(nextCandidate);
  setActiveCandidateId(nextCandidate.id);

  if (firestoreDb && isFirebaseConfigured) {
    try {
      const user = await ensureFirebaseAuthReady();
      await setDoc(
        doc(firestoreDb, "candidates", nextCandidate.id),
        {
          ...nextCandidate,
          userId: user?.uid ?? existingCandidate?.userId ?? "",
        },
        { merge: true },
      );
    } catch (error) {
      console.warn("Candidate saved locally because Firestore write failed.", error);
    }
  }

  return nextCandidate;
};

export const createCandidateProfile = async (
  values: CandidateFormValues,
  extraFields: Partial<CandidateProfile> = {},
) => {
  const now = new Date().toISOString();
  const candidate = sanitizeCandidate({
    ...extraFields,
    ...values,
    id: extraFields.id ?? createCandidateId(),
    fullName: values.fullName,
    email: values.email,
    status: (extraFields.status as CandidateStatus) ?? "New",
    createdAt: extraFields.createdAt ?? now,
    updatedAt: now,
    lastActiveAt: now,
  });

  saveCandidateLocally(candidate);
  setActiveCandidateId(candidate.id);

  if (firestoreDb && isFirebaseConfigured) {
    try {
      const user = await ensureFirebaseAuthReady();
      await setDoc(
        doc(firestoreDb, "candidates", candidate.id),
        {
          ...candidate,
          userId: user?.uid ?? candidate.userId ?? "",
        },
        { merge: true },
      );
    } catch (error) {
      console.warn("Candidate saved locally because Firestore write failed.", error);
    }
  }

  return candidate;
};
