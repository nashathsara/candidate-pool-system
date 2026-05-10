import React from 'react';
import { FiLayers, FiSearch, FiAlertCircle, FiCheck, FiX, FiRefreshCcw } from 'react-icons/fi';

const DuplicateResolution: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <FiLayers className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Duplicate Resolution</h1>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search duplicates..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Profiles Pending Review', count: '24', color: 'text-slate-800' },
            { label: 'High Confidence Matches', count: '12', color: 'text-blue-600' },
            { label: 'Potential Merges Cleared', count: '148', color: 'text-slate-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Action Bar & Match Badge */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-3 py-1 rounded-full border border-rose-100">HIGH MATCH (98%)</span>
            <span className="text-xs text-slate-400 font-mono">ID: #DUPE-9921</span>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 bg-[#10B981] text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition shadow-md shadow-emerald-100">Merge Profiles</button>
            <button className="px-5 py-2 bg-[#F59E0B] text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition shadow-md shadow-amber-100">Update</button>
            <button className="px-5 py-2 bg-[#EF4444] text-white text-sm font-bold rounded-lg hover:bg-rose-600 transition shadow-md shadow-rose-100">Cancel</button>
          </div>
        </div>

        {/* Profile Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Profile A - Existing/Verified */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
            <div className="flex justify-between items-start mb-8">
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-tighter">Verified Account</span>
            </div>
            
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl mb-4 border border-slate-100 flex items-center justify-center">
                <FiUser className="w-8 h-8 text-slate-200" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Marcus Sterling</h2>
              <p className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded mt-1">Added Mar 12, 2024</p>
            </div>

            <div className="space-y-5">
              <ProfileField label="Email Address" value="m.sterling@tech-solutions.io" isError />
              <ProfileField label="Phone Number" value="+1 (555) 012-9983" />
              <ProfileField label="Current Role" value="Senior Frontend Engineer" />
              <ProfileField label="Location" value="San Francisco, CA" />
              <ProfileField label="Last Activity" value="Applied for 'Staff UI Developer'" />
            </div>
          </div>

          {/* Profile B - New/Duplicate */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-400"></div>
            <div className="flex justify-between items-start mb-8">
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-100 uppercase tracking-tighter">New Record</span>
            </div>

            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl mb-4 shadow-lg flex items-center justify-center text-white font-bold text-xl">
                MS
              </div>
              <h2 className="text-xl font-bold text-slate-800">Marcus L. Sterling</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Added Apr 05, 2024</p>
            </div>

            <div className="space-y-5">
              <ProfileField label="Email Address" value="m.sterling@tech-solutions.io" isError />
              <ProfileField label="Phone Number" value="Not provided" isMuted />
              <ProfileField label="Current Role" value="Lead Engineer" />
              <ProfileField label="Location" value="Palo Alto, CA" />
              <ProfileField label="Last Activity" value="Incomplete Registration" />
            </div>
          </div>
        </div>

        {/* Primary Selection for Merge */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-[0.2em]">Select Primary Value for Merge</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectionBox label="PRIMARY NAME" value="Marcus Sterling" active />
            <SelectionBox label="LOCATION" value="San Francisco, CA" />
            <SelectionBox label="EXPERIENCE" value="Combine 12 Years" isItalic />
          </div>
        </div>

        {/* Upcoming Tasks Table */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Tasks</h3>
          </div>
          <div className="divide-y divide-slate-50">
            <TaskRow name="Alice Liddell vs. A. Liddell" match="82%" />
            <TaskRow name="Robert Wagner vs. Bob Wagner" match="75%" />
            <TaskRow name="James Doe vs. J. Doe" match="81%" />
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components for Cleaner Code
const ProfileField = ({ label, value, isError, isMuted }: any) => (
  <div className="pb-4 border-b border-slate-50 flex flex-col">
    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</span>
    <span className={`text-sm font-medium ${isError ? 'text-rose-600' : isMuted ? 'text-slate-300 italic' : 'text-slate-700'}`}>
      {value} {isError && <FiAlertCircle className="inline ml-1 mb-0.5" />}
    </span>
  </div>
);

const SelectionBox = ({ label, value, active, isItalic }: any) => (
  <div className={`p-4 rounded-xl border-2 flex justify-between items-center transition cursor-pointer ${active ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}>
    <div>
      <p className="text-[8px] font-black text-slate-400 mb-1">{label}</p>
      <p className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-400'} ${isItalic ? 'italic' : ''}`}>{value}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-slate-800 bg-slate-800' : 'border-slate-200'}`}>
      {active && <FiCheck className="text-white w-3 h-3" />}
    </div>
  </div>
);

const TaskRow = ({ name, match }: any) => (
  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-100 rounded text-[10px] font-bold flex items-center justify-center text-slate-500">
        {name.split(' ')[0][0]}{name.split(' vs. ')[1][0]}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700">{name}</p>
        <p className="text-[10px] text-slate-400 font-medium">Match Confidence: <span className="text-blue-500">{match}</span> • Shared Phone</p>
      </div>
    </div>
    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 transition">
      Review <FiRefreshCcw className="w-3 h-3" />
    </span>
  </div>
);

const FiUser = ({ className }: any) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default DuplicateResolution;