import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { API_BASE_URL } from "../../services/api";
import { signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole] = useState("candidate");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const getFriendlyErrorMessage = (err: any) => {
    const firebaseCode = err?.code;
    if (!firebaseCode) return null;

    switch (firebaseCode) {
      case "auth/invalid-credential":
        return "Sign in failed because the credentials are invalid. Please verify your email and password.";
      case "auth/user-not-found":
        return "No account was found with that email. Please sign up first.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again or reset your password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled. Contact support if you need help.";
      case "auth/too-many-requests":
        return "Too many sign-in attempts. Please wait and try again later.";
      default:
        return null;
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        setError("Unable to get email from Google account.");
        return;
      }

      // Google sign-in successful, redirect to candidate dashboard
      localStorage.setItem("userRole", "candidate");
      navigate("/candidate-dashboard");
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Google sign-in failed. Please try again or use email/password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedIn = () => {
    setError("LinkedIn sign-in is coming soon. Please use Google or email/password for now.");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Backend login first to ensure credentials and verification state are valid.
      const response = await axios.post(`${API_BASE_URL}/api/candidates/login`, {
        email,
        password,
        role: selectedRole,
      });

      if (response.data?.status === "success") {
        const rawRole = response.data?.role as string | undefined;
        const normalizedRole = rawRole
          ? rawRole.toString().trim().toLowerCase().replace(/\s+/g, "_")
          : "candidate";
        const role = ["admin", "recruiter", "hiring_manager"].includes(normalizedRole)
          ? normalizedRole
          : "candidate";

        localStorage.setItem("userRole", role);

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          setError("Please verify your email before signing in.");
          await signOut(auth);
          return;
        }

        if (role !== "candidate") {
          navigate("/dashboard");
          return;
        }

        navigate("/candidate-dashboard");
        return;
      }

      if (response.data?.status === "unverified") {
        navigate("/EmailVerification", { replace: true });
        return;
      }

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

      // If user exists but email not verified, guide to verification page
      const backendStatus = axiosErr?.response?.data?.status;
      if (backendStatus === "unverified") {
        navigate("/EmailVerification", { replace: true });
        return;
      }

      const firebaseFriendlyMessage = getFriendlyErrorMessage(err as any);
      setError(
        firebaseFriendlyMessage ||
          backendMessage ||
          networkHint ||
          axiosErr?.message ||
          "Invalid email or password. Please verify your email."
      );

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
          <p className="text-gray-500 text-sm mt-1">Welcome back to the Candidate Hub Portal</p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-lg" />
            Google
          </button>

          <button
            type="button"
            onClick={handleLinkedIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
          New to Candidate Hub?{" "}
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
