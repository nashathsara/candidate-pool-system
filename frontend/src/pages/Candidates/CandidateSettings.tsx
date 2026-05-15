import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../config/firebase";
import axios from "axios";
import { API_BASE_URL } from "../../services/api";
import { 
  onAuthStateChanged, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from "firebase/auth";
import { FiUser, FiLock, FiSettings, FiLoader, FiCheckCircle, FiShield } from 'react-icons/fi';

const CandidateSettings: React.FC = () => {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    bio: "",
    docId: "", 
  });

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      console.log("Logged in as:", user.email);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/candidates/profile/${user.email}`);
        if (response.data.status === "success") {
          const data = response.data.data;
          setUserData({
            fullName: data.fullName || "",
            email: user.email, 
            bio: data.bio || "",
            docId: data.docId, 
          });
          setProfileVisibility(data.isVisible !== false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // දත්ත ලෝඩ් නොවෙන්න පුළුවන්, හැබැයි ඊමේල් එක හරි පෙන්වනවා
        setUserData(prev => ({ ...prev, email: user.email! }));
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No user session found.");
      setLoading(false);
    }
  });
  return () => unsubscribe();
}, []);

// 2. handleUpdateProfile එක (Saving Data)
const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // වැදගත්ම දේ: State එකේ නැත්නම් කෙලින්ම auth එකෙන් ගන්නවා
  const userEmail = userData.email || auth.currentUser?.email;

  if (!userEmail) {
    setMessage({ type: "error", text: "User session not found. Please log in again." });
    return;
  }

  setIsUpdating(true);
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/candidates/profile/update/${userEmail}`, 
      {
        fullName: userData.fullName,
        bio: userData.bio,
        isVisible: profileVisibility,
      }
    );

    if (response.data.status === "success") {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
  } catch (error) {
    setMessage({ type: "error", text: "Something went wrong. Please try again." });
  } finally {
    setIsUpdating(false);
  }
};

  // 3. Password Update කිරීම
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const credential = EmailAuthProvider.credential(user.email!, passwords.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.new);
      
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      console.error(error);
      setMessage({ type: "error", text: "Current password incorrect or update failed." });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <FiLoader className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Syncing your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-slate-900 tracking-tight">CandidateHub</span>
          <nav className="hidden md:flex gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/browse" className="hover:text-slate-900 transition">Browse Jobs</Link>
            <Link to="/applications" className="hover:text-slate-900 transition">Applications</Link>
            <Link to="/candidate-dashboard" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Profile</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/settings" className="p-2 text-slate-400 hover:text-slate-900 transition-colors text-xl" aria-label="Settings"><FiSettings /></Link>
          <Link to="/candidate-dashboard" className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-indigo-200 shadow-lg">
            {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your professional identity and data preferences securely.</p>
          
          {message.text && (
            <div className={`mt-8 p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 duration-500 ${
              message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
            }`}>
              <FiCheckCircle className="shrink-0 text-lg" />
              <p className="text-sm font-bold">{message.text}</p>
            </div>
          )}
        </div>

        {/* Section 1: Edit Profile */}
        <section className="bg-white rounded-[32px] border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <form onSubmit={handleUpdateProfile} className="p-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 border border-slate-100"><FiUser className="text-xl"/></div>
                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
                <input 
                  type="text" 
                  value={userData.fullName}
                  onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition font-bold text-slate-800" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</label>
                <input 
                  type="email" 
                  value={userData.email} 
                  disabled
                  className="w-full px-5 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed font-bold" 
                />
              </div>
            </div>

            <div className="space-y-2 mb-10">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Professional Bio</label>
              <textarea 
                rows={4} 
                value={userData.bio}
                onChange={(e) => setUserData({...userData, bio: e.target.value})}
                placeholder="Share a bit about your professional journey..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition resize-none font-medium text-slate-700"
              />
            </div>

            <div className="flex justify-end border-t border-slate-50 pt-8">
              <button 
                type="submit"
                disabled={isUpdating}
                className="px-12 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 disabled:opacity-50"
              >
                {isUpdating ? <FiLoader className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Section 2: Security */}
        <section className="bg-white rounded-[32px] border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <form onSubmit={handlePasswordChange} className="p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 border border-slate-100"><FiLock className="text-xl"/></div>
              <h2 className="text-xl font-bold text-slate-900">Security & Password</h2>
            </div>

            <div className="space-y-8 max-w-2xl">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition font-bold" 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    placeholder="Min. 8 chars" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confirm New</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="Confirm" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition font-bold" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUpdating}
                className="px-10 py-4 bg-white border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </section>

        {/* Section 3: Privacy */}
        <section className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="p-10">
            <h2 className="text-xl font-bold text-slate-800 mb-8">Account Privacy</h2>
            <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[24px] border border-slate-100">
              <div className="flex items-start gap-5">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-2xl text-indigo-600">
                  <FiShield />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Profile Visibility</h4>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Control if your profile is searchable by recruitment teams.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={profileVisibility} 
                  onChange={() => setProfileVisibility(!profileVisibility)} 
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CandidateSettings;
