import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/candidates/login', {
        email,
        password
      });

      if (response.data.status === 'success') {
        navigate('/dashboard'); 
      }
    } catch (err: any) {
      if (err.response?.data?.status === 'unverified') {
        alert("Please verify your email first.");
        navigate('/email-verification');
      } else {
        setError(err.response?.data?.message || "Sign in failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 self-start ml-10">
        <h1 className="text-xl font-bold text-gray-800">CandidateHub</h1>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back to the TalentPulse Portal
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={handleGoogle}
            className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
          >
            <FcGoogle className="text-lg" /> Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
          >
            <FaLinkedin className="text-[#0A66C2] text-lg" /> LinkedIn
          </button>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Select Your Role</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('candidate')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                selectedRole === 'candidate'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('hr')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                selectedRole === 'hr'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              HR
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            or email
          </span>
        </div>

        {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

        <form className="space-y-5" onSubmit={handleSignIn}>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#"
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          New to TalentMatch? <span onClick={() => navigate('/signup')} className="font-bold text-gray-900 hover:underline cursor-pointer">Sign up</span>
        </p>
      </div>
      {/* Footer... */}
    </div>
  );
};

export default SignIn;
