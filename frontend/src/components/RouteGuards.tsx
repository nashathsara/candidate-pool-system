/**
 * RBAC-aware Route Guards
 * Protects routes based on user roles and permissions
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRBAC } from "../contexts/RBACContext";
import type { UserRole } from "../contexts/RBACContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: keyof import("../contexts/RBACContext").UserPermissions;
  fallbackPath?: string;
}

/**
 * Generic Auth Guard - requires user to be signed in
 */
export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isSignedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
};

/**
 * Admin Role Guard - requires admin role
 */
export const RequireAdminRole: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { role, loading } = useRBAC();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          from: location,
          error: "You do not have permission to access this page.",
        }}
      />
    );
  }

  return children;
};

/**
 * Recruiter/Admin Guard
 */
export const RequireRecruiterOrAdmin: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { role, loading } = useRBAC();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!role || (role !== "admin" && role !== "recruiter")) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          from: location,
          error: "You do not have permission to access this page.",
        }}
      />
    );
  }

  return children;
};

/**
 * Permission-based Guard
 */
export const RequirePermission: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallbackPath = "/dashboard",
}) => {
  const { permissions, loading } = useRBAC();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (
    requiredPermission &&
    !permissions[requiredPermission as keyof typeof permissions]
  ) {
    return (
      <Navigate
        to={fallbackPath}
        replace
        state={{
          from: location,
          error: "You do not have permission to access this page.",
        }}
      />
    );
  }

  return children;
};

/**
 * Multi-role Guard
 */
export const RequireRole: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = [],
  fallbackPath = "/dashboard",
}) => {
  const { role, loading } = useRBAC();
  const location = useLocation();

  const rolesArray = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!role || !rolesArray.includes(role)) {
    return (
      <Navigate
        to={fallbackPath}
        replace
        state={{
          from: location,
          error: "You do not have permission to access this page.",
        }}
      />
    );
  }

  return children;
};

/**
 * Error boundary for permission issues
 */
export const AccessDenied: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
        <span className="text-3xl">🔒</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-8">
        You don't have permission to access this page. If you believe this is an
        error, please contact your administrator.
      </p>
      <a
        href="/dashboard"
        className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
      >
        Return to Dashboard
      </a>
    </div>
  </div>
);
