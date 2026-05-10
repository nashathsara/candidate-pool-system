import React from 'react';
import { FiAlertTriangle, FiUser, FiArrowRight, FiRotateCcw, FiPlusCircle, FiMessageCircle } from 'react-icons/fi';

const DuplicationView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Header Progress */}
        <div className="flex justify-between items-center mb-12 px-4">
           {/* Steps logic based on your Figma design */}
           {['Account Setup', 'Verification', 'Duplicate Check', 'Profile Completion'].map((step, i) => (
             <div key={i} className="flex flex-col items-center gap-2">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i < 2 ? 'bg-blue-600' : i === 2 ? 'bg-blue-600 animate-pulse' : 'bg-gray-700'}`}>
                 {i < 2 ? '✓' : i + 1}
               </div>
               <span className="text-[10px] uppercase tracking-wider text-gray-400">{step}</span>
             </div>
           ))}
        </div>

        {/* Warning Alert */}
        <div className="bg-orange-900/30 border border-orange-500/50 rounded-xl p-6 mb-8 flex gap-4 items-start">
          <FiAlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          <div>
            <h2 className="text-orange-500 font-bold text-lg">Potential Duplicate Profile Detected</h2>
            <p className="text-gray-300 text-sm">We found a profile that may already belong to you. Please review the details below to confirm.</p>
          </div>
        </div>

        {/* Match Confidence */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
           <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
             <FiAlertTriangle className="w-4 h-4" /> Match Confidence based on submitted information
           </div>
           <div className="flex items-end gap-3">
             <span className="text-4xl font-bold text-blue-500">82%</span>
             <span className="text-gray-500 pb-1 italic">Similarity Score</span>
           </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Submitted Profile */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-gray-400 text-xs uppercase mb-4">Submitted Profile</h3>
            <div className="space-y-4">
              <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium">Sarah Mitchell</p></div>
              <div><p className="text-xs text-gray-500">Phone Number</p><p className="font-medium text-green-500">+1 (555) 234-5678 <span className="text-[10px] ml-2">Match</span></p></div>
              <div><p className="text-xs text-gray-500">Date of Birth</p><p className="font-medium text-green-500">March 15, 1992 <span className="text-[10px] ml-2">Match</span></p></div>
            </div>
          </div>

          {/* Existing Profile */}
          <div className="bg-blue-900/10 border border-blue-500/30 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded">Existing Profile</div>
            <h3 className="text-gray-400 text-xs uppercase mb-4 italic">Created 8 months ago</h3>
            <div className="space-y-4">
              <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium">Sarah Mitchell</p></div>
              <div><p className="text-xs text-gray-500">Phone Number</p><p className="font-medium">+1 (555) ****-5678</p></div>
              <div><p className="text-xs text-gray-500">Email Address</p><p className="font-medium">s*******@email.com</p></div>
            </div>
          </div>
        </div>

        {/* Decision Actions */}
        <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700 text-center">
          <h3 className="text-lg font-semibold mb-2">What would you like to do?</h3>
          <p className="text-gray-400 text-sm mb-8">Choose an option below to proceed with your onboarding</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl transition">
              <FiRotateCcw /> Recover Existing Profile
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl transition">
              <FiPlusCircle /> Create New Profile
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl transition">
              <FiMessageCircle /> Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicationView;