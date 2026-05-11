// components/Sidebar.tsx
import React from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiCopy, 
  FiSettings, 
  FiSearch, 
  FiHelpCircle, 
  FiLogOut,
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white text-gray-900 p-6 fixed h-screen overflow-y-auto border-r border-gray-100">
      <div className="logo-section mb-10">
        <h1 className="text-xl font-bold mb-1 text-gray-900">
          Candidate<span className="text-blue-500">Hub</span>
        </h1>
        <p className="text-xs text-gray-400">Global Talent Pool</p>
      </div>

      <nav className="flex flex-col gap-1 mb-8">
        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all duration-200">
          <FiHome className="w-5 h-5" />
          Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all duration-200">
          <FiUsers className="w-5 h-5" />
          Candidates
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all duration-200">
          <FiCopy className="w-5 h-5" />
          Duplicates
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all duration-200">
          <FiSettings className="w-5 h-5" />
          Settings
        </a>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-gray-50 cursor-pointer transition-all duration-200 text-gray-700 hover:bg-gray-100">
          <FiSearch className="w-5 h-5" />
          <span className="text-sm font-medium">New Search</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-sm transition-all duration-200">
            <FiHelpCircle className="w-4 h-4" />
            Support
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-sm transition-all duration-200">
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;