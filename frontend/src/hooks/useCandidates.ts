import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCandidateById as getFirebaseCandidateById,
  getCandidates,
  readCachedCandidates,
  updateCandidate as updateFirebaseCandidate,
  updateCandidateStatus as updateFirebaseCandidateStatus,
} from "../services/firebaseAdminService";
import type { CandidateRecord, VerificationStatus } from "../utils/candidateTypes";

export function useCandidates() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reloadCandidates = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const firebaseCandidates = await getCandidates();
      setCandidates(firebaseCandidates);
    } catch (loadError) {
      const cachedCandidates = readCachedCandidates();
      setCandidates(cachedCandidates);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load candidates from Firebase.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadCandidates();
  }, [reloadCandidates]);

  const getById = useCallback(
    (id: string) => candidates.find((candidate) => candidate.id === id),
    [candidates],
  );

  const fetchById = useCallback(async (id: string) => {
    setError("");
    const candidate = await getFirebaseCandidateById(id);
    if (candidate) {
      setCandidates((currentCandidates) => {
        const exists = currentCandidates.some((item) => item.id === candidate.id);
        return exists
          ? currentCandidates.map((item) => (item.id === candidate.id ? candidate : item))
          : [candidate, ...currentCandidates];
      });
    }
    return candidate;
  }, []);

  const updateCandidate = useCallback(async (id: string, patch: Partial<CandidateRecord>) => {
    setError("");
    const updatedCandidate = await updateFirebaseCandidate(id, patch);
    if (updatedCandidate) {
      setCandidates((currentCandidates) =>
        currentCandidates.map((candidate) =>
          candidate.id === id ? updatedCandidate : candidate,
        ),
      );
    }
    return updatedCandidate;
  }, []);

  const updateCandidateStatus = useCallback(
    async (id: string, verificationStatus: VerificationStatus) => {
      setError("");
      const updatedCandidate = await updateFirebaseCandidateStatus(id, verificationStatus);
      if (updatedCandidate) {
        setCandidates((currentCandidates) =>
          currentCandidates.map((candidate) =>
            candidate.id === id ? updatedCandidate : candidate,
          ),
        );
      }
      return updatedCandidate;
    },
    [],
  );

  const totalDisplay = useMemo(
    () => candidates.length.toLocaleString(),
    [candidates.length],
  );

  return {
    candidates,
    error,
    fetchById,
    getById,
    isLoading,
    reloadCandidates,
    totalDisplay,
    updateCandidate,
    updateCandidateStatus,
  };
}
