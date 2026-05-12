import React from 'react';
import Sidebar from '../../components/admin/Sidebar';

const Settings: React.FC = () => {
  const inputBaseClass = "w-full p-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider";

  return (
    <div className="flex bg-[#FBFBFB] min-h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
            <p className="text-gray-500 mt-1">Manage your workspace configuration and security protocols.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 text-sm font-bold text-gray-500 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all">
              Discard Changes
            </button>
            <button className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition-all">
              Save Settings
            </button>
          </div>
        </div>

        <div className="max-w-4xl space-y-8">
          {/* Edit Profile Section */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg">Edit Profile</h3>
                <p className="text-sm text-gray-400">Update your administrative profile details and contact information.</p>
              </div>
              <span className="text-gray-300 text-xl">ℹ️</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" defaultValue="Jane Doe" className={inputBaseClass} />
              </div>
              <div>
                <label className={labelClass}>Administrative Role</label>
                <input type="text" defaultValue="Super Admin" className={inputBaseClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" defaultValue="jane.d@talentpulse.io" className={inputBaseClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="text" defaultValue="+1 (555) 0123-456" className={inputBaseClass} />
              </div>
            </div>
          </section>

          {/* Change Password Section */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg">Change Password</h3>
                <p className="text-sm text-gray-400">Update your account credentials.</p>
              </div>
              <span className="text-gray-300 text-xl">🔒</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Current Password</label>
                <input type="password" placeholder="••••••••" className={inputBaseClass} />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input type="password" placeholder="••••••••" className={inputBaseClass} />
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input type="password" placeholder="••••••••" className={inputBaseClass} />
              </div>
              
              <button className="w-full py-3 bg-[#E2E8F0] text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-all">
                Update Password
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;