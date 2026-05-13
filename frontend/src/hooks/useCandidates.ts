import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { CandidateRecord, VerificationStatus } from "../utils/candidateTypes";
import {
  CANDIDATES_STORAGE_KEY,
  SEED_CANDIDATES,
} from "../utils/candidateSeed";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

let cache: CandidateRecord[] = [...SEED_CANDIDATES];
let hydrated = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CandidateRecord[];
      if (Array.isArray(parsed) && parsed.length) {
        cache = parsed;
      }
    }
  } catch {
    /* keep seed */
  }
  hydrated = true;
}

function persist(next: CandidateRecord[]) {
  cache = next;
  try {
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emit();
}

async function syncCandidatePatch(
  id: string,
  patch: Partial<CandidateRecord>
) {
  try {
    await fetch(`${API_BASE_URL}/candidates/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: patch.status,
        verificationStatus: patch.verificationStatus,
        lastActiveLabel: patch.lastActiveLabel,
      }),
    });
  } catch (error) {
    console.warn("Candidate update saved locally only.", error);
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): CandidateRecord[] {
  ensureHydrated();
  return cache;
}

/** Local + seed store for demo UI (replace with API later). */
export function useCandidates() {
  const candidates = useSyncExternalStore(subscribe, getSnapshot, () => [
    ...SEED_CANDIDATES,
  ]);

  const addCandidate = useCallback((draft: Omit<CandidateRecord, "id">) => {
    ensureHydrated();
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    const next: CandidateRecord = { ...draft, id };
    const current = getSnapshot();
    persist([next, ...current]);
    return id;
  }, []);

  const getById = useCallback(
    (id: string) => candidates.find((c) => c.id === id),
    [candidates]
  );

  const updateCandidate = useCallback(
    (id: string, patch: Partial<CandidateRecord>) => {
      ensureHydrated();
      const current = getSnapshot();
      const next = current.map((candidate) =>
        candidate.id === id ? { ...candidate, ...patch } : candidate
      );
      persist(next);
      void syncCandidatePatch(id, patch);
    },
    []
  );

  const updateCandidateStatus = useCallback(
    (id: string, verificationStatus: VerificationStatus) => {
      const statusTone =
        verificationStatus === "Viewed by Admin" ||
        verificationStatus === "Profile Submitted"
          ? "blue"
          : verificationStatus === "Withdrawn"
            ? "red"
            : "gray";

      updateCandidate(id, {
        status: verificationStatus,
        verificationStatus,
        statusTone,
        lastActiveLabel: "Just now",
      });
    },
    [updateCandidate]
  );

  const totalDisplay = useMemo(
    () => candidates.length.toLocaleString(),
    [candidates.length]
  );

  return {
    candidates,
    addCandidate,
    getById,
    totalDisplay,
    updateCandidate,
    updateCandidateStatus,
  };
}
