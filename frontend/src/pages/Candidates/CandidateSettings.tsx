import React from 'react';
import { FiUser, FiLock } from 'react-icons/fi';

const CandidateSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Consistent with CandidateHub Style */}
      {/* <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white font-bold text-xl">CH</div>
          <span className="font-bold text-gray-800 text-lg">CandidateHub</span>
        </div>
        <nav className="space-y-1">
          {[
            { icon: FiGrid, label: 'Dashboard' },
            { icon: FiUsers, label: 'Candidates' },
            { icon: FiCopy, label: 'Duplicates' },
            { icon: FiSettings, label: 'Settings', active: true },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-500 mt-1">Manage your workspace configuration and security protocols.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Discard Changes</button>
            <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 transition">Save Settings</button>
          </div>
        </div>

        {/* Edit Profile Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
              <p className="text-sm text-gray-500">Update your administrative profile details and contact information.</p>
            </div>
            <FiUser className="text-gray-300 w-6 h-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input type="text" defaultValue="Jane Doe" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Administrative Role</label>
              <input type="text" readOnly value="Super Admin" className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input type="email" defaultValue="jane.d@talentpulse.io" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input type="text" defaultValue="+1 (555) 0123-456" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
          </div>
        </section>

        {/* Change Password Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
              <FiLock className="text-gray-300 w-6 h-6" />
           </div>
           <div className="space-y-4 max-w-2xl">
              <input type="password" placeholder="Current Password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <button className="mt-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">Update Password</button>
           </div>
        </section>
      </main>
    </div>
  );
};

export default CandidateSettings;
