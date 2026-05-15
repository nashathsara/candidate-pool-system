import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../services/api";

const AdminSetup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">();

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/candidates/set-role`, {
        email: email.trim(),
        userRole,
      });

      if (response.data?.status === "success") {
        setMessageType("success");
        setMessage(response.data?.message || `Role set to ${userRole}`);
        setEmail("");
        setUserRole("admin");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setMessageType("error");
      setMessage(
        axiosErr?.response?.data?.message ||
          axiosErr?.message ||
          "Failed to set user role. Make sure the email exists in the system."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
        <p className="text-gray-600 text-sm mb-8">
          Assign admin roles to user accounts. Users must already be registered in the system.
        </p>

        <form onSubmit={handleSetRole} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              User Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
            />
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Role
            </label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
            >
              <option value="admin">Admin</option>
              <option value="recruiter">Recruiter</option>
              <option value="hiring_manager">Hiring Manager</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm text-center font-medium ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? "Setting Role..." : "Set User Role"}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          After setting a role, ask the user to sign out and sign in again to see admin access.
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;
