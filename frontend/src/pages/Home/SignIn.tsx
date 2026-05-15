import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { API_BASE_URL } from "../../services/api";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole] = useState("candidate");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogle = () => {
    // TODO: implement Google OAuth
    console.log("Google Sign In Clicked");
  };

  const handleLinkedIn = () => {
    // TODO: implement LinkedIn OAuth
    console.log("LinkedIn Sign In Clicked");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Firebase local sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before signing in.");
        await signOut(auth);
        return;
      }

      // Backend login (server-side checks)
      const response = await axios.post(`${API_BASE_URL}/api/candidates/login`, {
        email,
        password,
        role: selectedRole,
      });

      if (response.data?.status === "success") {
        navigate("/settings");
        return;
      }

      await signOut(auth);
      setError(response.data?.message || "Unable to sign in.");
    } catch (err: unknown) {
      console.error("Sign in failed:", err);

      // Axios error shape
      const axiosErr = err as { response?: { data?: { message?: string; status?: string } }; message?: string };

      const backendMessage = axiosErr?.response?.data?.message;
      const networkHint =
        axiosErr?.message === "Network Error"
          ? `Unable to reach backend at ${API_BASE_URL}. Make sure the server is running.`
          : null;

      // Keep your existing behavior idea: show verification prompt if backend indicates unverified
      const backendStatus = axiosErr?.response?.data?.status;
      if (backendStatus === "unverified") {
        alert("Please verify your email first.");
        navigate("/EmailVerification");
        return;
      }

      setError(backendMessage || networkHint || axiosErr?.message || "Invalid email or password. Please verify your email.");

      try {
        await signOut(auth);
      } catch {
        // ignore sign out errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      {/* Logo */}
      <div className="mb-8 self-start ml-10">
        <h1 className="text-xl font-bold text-gray-800">CandidateHub</h1>
      </div>

      {/* Card */}
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">Welcome back to the TalentPulse Portal</p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={handleGoogle}
            className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
          >
            <FcGoogle className="text-lg" />
            Google
          </button>

          <button
            type="button"
            onClick={handleLinkedIn}
            className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
          >
            <FaLinkedin className="text-[#0A66C2] text-lg" />
            LinkedIn
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <span className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">or email</span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSignIn}>
          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Password
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-xs text-gray-500 mt-8">
          New to TalentMatch?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="font-bold text-gray-900 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
