/**
 * RBAC Context for Role-Based Access Control
 * Extends Firebase Auth with role information and permissions
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "./AuthContext";

export type UserRole = "admin" | "recruiter" | "hiring_manager" | "candidate";

export interface UserPermissions {
  canViewDashboard: boolean;
  canViewCandidates: boolean;
  canViewDuplicates: boolean;
  canMergeDuplicates: boolean;
  canManageInterviews: boolean;
  canViewReports: boolean;
  canManageTeam: boolean;
}

export interface RBACUser {
  user: User | null;
  role: UserRole | null;
  permissions: UserPermissions;
  loading: boolean;
  isSignedIn: boolean;
}

const RBACContext = createContext<RBACUser | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canViewDashboard: true,
    canViewCandidates: true,
    canViewDuplicates: true,
    canMergeDuplicates: true,
    canManageInterviews: true,
    canViewReports: true,
    canManageTeam: true,
  },
  recruiter: {
    canViewDashboard: true,
    canViewCandidates: true,
    canViewDuplicates: true,
    canMergeDuplicates: true,
    canManageInterviews: true,
    canViewReports: true,
    canManageTeam: false,
  },
  hiring_manager: {
    canViewDashboard: true,
    canViewCandidates: true,
    canViewDuplicates: false,
    canMergeDuplicates: false,
    canManageInterviews: true,
    canViewReports: true,
    canManageTeam: false,
  },
  candidate: {
    canViewDashboard: false,
    canViewCandidates: false,
    canViewDuplicates: false,
    canMergeDuplicates: false,
    canManageInterviews: false,
    canViewReports: false,
    canManageTeam: false,
  },
};

const normalizeRole = (value: string | null): UserRole => {
  if (!value) {
    return "candidate";
  }

  const normalized = value.toString().trim().toLowerCase().replace(/[\s-]+/g, "_");

  if (normalized === "admin") return "admin";
  if (normalized === "recruiter") return "recruiter";
  if (normalized === "hiring_manager" || normalized === "hiringmanager") return "hiring_manager";

  return "candidate";
};

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [rbacUser, setRbacUser] = useState<RBACUser>({
    user: null,
    role: null,
    permissions: ROLE_PERMISSIONS.candidate,
    loading: true,
    isSignedIn: false,
  });

  useEffect(() => {
    if (authLoading) return;

    const storedRole = localStorage.getItem("userRole");
    const role = normalizeRole(storedRole);

    setRbacUser({
      user: currentUser,
      role,
      permissions: ROLE_PERMISSIONS[role],
      loading: false,
      isSignedIn: !!currentUser,
    });
  }, [authLoading, currentUser]);

  return (
    <RBACContext.Provider value={rbacUser}>{children}</RBACContext.Provider>
  );
};

export const useRBAC = (): RBACUser => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC must be used within RBACProvider");
  }
  return context;
};

export const usePermission = (permission: keyof UserPermissions): boolean => {
  const { permissions } = useRBAC();
  return permissions[permission];
};
