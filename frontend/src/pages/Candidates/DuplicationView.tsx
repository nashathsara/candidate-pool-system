import React from 'react';
import { FiMail, FiPhone, FiUser, FiInfo, FiClock, FiCheckCircle } from 'react-icons/fi';

const DuplicateCandidateReview: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-[8px]">T</span>
            </div>
            Ticket #86291-D
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Duplicate Candidate Review</h1>
          <p className="text-xs text-slate-400 mt-1">Created on October 24, 2024 at 10:45 AM</p>
        </div>

        {/* Confidence Match Banner */}
        <div className="mx-8 mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
          <div className="flex items-center gap-2 text-slate-700 font-bold mb-4">
            <FiInfo className="text-blue-500" />
            <span className="text-sm">High Confidence Match (94%)</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <MatchBadge icon={<FiMail />} label="Email Match" value="anne@gmail.com" />
            <MatchBadge icon={<FiPhone />} label="Phone Match" value="0745637829" />
            <MatchBadge icon={<FiUser />} label="Name Match" value="Anne Piyula" />
          </div>
        </div>

        {/* Comparison Section */}
        <div className="p-8 grid grid-cols-2 gap-8">
          {/* New Applicant */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">New Applicant</span>
              <span className="text-[10px] text-slate-400">Applied 2h ago</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">Anne Piyula Arulpirabakar</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Application Role</p>
              <p className="text-sm font-semibold text-slate-700">Senior Systems Architect</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Recent Activity</p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center">
                  <span className="text-[8px]">📄</span>
                </div>
                Submitted Resume
              </div>
            </div>
          </div>

          {/* Existing Profile */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Existing Profile</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">ID: CH-9932</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">A.P. Arulpirabakar</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Current Status</p>
              <p className="text-sm font-semibold text-slate-700">Hired (2022)</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Recent Activity</p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center">
                  <span className="text-[8px]">💼</span>
                </div>
                Promoted to Lead Architect (Jan 2024)
              </div>
            </div>
          </div>
        </div>

        {/* Action History */}
        <div className="mx-8 p-6 border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Action History</p>
          <div className="space-y-4">
            <HistoryItem 
              icon={<FiInfo className="text-blue-500" />} 
              title="System Flagged Duplicate" 
              time="Oct 24, 10:45 AM • Confidence: 94%" 
            />
            <HistoryItem 
              icon={<FiCheckCircle className="text-slate-400" />} 
              title="Anne Piyula viewed Ticket" 
              time="Oct 24, 11:12 AM" 
            />
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-8 p-10 bg-[#4ADE80] flex justify-center gap-6">
          <button className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition">Merge Profiles</button>
          <button className="px-8 py-2.5 bg-slate-900/10 text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-900/20 transition">Request Info</button>
          <button className="px-8 py-2.5 bg-slate-900/10 text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-900/20 transition">Keep Separate</button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const MatchBadge = ({ icon, label, value }: any) => (
  <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center gap-3">
    <div className="text-blue-500">{icon}</div>
    <div>
      <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">{label}</p>
      <p className="text-[10px] font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const HistoryItem = ({ icon, title, time }: any) => (
  <div className="flex gap-3">
    <div className="w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center text-xs border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-700">{title}</p>
      <p className="text-[10px] text-slate-400">{time}</p>
    </div>
  </div>
);

export default DuplicateCandidateReview;
