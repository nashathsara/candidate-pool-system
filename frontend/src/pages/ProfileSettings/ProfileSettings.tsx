import { useState } from "react";
import CandidatePublicLayout from "../../layouts/CandidatePublicLayout";

const ProfileSettings = () => {
  const [visible, setVisible] = useState(true);

  return (
    <CandidatePublicLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Manage your visibility, security, and data preferences to keep your professional
          identity secure and impactful.
        </p>

        <div className="space-y-6 max-w-2xl">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Alex Jordan"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="alex.jordan@candidate.pulse"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio</label>
                <textarea
                  rows={4}
                  defaultValue="Senior Product Designer with 8+ years of experience in building scalable design systems and user-centric web applications."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[120px]"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button type="button" className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition">
                Update Profile
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="password"
                placeholder="Re-type new password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex justify-center mt-6">
              <button type="button" className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition">
                Update Password
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Account Privacy</h2>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-semibold text-gray-900">Profile Visibility</p>
                <p className="text-sm text-gray-500 mt-1">
                  Control if your profile is searchable within the platform.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={visible}
                onClick={() => setVisible((v) => !v)}
                className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${
                  visible ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                    visible ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>
        </div>
      </div>
    </CandidatePublicLayout>
  );
};

export default ProfileSettings;
