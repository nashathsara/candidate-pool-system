// ProfileView.tsx
import React from 'react';
import { 
<<<<<<< HEAD
  FiHome, 
  FiUsers, 
  FiCopy, 
  FiSettings, 
  FiSearch, 
  FiHelpCircle, 
  FiLogOut,
=======
>>>>>>> main
  FiBriefcase,
  FiBookOpen,
  FiCpu,
  FiTrendingUp,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShare2,
  FiCheckCircle,
} from 'react-icons/fi';

const ProfileView: React.FC = () => {
  return (
<<<<<<< HEAD
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-gray-50">
        {/* Action Buttons - Above Header */}
        <div className="flex justify-end gap-3 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm">
            <FiShare2 className="w-4 h-4" />
            Share Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium text-sm">
            <FiCheckCircle className="w-4 h-4" />
            Update Status
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-start">
            {/* Left side - Profile Info */}
            <div className="flex gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  AR
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Profile Details */}
              <div className="profile-info">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Alex Rivera</h2>
                <p className="text-lg text-blue-500 font-medium mb-2">Senior Frontend Architect</p>
                <p className="text-gray-500 mb-3 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" />
                  Chicago, IL
                </p>
                <div className="flex gap-4 text-gray-600 text-sm">
                  <span className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    alex.rivera@example.com
                  </span>
                  <span className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    +1 (312) 555-0198
                  </span>
                </div>
=======
    <>
      {/* Action Buttons - Above Header */}
      <div className="flex justify-end gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm">
          <FiShare2 className="w-4 h-4" />
          Share Profile
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium text-sm">
          <FiCheckCircle className="w-4 h-4" />
          Update Status
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex items-start">
          {/* Left side - Profile Info */}
          <div className="flex gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                AR
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Profile Details */}
            <div className="profile-info">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Alex Rivera</h2>
              <p className="text-lg text-blue-500 font-medium mb-2">Senior Frontend Architect</p>
              <p className="text-gray-500 mb-3 flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Chicago, IL
              </p>
              <div className="flex gap-4 text-gray-600 text-sm">
                <span className="flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  alex.rivera@example.com
                </span>
                <span className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4" />
                  +1 (312) 555-0198
                </span>
>>>>>>> main
              </div>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
        {/* Experience Section - Full Width */}
        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
            <FiBriefcase className="w-5 h-5 text-blue-500" />
            Experience
          </h3>
          
          <div className="experience-item mb-6 last:mb-0">
            <h4 className="font-semibold text-gray-900 mb-1">Senior Frontend Architect</h4>
            <p className="text-blue-500 text-sm font-medium mb-2">CloudScale Systems • Full-time</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Leading the frontend migration from monolithic architecture to micro-frontends using React and Next.js. 
              Reduced bundle sizes by 40% and improved Core Web Vitals across 12 product lines. 
              Mentoring a team of 15 senior engineers and defining global UI standards.
            </p>
          </div>

          <div className="experience-item">
            <h4 className="font-semibold text-gray-900 mb-1">Lead UI Engineer</h4>
            <p className="text-blue-500 text-sm font-medium mb-2">Velocity Dev Studio • Full-time</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Architected a custom design system used by over 50 clients. Scaled the engineering team from 5 to 20 members 
              while maintaining a rigorous code quality standard and 98% unit test coverage.
            </p>
          </div>
        </section>

        {/* Two Column Layout for remaining sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-8">
          {/* Left Column */}
          <div className="left-column">
            {/* Education Section */}
            <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
                <FiBookOpen className="w-5 h-5 text-green-500" />
                Education
              </h3>
              
              <div className="education-item mb-6 last:mb-0">
                <h4 className="font-semibold text-gray-900 mb-1">M.S. Computer Science</h4>
                <p className="text-blue-500 text-sm font-medium mb-2">Stanford University</p>
                <p className="text-gray-500 text-xs">Graduated 2018</p>
              </div>

              <div className="education-item">
                <h4 className="font-semibold text-gray-900 mb-1">B.S. Software Engineering</h4>
                <p className="text-blue-500 text-sm font-medium mb-2">Georgia Institute of Technology</p>
                <p className="text-gray-500 text-xs">Graduated 2016</p>
              </div>
            </section>

            {/* Review Progress - Moved to Left Column below Education */}
            <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-purple-500" />
                Review Progress
              </h3>
              
              <div className="progress-item mb-6 last:mb-0">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">Technical</span>
                  <span className="text-blue-500 font-semibold">82%</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300" style={{ width: '82%' }}></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Fit</span>
              </div>

              <div className="progress-item mb-6 last:mb-0">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">Communication</span>
                  <span className="text-blue-500 font-semibold">85%</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Fit</span>
              </div>

              <div className="progress-item">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">Culture</span>
                  <span className="text-blue-500 font-semibold">78%</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300" style={{ width: '78%' }}></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Fit</span>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Technical Skills */}
            <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
                <FiCpu className="w-5 h-5 text-orange-500" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  React 18
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  TypeScript
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  Next.js
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  Tailwind CSS
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  Node.js
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  GraphQL
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  AWS
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  Docker
                </span>
                <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                  Kubernetes
                </span>
              </div>
            </section>
          </div>
