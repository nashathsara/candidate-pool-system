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
import type { CandidateProfile, DuplicateCase } from "../types/candidate";
import { getCandidateById, listCandidates, updateCandidateProfile } from "./candidateService";

const DUPLICATE_STORAGE_KEY = "candidate-hub:duplicates";

const getBrowserStorage = () =>
  typeof window === "undefined" ? null : window.localStorage;

const sanitizeDuplicateCase = (duplicateCase: DuplicateCase): DuplicateCase => ({
  ...duplicateCase,
  confidence: Math.max(0, Math.min(100, Math.round(duplicateCase.confidence))),
  reasons: Array.isArray(duplicateCase.reasons) ? duplicateCase.reasons : [],
});

const readLocalDuplicateCases = () => {
  const storage = getBrowserStorage();
  if (!storage) {
    return [] as DuplicateCase[];
  }

  const rawValue = storage.getItem(DUPLICATE_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as DuplicateCase[];
    return parsed.map((duplicateCase) => sanitizeDuplicateCase(duplicateCase));
  } catch (error) {
    console.warn("Failed to parse local duplicate cases.", error);
    return [];
  }
};

const writeLocalDuplicateCases = (duplicateCases: DuplicateCase[]) => {
  const storage = getBrowserStorage();
  if (!storage) {
    return;
  }

  storage.setItem(DUPLICATE_STORAGE_KEY, JSON.stringify(duplicateCases));
};

const syncLocalDuplicateCases = (duplicateCases: DuplicateCase[]) => {
  const normalized = duplicateCases.map((duplicateCase) => sanitizeDuplicateCase(duplicateCase));
  writeLocalDuplicateCases(normalized);
  return normalized;
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(" ")
    .filter(Boolean);

const normalizePhone = (value: string) => value.replace(/\D/g, "");

const calculateTokenSimilarity = (left: string, right: string) => {
  const leftTokens = new Set(normalizeName(left));
  const rightTokens = new Set(normalizeName(right));
  const union = new Set([...leftTokens, ...rightTokens]);

  if (union.size === 0) {
    return 0;
  }

  let matches = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) {
      matches += 1;
    }
  });

  return matches / union.size;
};

const buildDuplicateReasons = (candidate: CandidateProfile, matchedCandidate: CandidateProfile) => {
  const reasons: string[] = [];
  let score = 0;

  if (candidate.email && candidate.email === matchedCandidate.email) {
    reasons.push(`Email match: ${candidate.email}`);
    score += 55;
  }

  if (candidate.phone && normalizePhone(candidate.phone) === normalizePhone(matchedCandidate.phone)) {
    reasons.push(`Phone match: ${candidate.phone}`);
    score += 25;
  }

  const nameSimilarity = calculateTokenSimilarity(candidate.fullName, matchedCandidate.fullName);
  if (nameSimilarity >= 0.5) {
    reasons.push(
      nameSimilarity >= 0.9
        ? `Name match: ${matchedCandidate.fullName}`
        : `Strong name overlap with ${matchedCandidate.fullName}`,
    );
    score += Math.round(nameSimilarity * 20);
  }

  if (candidate.location && candidate.location === matchedCandidate.location) {
    reasons.push(`Location overlap: ${candidate.location}`);
    score += 5;
  }

  if (candidate.title && matchedCandidate.title && candidate.title.split(" ")[0] === matchedCandidate.title.split(" ")[0]) {
    reasons.push(`Role family overlap: ${matchedCandidate.title}`);
    score += 5;
  }

  return {
    reasons,
    confidence: Math.min(99, score),
  };
};

const upsertDuplicateCaseLocally = (duplicateCase: DuplicateCase) => {
  const existingCases = readLocalDuplicateCases();
  const nextCases = [...existingCases];
  const duplicateIndex = nextCases.findIndex((item) => item.id === duplicateCase.id);

  if (duplicateIndex >= 0) {
    nextCases[duplicateIndex] = duplicateCase;
  } else {
    nextCases.unshift(duplicateCase);
  }

  syncLocalDuplicateCases(nextCases);
};

export const listDuplicateCases = async () => {
  if (firestoreDb && isFirebaseConfigured) {
    try {
      const duplicatesQuery = query(collection(firestoreDb, "duplicates"), orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(duplicatesQuery);
      if (!snapshot.empty) {
        const firestoreCases = snapshot.docs.map((duplicateDoc) =>
          sanitizeDuplicateCase({
            id: duplicateDoc.id,
            ...(duplicateDoc.data() as Omit<DuplicateCase, "id">),
          }),
        );

        return syncLocalDuplicateCases(firestoreCases);
      }
    } catch (error) {
      console.warn("Falling back to local duplicate cases after Firestore read failure.", error);
    }
  }

  return readLocalDuplicateCases();
};

export const getDuplicateCaseById = async (duplicateCaseId: string) => {
  if (!duplicateCaseId) {
    return null;
  }

  if (firestoreDb && isFirebaseConfigured) {
    try {
      const snapshot = await getDoc(doc(firestoreDb, "duplicates", duplicateCaseId));
      if (snapshot.exists()) {
        const duplicateCase = sanitizeDuplicateCase({
          id: snapshot.id,
          ...(snapshot.data() as Omit<DuplicateCase, "id">),
        });
        upsertDuplicateCaseLocally(duplicateCase);
        return duplicateCase;
      }
    } catch (error) {
      console.warn("Falling back to local duplicate case after Firestore read failure.", error);
    }
  }

  return readLocalDuplicateCases().find((duplicateCase) => duplicateCase.id === duplicateCaseId) ?? null;
};

export const runDuplicateCheck = async (candidate: CandidateProfile) => {
  const candidates = await listCandidates();
  const existingProfiles = candidates.filter((item) => item.id !== candidate.id);

  const bestMatch = existingProfiles
    .map((matchedCandidate) => {
      const { confidence, reasons } = buildDuplicateReasons(candidate, matchedCandidate);
      return {
        candidate: matchedCandidate,
        confidence,
        reasons,
      };
    })
    .filter((result) => result.confidence >= 60)
    .sort((left, right) => right.confidence - left.confidence)[0];

  if (!bestMatch) {
    await updateCandidateProfile(
      candidate.id,
      {
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
      },
      {
        status: "Profile Updated",
        duplicateStatus: "none",
        duplicateCaseId: "",
      },
    );

    return { matchFound: false as const, duplicateCase: null };
  }

  const now = new Date().toISOString();
  const duplicateCase: DuplicateCase = {
    id: `dup-${candidate.id}-${bestMatch.candidate.id}`,
    candidateId: candidate.id,
    matchedCandidateId: bestMatch.candidate.id,
    status: "pending",
    confidence: bestMatch.confidence,
    reasons: bestMatch.reasons,
    createdAt: now,
    updatedAt: now,
    candidateSnapshot: candidate,
    matchedCandidateSnapshot: bestMatch.candidate,
  };

  upsertDuplicateCaseLocally(duplicateCase);

  if (firestoreDb && isFirebaseConfigured) {
    try {
      await ensureFirebaseAuthReady();
      await setDoc(doc(firestoreDb, "duplicates", duplicateCase.id), duplicateCase, { merge: true });
    } catch (error) {
      console.warn("Duplicate case saved locally because Firestore write failed.", error);
    }
  }

  await updateCandidateProfile(
    candidate.id,
    {
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
    },
    {
      status: "Pending Review",
      duplicateStatus: "potential",
      duplicateCaseId: duplicateCase.id,
    },
  );

  return { matchFound: true as const, duplicateCase };
};

export const keepDuplicateSeparate = async (duplicateCaseId: string) => {
  const duplicateCase = await getDuplicateCaseById(duplicateCaseId);
  if (!duplicateCase) {
    return null;
  }

  const resolvedCase: DuplicateCase = {
    ...duplicateCase,
    status: "kept-separate",
    updatedAt: new Date().toISOString(),
  };

  upsertDuplicateCaseLocally(resolvedCase);

  if (firestoreDb && isFirebaseConfigured) {
    try {
      await ensureFirebaseAuthReady();
      await setDoc(doc(firestoreDb, "duplicates", resolvedCase.id), resolvedCase, { merge: true });
    } catch (error) {
      console.warn("Resolved duplicate case saved locally because Firestore write failed.", error);
    }
  }

  const candidate = await getCandidateById(resolvedCase.candidateId);
  if (candidate) {
    await updateCandidateProfile(
      candidate.id,
      {
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
      },
      {
        status: "Profile Updated",
        duplicateStatus: "resolved",
        duplicateCaseId: resolvedCase.id,
      },
    );
  }

  return resolvedCase;
};
