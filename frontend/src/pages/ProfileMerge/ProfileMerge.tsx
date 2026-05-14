// ProfileMerge.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {  
  FiCopy,
  FiSearch,
  FiBell,
  FiInfo
} from 'react-icons/fi';
import { FaCircleCheck, FaUserCheck, FaArrowLeft } from 'react-icons/fa6';

type MergedProfileData = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  skills: string[];
  location?: string;
  experienceYears: number;
  experienceText: string;
  status?: string;
  interestedField?: string;
  availability?: string;
  role?: string;
};

const ProfileMerge: React.FC = () => {
  const location = useLocation();
  const mergedProfile = location.state?.mergedProfile as MergedProfileData;
  const removedId = location.state?.removedId as string;

  // Default values if no data is passed
  const displayName = mergedProfile?.fullName || "Marcus Sterling";
  const displayEmail = mergedProfile?.email || "m.sterling@tech-solutions.io";
  const displayLocation = mergedProfile?.location || "San Francisco, CA";
  const displayExperience = mergedProfile?.experienceText || "Combined 12 Years (Senior)";
  const displayRole = mergedProfile?.role || mergedProfile?.interestedField?.split('/')[0] || "Lead Engineer";
  const displaySkills = mergedProfile?.skills?.slice(0, 5).join(', ') || "React, TypeScript, Node.js";
  const displayPhone = mergedProfile?.phone || "+1 (555) 012-9983";

  // Generate unique audit ID
  const auditId = `IDUPE-${mergedProfile?.id?.slice(-6) || '0921'}-Unified`;

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
              src={`https://randomuser.me/api/portraits/men/${Math.abs(displayName.length * 7) % 50 + 1}.jpg`}
              alt="User Profile"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://randomuser.me/api/portraits/men/32.jpg";
              }}
            />
          </div>
        </div>
      </div>

      {/* Master Record Card - Centered */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-lg max-w-2xl w-full">
          {/* Master Record Header - Centered with new color */}
          <div className="px-6 py-8 border-b border-gray-200" style={{ backgroundColor: '#3ec9b6' }}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="rounded-full flex items-center justify-center shadow-lg ring-8 ring-white/35">
                  <FaCircleCheck className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Profiles Successfully Merged</h2>
                <p className="text-sm text-white/90 mt-0.5">
                  Duplicate records for {displayName} have been unified into a single master profile.
                </p>
              </div>
            </div>
          </div>

          {/* Master Record Body */}
          <div className="px-6 py-5">
            {/* MASTER RECORD Section - Image, Label, Name, and Verification in one row */}
            <div className="flex items-center gap-4 mb-6">
              {/* User Image - Generate consistent image based on name */}
              <img 
                src={`https://randomuser.me/api/portraits/men/${Math.abs(displayName.length * 13) % 50 + 1}.jpg`}
                alt={displayName}
                className="w-24 h-24 rounded object-cover shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://randomuser.me/api/portraits/men/32.jpg";
                }}
              />
              
              {/* Master Record Info */}
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  MASTER RECORD
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
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
                    <p className="font-bold text-gray-800">{displayLocation}</p>
                  </div>
                </div>

                {/* Total Experience */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">TOTAL EXPERIENCE</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{displayExperience}</p>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SKILLS</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{displaySkills}</p>
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
                    <p className="font-bold text-gray-800">{displayEmail}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PHONE NUMBER</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{displayPhone}</p>
                  </div>
                </div>

                {/* Current Role */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CURRENT ROLE</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{displayRole}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Action Buttons - Centered and same row with shadow */}
            <div className="flex justify-center gap-6 mb-6">
              <Link
                to={`/candidate-profile/${mergedProfile?.id || ''}`}
                className="flex items-center justify-center gap-2 px-8 py-3 min-w-[220px] transition-all duration-200 text-sm font-medium rounded-md shadow-md"
                style={{ backgroundColor: '#3ec9b6', color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#34b5a3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3ec9b6';
                }}
              >
                <FaUserCheck className="w-4 h-4" />
                View Profile
              </Link>
              <Link
                to="/duplicate-resolution"
                className="flex items-center justify-center gap-2 px-8 py-3 min-w-[220px] bg-blue-50 hover:bg-blue-100 text-gray-700 rounded-md font-medium transition-all duration-200 text-sm"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Duplicates
              </Link>
            </div>

          </div>
          
          {/* Footer with Audit Log */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#f1f1f1' }}>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Audit log updated:</span> ID #{auditId}
              {removedId && (
                <span className="ml-2 text-xs text-gray-400">
                  (Removed duplicate: {removedId.slice(-8)})
                </span>
              )}
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

export default ProfileMerge;