=======
      {/* Experience Section - Full Width */}
      <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
        <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
          <FiBriefcase className="w-5 h-5 text-blue-500" />
          Experience
        </h3>
        
        <div className="experience-item mb-6 last:mb-0">
          <h4 className="font-semibold text-gray-900 mb-1">Senior Frontend Architect</h4>
          <p className="text-blue-500 text-sm font-medium mb-2">CloudScale Systems • Full-time</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Leading the frontend migration from monolithic architecture to micro-frontends using React and Next.js. 
            Reduced bundle sizes by 40% and improved Core Web Vitals across 12 product lines. 
            Mentoring a team of 15 senior engineers and defining global UI standards.
          </p>
>>>>>>> main
        </div>

        <div className="experience-item">
          <h4 className="font-semibold text-gray-900 mb-1">Lead UI Engineer</h4>
          <p className="text-blue-500 text-sm font-medium mb-2">Velocity Dev Studio • Full-time</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Architected a custom design system used by over 50 clients. Scaled the engineering team from 5 to 20 members 
            while maintaining a rigorous code quality standard and 98% unit test coverage.
          </p>
        </div>
      </section>

      {/* Two Column Layout for remaining sections */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-8">
        {/* Left Column */}
        <div className="left-column">
          {/* Education Section */}
          <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <FiBookOpen className="w-5 h-5 text-green-500" />
              Education
            </h3>
            
            <div className="education-item mb-6 last:mb-0">
              <h4 className="font-semibold text-gray-900 mb-1">M.S. Computer Science</h4>
              <p className="text-blue-500 text-sm font-medium mb-2">Stanford University</p>
              <p className="text-gray-500 text-xs">Graduated 2018</p>
            </div>

            <div className="education-item">
              <h4 className="font-semibold text-gray-900 mb-1">B.S. Software Engineering</h4>
              <p className="text-blue-500 text-sm font-medium mb-2">Georgia Institute of Technology</p>
              <p className="text-gray-500 text-xs">Graduated 2016</p>
            </div>
          </section>

          {/* Review Progress */}
          <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-purple-500" />
              Review Progress
            </h3>
            
            <div className="progress-item mb-6 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">Technical</span>
                <span className="text-blue-500 font-semibold">82%</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300" style={{ width: '82%' }}></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Fit</span>
            </div>

            <div className="progress-item mb-6 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">Communication</span>
                <span className="text-blue-500 font-semibold">85%</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Fit</span>
            </div>

            <div className="progress-item">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">Culture</span>
                <span className="text-blue-500 font-semibold">78%</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300" style={{ width: '78%' }}></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">Fit</span>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Technical Skills */}
          <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <FiCpu className="w-5 h-5 text-orange-500" />
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                React 18
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                TypeScript
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                Next.js
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                Tailwind CSS
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                Node.js
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                GraphQL
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                AWS
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                Docker
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 cursor-default hover:bg-blue-100 hover:-translate-y-0.5">
                Kubernetes
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProfileView;