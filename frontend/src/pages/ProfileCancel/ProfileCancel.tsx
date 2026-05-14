// ProfileCancel.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {  
  FiCopy,
  FiSearch,
  FiBell,
  FiInfo,
} from 'react-icons/fi';
import { FaUserCheck, FaArrowLeft, FaTimesCircle } from 'react-icons/fa';

const ProfileCancel: React.FC = () => {
  const location = useLocation();
  const { ignoredPair } = location.state || {};

  // Default data if no state is passed
  const defaultData = {
    application1: {
      fullName: "Unknown Candidate",
      email: "Not provided",
      phone: "Not provided",
      skills: [],
      location: "Not provided",
      status: "Unknown",
      cvFileName: "",
      addedDate: new Date().toLocaleDateString(),
      experienceYears: 0,
      interestedField: "Not specified",
    },
    application2: {
      fullName: "Unknown Candidate",
      email: "Not provided",
      phone: "Not provided",
      skills: [],
      location: "Not provided",
      status: "Unknown",
      cvFileName: "",
      addedDate: new Date().toLocaleDateString(),
      experienceYears: 0,
      interestedField: "Not specified",
    },
    score: 0,
    matchReason: "No reason provided",
  };

  const data = ignoredPair || defaultData;
  // CHANGED: from candidate1/candidate2 to application1/application2
  const { application1, application2, score, matchReason } = data;

  // Determine which profile to show as the master record (the one with more complete data)
  const completenessScore = (c: any) => {
    let score = 0;
    if (c.email && c.email !== "Not provided") score += 2;
    if (c.phone && c.phone !== "Not provided") score += 2;
    if (c.location && c.location !== "Not provided") score += 1;
    if (c.skills?.length) score += Math.min(c.skills.length, 3);
    if (c.fullName && c.fullName !== "Unknown Candidate") score += 1;
    return score;
  };

  // CHANGED: variable names from candidate to application
  const masterApplication = completenessScore(application1) >= completenessScore(application2) ? application1 : application2;
  const duplicateApplication = completenessScore(application1) >= completenessScore(application2) ? application2 : application1;

  // Calculate combined experience
  const combinedExperience = Math.max(application1.experienceYears || 0, application2.experienceYears || 0);
  const combinedExperienceText = `${combinedExperience} Years ${combinedExperience >= 8 ? '(Expert)' : combinedExperience >= 5 ? '(Senior)' : combinedExperience >= 2 ? '(Mid-Level)' : combinedExperience > 0 ? '(Junior)' : '(Fresher)'}`;

  // Combine skills
  const combinedSkills = [...new Set([...(application1.skills || []), ...(application2.skills || [])])];

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
          {/* Master Record Header - Centered with red color */}
          <div className="px-6 py-8 border-b border-gray-200" style={{ backgroundColor: '#c93e3e' }}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="rounded-full flex items-center justify-center shadow-lg ring-8 ring-white/35">
                  <FaTimesCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Duplicate Pair Ignored</h2>
                <p className="text-white/90 text-sm mt-1">
                  Match confidence: {score}% - {matchReason}
                </p>
              </div>
            </div>
          </div>

          {/* Master Record Body */}
          <div className="px-6 py-5">
            {/* MASTER RECORD Section - Image, Label, Name, and Verification in one row */}
            <div className="flex items-center gap-4 mb-6">
              {/* User Image - using first letter as avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {masterApplication.fullName?.[0] || '?'}
              </div>
              
              {/* Master Record Info */}
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  MASTER RECORD (KEPT)
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">{masterApplication.fullName}</h3>
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <FaTimesCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Ignored Duplicate - Primary Record</span>
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
                    <p className="font-bold text-gray-800">{masterApplication.location || 'Not specified'}</p>
                  </div>
                </div>

                {/* Total Experience */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">TOTAL EXPERIENCE</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{combinedExperienceText}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SKILLS</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {combinedSkills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                          {skill}
                        </span>
                      ))}
                      {combinedSkills.length > 4 && (
                        <span className="text-xs text-gray-500">+{combinedSkills.length - 4} more</span>
                      )}
                    </div>
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
                    <p className="font-bold text-gray-800 break-words">{masterApplication.email || 'Not provided'}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PHONE NUMBER</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{masterApplication.phone || 'Not provided'}</p>
                  </div>
                </div>

                {/* Interested Field */}
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">INTERESTED FIELD</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{masterApplication.interestedField || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Duplicate Record Info */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <FaTimesCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">Duplicate Record Removed:</span>
              </div>
              <p className="text-sm text-orange-700">
                {duplicateApplication.fullName} - This duplicate profile has been ignored and will not be merged.
              </p>
            </div>

            {/* Action Buttons - Centered and same row with shadow */}
            <div className="flex justify-center gap-6 mb-6">
              <Link
                to="/duplicates-admin"
                className="flex items-center justify-center gap-2 px-8 py-3 min-w-[220px] transition-all duration-200 text-sm font-medium rounded-md shadow-md"
                style={{ backgroundColor: '#c93e3e', color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d72e2e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#c93e3e';
                }}
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Duplicates
              </Link>
              <Link
                // CHANGED: from '/candidates' to '/applications' to match the collection change
                to="/candidates"
                className="flex items-center justify-center gap-2 px-8 py-3 min-w-[220px] bg-blue-50 hover:bg-blue-100 text-gray-700 rounded-md font-medium transition-all duration-200 text-sm"
              >
                <FaUserCheck className="w-4 h-4" />
                View All Applications
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#f1f1f1' }}>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Audit log updated:</span> Duplicate pair ignored at {new Date().toLocaleString()}
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