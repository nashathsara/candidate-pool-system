import React from 'react';
import { 
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
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-white p-6 fixed h-screen overflow-y-auto border-r border-gray-100 shadow-sm">
        <div className="logo-section mb-10">
          <h1 className="text-xl font-bold mb-1 text-gray-900">
            Candidate<span className="text-blue-500">Hub</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Global Talent Pool</p>
        </div>

        <nav className="flex flex-col gap-1 mb-8">
          <SidebarLink icon={<FiHome />} label="Dashboard" />
          <SidebarLink icon={<FiUsers />} label="Candidates" active />
          <SidebarLink icon={<FiCopy />} label="Duplicates" />
          <SidebarLink icon={<FiSettings />} label="Settings" />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-gray-900 cursor-pointer transition-all text-white shadow-lg shadow-gray-200">
            <FiSearch className="w-5 h-5" />
            <span className="text-sm font-bold">New Search</span>
          </div>
          
          <div className="flex flex-col gap-1 border-t border-gray-100 pt-4">
            <SidebarLink icon={<FiHelpCircle />} label="Support" small />
            <SidebarLink icon={<FiLogOut />} label="Sign Out" small />
          </div>
        </div>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 bg-[#F8FAFC]">
        {/* Top Header Section with Profile Card */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 uppercase">In Review</span>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Updated 2 days ago</p>
          </div>

          <div className="flex gap-8 items-center">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl ring-4 ring-gray-50">
                 <img src="https://i.pravatar.cc/300?img=12" alt="Alex Rivera" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-900 mb-1">Alex Rivera</h2>
              <p className="text-lg text-blue-500 font-bold mb-4">Senior Frontend Architect</p>
              
              <div className="grid grid-cols-2 gap-y-2 max-w-lg">
                <IconInfo icon={<FiMapPin />} text="Chicago, IL" />
                <IconInfo icon={<FiMail />} text="alex.rivera@example.com" />
                <IconInfo icon={<FiPhone />} text="+1 (312) 555-0198" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
               <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs transition-all hover:bg-gray-800">
                <FiCheckCircle /> Update Status
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all hover:bg-gray-50">
                <FiShare2 /> Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Experience - Full Width */}
        <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600"><FiBriefcase className="w-5 h-5" /></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Experience</h3>
          </div>
          
          <div className="space-y-10">
            <ExperienceItem 
              title="Senior Frontend Architect"
              company="CloudScale Systems • Full-time"
              period="2021 — Present"
              desc="Leading the frontend migration from monolithic architecture to micro-frontends using React and Next.js. Reduced bundle sizes by 40% and improved Core Web Vitals across 12 product lines. Mentoring a team of 15 senior engineers and defining global UI standards."
            />
            <ExperienceItem 
              title="Lead UI Engineer"
              company="Velocity Dev Studio • Full-time"
              period="2018 — 2021"
              desc="Architected a custom design system used by over 50 clients. Scaled the engineering team from 5 to 20 members while maintaining a rigorous code quality standard and 98% unit test coverage."
            />
          </div>
        </section>

        {/* Bottom Grid: Education & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          
          {/* Education & Progress */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-500/10 p-2 rounded-lg text-green-600"><FiBookOpen className="w-5 h-5" /></div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Education</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900">M.S. Computer Science</h4>
                  <p className="text-sm text-blue-500 font-bold">Stanford University</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Graduated 2018</p>
                </div>
                <div className="pt-6 border-t border-gray-50">
                  <h4 className="font-bold text-gray-900">B.S. Software Engineering</h4>
                  <p className="text-sm text-blue-500 font-bold">Georgia Institute of Technology</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Graduated 2016</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-purple-500/10 p-2 rounded-lg text-purple-600"><FiTrendingUp className="w-5 h-5" /></div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Review Progress</h3>
              </div>
              <ProgressBar label="Technical" value={82} color="bg-blue-500" />
              <ProgressBar label="Communication" value={85} color="bg-green-500" />
              <ProgressBar label="Culture" value={78} color="bg-amber-500" />
            </section>
          </div>

          {/* Technical Skills */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-orange-500/10 p-2 rounded-lg text-orange-600"><FiCpu className="w-5 h-5" /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Technical Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["React 18", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "GraphQL", "AWS", "Docker", "Kubernetes"].map(skill => (
                <span key={skill} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-xs font-bold border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-12 pt-8 text-center border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">© 2024 CandidateHub System. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

const IconInfo = ({ icon, text }: any) => (
  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
    <span className="text-gray-300">{React.cloneElement(icon, { className: "w-4 h-4" })}</span>
    {text}
  </div>
);

const ExperienceItem = ({ title, company, period, desc }: any) => (
  <div className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-500 before:rounded-full after:absolute after:left-[2.5px] after:top-6 after:bottom-[-2.5rem] after:w-[1px] after:bg-gray-100 last:after:hidden">
    <div className="flex justify-between items-start mb-1">
      <h4 className="text-lg font-black text-gray-900">{title}</h4>
      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{period}</span>
    </div>
    <p className="text-sm text-blue-500 font-bold mb-3 italic">{company}</p>
    <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const ProgressBar = ({ label, value, color }: any) => (
  <div className="mb-6 last:mb-0">
    <div className="flex justify-between mb-2">
      <span className="text-xs font-black uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-xs font-black text-gray-900">{value}%</span>
    </div>
    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
    <p className="text-[9px] font-black text-gray-300 uppercase mt-1 tracking-tighter">Fit Score</p>
  </div>
);

export default ProfileView;
