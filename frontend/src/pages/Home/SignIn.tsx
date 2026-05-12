import React, { useState } from 'react';
import { FiMail, FiLock, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      {/* Header Logo */}
      <div className="mb-8 self-start ml-10">
        <h1 className="text-xl font-bold text-gray-800">CandidateHub</h1>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">Welcome back to the TalentPulse Portal</p>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            <FcGoogle className="text-lg" /> Google
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            <FaLinkedin className="text-[#0A66C2] text-lg" /> LinkedIn
          </button>
        </div>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">or email</span>
        </div>

        {/* Email Login Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <a href="#" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="remember" className="text-xs text-gray-600 font-medium cursor-pointer">Remember me</label>
          </div>

          <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition shadow-lg shadow-gray-200 mt-2">
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          New to TalentMatch? <a href="#" className="font-bold text-gray-900 hover:underline">Sign up</a>
        </p>
      </div>

      {/* Footer Links */}
      <footer className="mt-20 text-center">
        <p className="text-[10px] text-gray-400 mb-4">© 2024 WHS System. All rights reserved.</p>
        <div className="flex gap-6 text-[10px] font-bold text-gray-400">
          <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
          <a href="#" className="hover:text-gray-600 transition">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default SignIn;