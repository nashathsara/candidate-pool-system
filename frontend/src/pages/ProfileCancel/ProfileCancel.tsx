// ProfileMerge.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {  
  FiCopy,
  FiSearch,
  FiBell,
  FiInfo,
} from 'react-icons/fi';
import { FaCircleCheck, FaUserCheck, FaArrowLeft } from 'react-icons/fa6';

const ProfileCancel: React.FC = () => {
  return (
    <div>
      {/* Top Header with Search, Notifications, and Profile */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        {/* Left side - Title with Copy Icon */}
        <div className="flex items-center gap-2">
          <FiCopy className="w-5 h-5 text-gray-500" />
          <h4 className="text-xl font-bold text-gray-900">Duplicate Resolution</h4>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          </button>
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
            />
          </div>

          {/* Notification Icon */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Master Record Card - Centered */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-lg max-w-2xl w-full">
          {/* Master Record Header - Centered with new color */}
          <div className="px-6 py-8 border-b border-gray-200" style={{ backgroundColor: '#c93e3e' }}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="rounded-full flex items-center justify-center shadow-lg ring-8 ring-white/35">
                  <FaCircleCheck className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Profiles Successfully Cancelled</h2>
              </div>
            </div>
          </div>

          {/* Master Record Body */}
          <div className="px-6 py-5">
            {/* MASTER RECORD Section - Image, Label, Name, and Verification in one row */}
            <div className="flex items-center gap-4 mb-6">
              {/* User Image */}
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg"  
                alt="Marcus Sterling"
                className="w-24 h-24 rounded object-cover shadow-lg"
              />
              
              {/* Master Record Info */}
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  MASTER RECORD
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">Marcus Sterling</h3>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <FaCircleCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified Primary Account</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Record Details - Two Columns */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Location */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">LOCATION</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">San Francisco, CA</p>
                  </div>
                </div>

                {/* Total Experience */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">TOTAL EXPERIENCE</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Combined 12 Years</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Primary Email */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PRIMARY EMAIL</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">m.sterling@tech-solutions.io</p>
                  </div>
                </div>

                {/* Current Role */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CURRENT ROLE</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Lead Engineer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Action Buttons - Centered and same row with shadow */}
            <div className="flex justify-center gap-6 mb-6">
              <Link
                to="/profile"
                className="flex items-center justify-center gap-2 px-8 py-3 min-w-[220px] transition-all duration-200 text-sm font-medium rounded-md shadow-md"
                style={{ backgroundColor: '#c93e3e', color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d72e2e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#c93e3e';
                }}
              >
                <FaUserCheck className="w-4 h-4" />
                View Profile
              </Link>
              <Link
                to="/duplicates"
                className="flex items-center justify-center gap-2 px-8 py-3 min-w-[220px] bg-blue-50  hover:bg-blue-100 text-gray-700 rounded-md font-medium transition-all duration-200 text-sm "
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Duplicates
              </Link>
            </div>

          </div>
            <div className="px-6 py-4  flex items-center justify-between" style={{ backgroundColor: '#f1f1f1' }}>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Audit log updated:</span> ID #IDUPE-0921-Unified
               </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors flex items-center">
                <FiInfo className="w-4 h-4" />
             </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCancel;