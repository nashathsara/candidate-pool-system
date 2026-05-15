/**
 * RBAC-Aware Admin Dashboard Wrapper
 * Filters candidate data and dashboard features based on user role
 */
import React from "react";
import AdminDashboard from "./AdminDashboard";
import { useRBAC } from "../../../contexts/RBACContext";
import type { CandidateRecord } from "../../../utils/candidateTypes";

interface AdminDashboardWrapperProps {
  pipelineCandidates: CandidateRecord[];
}

const AdminDashboardWrapper: React.FC<AdminDashboardWrapperProps> = ({
  pipelineCandidates,
}) => {
  const { role, permissions } = useRBAC();

  // Filter candidates based on role
  const getFilteredCandidates = (): CandidateRecord[] => {
    if (!permissions.canViewCandidates) {
      return [];
    }

    // Admins and recruiters can see all candidates
    if (role === "admin" || role === "recruiter") {
      return pipelineCandidates;
    }

    // Hiring managers can only see candidates assigned to their department
    if (role === "hiring_manager") {
      return pipelineCandidates.filter(
        (candidate) =>
          candidate.role.includes("Engineer") ||
          candidate.role.includes("Product")
      );
    }

    return [];
  };

  // Build restricted dashboard props
  const dashboardProps = {
    pipelineCandidates: getFilteredCandidates(),
    roleBasedFeatures: {
      canViewDuplicates: permissions.canViewDuplicates,
      canMergeDuplicates: permissions.canMergeDuplicates,
      canManageInterviews: permissions.canManageInterviews,
      canViewReports: permissions.canViewReports,
      canManageTeam: permissions.canManageTeam,
    },
    userRole: role,
  };

  // Render access denied for candidates
  if (role === "candidate") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            Candidates do not have access to the admin dashboard. Please log in
            with an admin or recruiter account.
          </p>
          <a
            href="/candidate-dashboard"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Go to Candidate Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <AdminDashboard {...dashboardProps} />;
};

export default AdminDashboardWrapper;
