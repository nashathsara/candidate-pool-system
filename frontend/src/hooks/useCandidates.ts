import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { CandidateRecord } from "../utils/candidateTypes";
import {
  CANDIDATES_STORAGE_KEY,
  SEED_CANDIDATES,
} from "../utils/candidateSeed";

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

  const totalDisplay = useMemo(
    () => candidates.length.toLocaleString(),
    [candidates.length]
  );

  return { candidates, addCandidate, getById, totalDisplay };
}
