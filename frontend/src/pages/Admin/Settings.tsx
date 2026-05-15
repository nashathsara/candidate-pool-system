import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Button from '../../common/Button/Button'; // Import your newly upgraded common button

const Settings: React.FC = () => {
  const inputBaseClass = "w-full p-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors duration-200";
  const labelClass = "block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider";

  // --- Profile States ---
  // Notice the key matches your Firestore key "full name" exactly
  const [fullName, setFullName] = useState<string>("Jane Doe");
  const [role, setRole] = useState<string>("Super Admin");
  const [email, setEmail] = useState<string>("jane.d@talentpulse.io");
  const [phone, setPhone] = useState<string>("+1 (555) 0123-456");
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // --- Password States ---
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  // --- Handlers ---
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: "dev_test_admin_999", // The test ID we generated in your database
          "full name": fullName,       // Matches your exact Firestore collection key
          role: role,
          email: email,
          phone: phone,
          bio: "Updated from the dynamic settings dashboard UI."
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully in real time!");
      } else {
        alert(`Error: ${data.error || "Failed to update profile"}`);
      }
    } catch (error) {
      console.error("Network error saving profile:", error);
      alert("Failed to connect to the backend server.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: "dev_test_admin_999",
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        // Clear fields out after a successful run
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(`Error: ${data.error || "Failed to update password"}`);
      }
    } catch (error) {
      console.error("Network error updating password:", error);
      alert("Failed to reach the backend security service.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDiscardChanges = () => {
    // Quick reset mechanism back to initial placeholders
    setFullName("Jane Doe");
    setRole("Super Admin");
    setEmail("jane.d@talentpulse.io");
    setPhone("+1 (555) 0123-456");
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#FBFBFB] min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-400 mt-1">Manage your workspace configuration and security protocols.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleDiscardChanges}
              className="px-5 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all"
            >
              Discard Changes
            </button>
            <Button 
              label="Save Settings"
              onClick={handleSaveSettings}
              variant="primary"
              isLoading={isSavingSettings}
            />
          </div>
        </div>

        <div className="max-w-5xl w-full mx-auto space-y-6">
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className={inputBaseClass} 
                />
              </div>
              <div>
                <label className={labelClass}>Administrative Role</label>
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className={inputBaseClass} 
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={inputBaseClass} 
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className={inputBaseClass} 
                />
              </div>
            </div>
          </section>

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
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputBaseClass} 
                />
              </div>
              <Button 
                label="Update Password"
                onClick={handleUpdatePassword}
                variant="primary"
                isLoading={isUpdatingPassword}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;