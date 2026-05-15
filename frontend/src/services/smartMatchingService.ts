/**
 * Smart Matching Service
 * Compares candidate data (Name, DOB, Phone) against database for duplicates
 * Implements "Success State" logic for profile creation
 */

import { findDuplicatesOptimized } from "./duplicateDetection";

export interface SmartMatchResult {
  isDuplicate: boolean;
  confidenceScore: number;
  matchFields: {
    name: boolean;
    dob: boolean;
    phone: boolean;
  };
  existingCandidate: any | null;
  requiresReview: boolean;
  message: string;
  canProceedToSuccess: boolean;
}

/**
 * Parse and normalize DOB for comparison
 */
const normalizeDOB = (dob: string | Date): string => {
  const date = dob instanceof Date ? dob : new Date(dob);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

/**
 * Normalize phone number (remove all non-digits)
 */
const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

/**
 * Core smart matching logic
 * Compares Name, DOB, and Phone against database
 */
export const performSmartMatch = async (
  candidateData: {
    fullName: string;
    dateOfBirth?: string | Date;
    phone?: string;
    email?: string;
  }
): Promise<SmartMatchResult> => {
  try {
    const normalizedPhone = candidateData.phone
      ? normalizePhone(candidateData.phone)
      : "";
    const normalizedDOB = candidateData.dateOfBirth
      ? normalizeDOB(candidateData.dateOfBirth)
      : "";

    // Step 1: Check for exact/high-confidence duplicates using existing service
    const duplicateCheckResult = await findDuplicatesOptimized({
      fullName: candidateData.fullName,
      email: candidateData.email?.toLowerCase(),
      phone: normalizedPhone,
    });

    const matchFields = {
      name: false,
      dob: false,
      phone: false,
    };

    // Step 2: Extract match details
    if (duplicateCheckResult.isDuplicate) {
      const existing = duplicateCheckResult.existingCandidate as
        | { id: string; dateOfBirth?: string | Date }
        | null;
      matchFields.name = true;
      matchFields.phone = duplicateCheckResult.matchDetails?.phone || false;

      // Check DOB match if available
      if (existing?.dateOfBirth && normalizedDOB) {
        matchFields.dob =
          normalizeDOB(existing.dateOfBirth) === normalizedDOB;
      }

      // Calculate combined confidence score
      const scoreWeights = {
        name: 0.4,
        phone: 0.35,
        dob: 0.25,
      };

      const combinedScore =
        (matchFields.name ? scoreWeights.name * 100 : 0) +
        (matchFields.phone ? scoreWeights.phone * 100 : 0) +
        (matchFields.dob ? scoreWeights.dob * 100 : 0);

      return {
        isDuplicate: true,
        confidenceScore: Math.round(combinedScore),
        matchFields,
        existingCandidate: existing,
        requiresReview: combinedScore >= 70,
        message: generateMatchMessage(matchFields, combinedScore),
        canProceedToSuccess: false, // Block on high-confidence duplicates
      };
    }

    // Step 3: Check for potential matches requiring review
    if (duplicateCheckResult.requiresReview) {
      return {
        isDuplicate: false,
        confidenceScore: duplicateCheckResult.confidenceScore,
        matchFields,
        existingCandidate: duplicateCheckResult.potentialMatch || null,
        requiresReview: true,
        message: `Potential duplicate detected (${duplicateCheckResult.confidenceScore}% match). Manual review recommended.`,
        canProceedToSuccess: false,
      };
    }

    // Step 4: No duplicate found - safe to proceed
    return {
      isDuplicate: false,
      confidenceScore: 0,
      matchFields,
      existingCandidate: null,
      requiresReview: false,
      message: "✅ No duplicates found. Profile is unique.",
      canProceedToSuccess: true,
    };
  } catch (error) {
    console.error("Smart matching error:", error);
    throw error;
  }
};

/**
 * Generate human-readable match message
 */
const generateMatchMessage = (
  matchFields: { name: boolean; dob: boolean; phone: boolean },
  score: number
): string => {
  const matched = [];
  if (matchFields.name) matched.push("Name");
  if (matchFields.phone) matched.push("Phone");
  if (matchFields.dob) matched.push("DOB");

  if (score >= 90) {
    return `⚠️ High confidence duplicate: ${matched.join(", ")} match (${score}%)`;
  } else if (score >= 70) {
    return `🔍 Likely duplicate: ${matched.join(", ")} match detected (${score}%)`;
  } else if (score >= 50) {
    return `❓ Potential duplicate: ${matched.join(", ")} match - review recommended (${score}%)`;
  }

  return "No high-confidence matches found.";
};

/**
 * Validate candidate data for smart matching
 */
export const validateCandidateForMatching = (candidateData: any): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!candidateData.fullName || candidateData.fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }

  if (
    candidateData.phone &&
    normalizePhone(candidateData.phone).length < 7
  ) {
    errors.push("Phone number must be at least 7 digits");
  }

  if (candidateData.dateOfBirth) {
    const dob = new Date(candidateData.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.push("Invalid date of birth format");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format smart match result for UI display
 */
export const formatSmartMatchResult = (
  result: SmartMatchResult
): {
  statusBadge: string;
  statusColor: "success" | "warning" | "error" | "info";
  actionText: string;
  canProceed: boolean;
} => {
  if (result.isDuplicate) {
    return {
      statusBadge: `DUPLICATE (${result.confidenceScore}%)`,
      statusColor: "error",
      actionText: "This profile appears to be a duplicate. Please review.",
      canProceed: false,
    };
  }

  if (result.requiresReview) {
    return {
      statusBadge: `REVIEW NEEDED (${result.confidenceScore}%)`,
      statusColor: "warning",
      actionText: "Potential duplicate found. Manual review recommended.",
      canProceed: false,
    };
  }

  return {
    statusBadge: "UNIQUE PROFILE",
    statusColor: "success",
    actionText: "✅ Profile is unique. Ready to proceed.",
    canProceed: true,
  };
};
