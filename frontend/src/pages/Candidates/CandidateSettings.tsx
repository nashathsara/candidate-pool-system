import React, { useState } from 'react';
import { FiUser, FiLock, FiEye, FiSettings, FiBriefcase } from 'react-icons/fi';

const CandidateSettings: React.FC = () => {
  const [profileVisibility, setProfileVisibility] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Top Navigation Bar Placeholder (Based on Figma Header) */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-slate-800">CandidateHub</span>
          <nav className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition">Browse Jobs</a>
            <a href="#" className="hover:text-blue-600 transition">Applications</a>
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Profile & Settings</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600"><FiSettings /></button>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">AJ</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-500 mt-2">Manage your visibility, security, and data preferences to keep your professional identity secure and impactful.</p>
        </div>

        {/* Edit Profile Section */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
              <FiUser className="text-slate-300 w-6 h-6" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input type="text" defaultValue="Alex Jordan" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input type="email" defaultValue="alex.jordan@candidate.pulse" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Bio</label>
              <textarea 
                rows={4} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
                defaultValue="Senior Product Designer with 8+ years of experience in building scalable design systems and user-centric web applications."
              />
            </div>

            <div className="flex justify-end">
              <button className="px-8 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                Update Profile
              </button>
            </div>
          </div>
        </section>

        {/* Change Password Section */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
              <FiLock className="text-slate-300 w-6 h-6" />
            </div>

            <div className="space-y-6 max-w-3xl">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                  <input type="password" placeholder="Min. 8 characters" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                  <input type="password" placeholder="Re-type new password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition" />
                </div>
              </div>

              <div className="flex justify-start">
                <button className="px-8 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Privacy Section */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-8">Account Privacy</h2>
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <FiEye className={profileVisibility ? "text-blue-600" : "text-slate-400"} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Profile Visibility</h4>
                  <p className="text-xs text-slate-500 mt-1">Control if your profile is searchable within the platform.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={profileVisibility} 
                  onChange={() => setProfileVisibility(!profileVisibility)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CandidateSettings;