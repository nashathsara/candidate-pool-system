import React from 'react';
import { FiCopy, FiCheck, FiX, FiRefreshCcw, FiLayers } from 'react-icons/fi';

const DuplicateResolution: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 text-gray-800">
           <div className="flex items-center gap-3">
             <FiLayers className="text-blue-600 w-8 h-8" />
             <h1 className="text-2xl font-bold">Duplicate Resolution</h1>
           </div>
           <div className="flex gap-4">
             <button className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 shadow-md transition">Merge Profiles</button>
             <button className="px-6 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 shadow-md transition">Update</button>
             <button className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 shadow-md transition">Cancel</button>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           {/* Profile A */}
           <div className="bg-white rounded-3xl shadow-lg p-10 border-t-8 border-indigo-500 relative">
             <span className="absolute top-4 right-6 bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-100 uppercase">Verified Account</span>
             <div className="flex flex-col items-center mb-8">
               <div className="w-24 h-24 bg-gray-100 rounded-2xl mb-4 border-2 border-gray-50 flex items-center justify-center text-gray-300 italic">No Photo</div>
               <h2 className="text-xl font-bold text-gray-800">Marcus Sterling</h2>
               <p className="text-sm text-blue-600 font-medium">Added Mar 12, 2024</p>
             </div>
             <div className="space-y-6 text-sm">
               <div className="pb-4 border-b border-gray-50 flex justify-between items-center"><span className="text-gray-400">Email Address</span><span className="font-medium text-gray-700">m.sterling@tech-solutions.io</span></div>
               <div className="pb-4 border-b border-gray-50 flex justify-between items-center"><span className="text-gray-400">Phone Number</span><span className="font-medium text-gray-700">+1 (555) 312-9983</span></div>
               <div className="pb-4 border-b border-gray-50 flex justify-between items-center"><span className="text-gray-400">Current Role</span><span className="font-medium text-gray-700">Senior Frontend Engineer</span></div>
             </div>
           </div>

           {/* Profile B */}
           <div className="bg-white rounded-3xl shadow-lg p-10 border-t-8 border-rose-500">
             <div className="flex flex-col items-center mb-8">
               <div className="w-24 h-24 bg-gray-900 rounded-2xl mb-4 shadow-xl overflow-hidden flex items-center justify-center text-white font-bold">MS</div>
               <h2 className="text-xl font-bold text-gray-800">Marcus L. Sterling</h2>
               <p className="text-sm text-rose-500 font-medium">Added Apr 02, 2024</p>
             </div>
             <div className="space-y-6 text-sm">
               <div className="pb-4 border-b border-gray-50 flex justify-between items-center"><span className="text-gray-400">Email Address</span><span className="font-medium text-rose-500 underline italic">m.sterling@tech-solutions.io</span></div>
               <div className="pb-4 border-b border-gray-50 flex justify-between items-center"><span className="text-gray-400">Phone Number</span><span className="font-medium text-gray-400 italic italic">Not provided</span></div>
               <div className="pb-4 border-b border-gray-50 flex justify-between items-center"><span className="text-gray-400">Current Role</span><span className="font-medium text-gray-700">Lead Engineer</span></div>
             </div>
           </div>
        </div>

        {/* Primary Selection Section */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Select Primary Value for Merge</h3>
           <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-800 flex justify-between items-center">
                 <span className="text-sm font-bold">Marcus Sterling</span>
                 <div className="w-4 h-4 rounded-full border-4 border-gray-800"></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center text-gray-400">
                 <span className="text-sm font-bold">San Francisco, CA</span>
                 <div className="w-4 h-4 rounded-full border border-gray-300"></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center text-gray-400">
                 <span className="text-sm font-bold italic">Combine 12 Years</span>
                 <div className="w-4 h-4 rounded-full border border-gray-300"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateResolution;