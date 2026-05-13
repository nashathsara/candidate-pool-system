import React from 'react';
import Sidebar from '../../components/admin/Sidebar';

const Settings: React.FC = () => {
  const inputBaseClass = "w-full p-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all";
  const labelClass = "block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider";

  return (
    <div className="flex bg-[#FBFBFB] min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-400 mt-1">Manage your workspace configuration and security protocols.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
              Discard Changes
            </button>
            <button className="px-5 py-2 text-xs font-bold text-white bg-black rounded-lg hover:bg-gray-800">
              Save Settings
            </button>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Section 1: Edit Profile - Added border-gray-200 for the light outline */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-base">Edit Profile</h3>
                <p className="text-xs text-gray-400">Update your administrative profile details and contact information.</p>
              </div>
              <span className="text-black-400 text-lg grayscale">ⓘ</span>
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

          {/* Section 2: Change Password - Added border-gray-200 for the light outline */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-base">Change Password</h3>
                <p className="text-xs text-gray-400">Update your account credentials.</p>
              </div>
              <span className="text-gray-400 text-lg grayscale">🔒</span>
            </div>

            <div className="space-y-5">
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
              <button className="w-full py-2.5 bg-gray-100 text-gray-500 text-sm font-bold rounded-lg hover:bg-gray-200 transition-all">
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