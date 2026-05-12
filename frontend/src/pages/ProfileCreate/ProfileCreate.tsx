import React from 'react';
import { FiUploadCloud, FiBriefcase, FiUser, FiPaperclip } from 'react-icons/fi';

const CandidateForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Application</h1>
          <p className="text-slate-500 text-sm">Complete your professional profile to join our global talent pool.</p>
        </div>

        <form className="space-y-8">
          
          {/* Section 1: Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg"><FiUser className="text-slate-500 w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField label="Full Name" placeholder="John Doe" />
              <FormField label="Email Address" placeholder="john.doe@example.com" type="email" />
              <FormField label="Mobile Number" placeholder="+1 (555) 000-0000" />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition" />
                <p className="text-[10px] text-slate-400 italic text-right">Auto-calculating age...</p>
              </div>
              <div className="md:col-span-2">
                <FormField label="LinkedIn Profile URL" placeholder="linkedin.com/in/username" />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Background */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg"><FiBriefcase className="text-slate-500 w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-slate-800">Professional Background</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interested Field</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none appearance-none cursor-pointer">
                  <option>Software Engineering</option>
                  <option>Data Science</option>
                  <option>UI/UX Design</option>
                </select>
              </div>
              <FormField label="Years of Experience" placeholder="e.g. 5" type="number" />
            </div>

            {/* Dynamic Skills based on Flowchart */}
            <div className="space-y-4 mb-8">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Skills (Auto-suggested for Software Engineering)</label>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'TypeScript', 'Node.js', 'Docker', 'AWS'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full border border-blue-100">{skill}</span>
                ))}
                <button type="button" className="px-3 py-1 border border-dashed border-slate-300 text-slate-400 text-[11px] font-bold rounded-full hover:bg-slate-50 transition">+ Add Skill</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Status</label>
                <div className="space-y-2">
                  <RadioOption label="Actively Looking" name="status" defaultChecked />
                  <RadioOption label="Open to Opportunities" name="status" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Availability</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer">
                  <option>Immediate</option>
                  <option>1 Month Notice</option>
                  <option>3 Months Notice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Preferences & Attachments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-slate-100 p-2 rounded-lg"><FiPaperclip className="text-slate-500 w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-slate-800">Preferences & Attachments</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected Annual Salary Range</label>
                  <div className="flex items-center gap-3">
                    <input type="text" placeholder="Min" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                    <span className="text-slate-300 font-bold">—</span>
                    <input type="text" placeholder="Max" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-none mb-1">Willing to be Contacted</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Allow recruiters to reach out via email or phone for premium opportunities.</p>
                  </div>
                </div>
              </div>

              {/* CV Upload based on Journey logic */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition cursor-pointer group">
                <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition"><FiUploadCloud className="w-6 h-6 text-blue-500" /></div>
                <p className="text-xs font-bold text-slate-700 mb-1">Click to upload or drag & drop</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">PDF, DOCX up to 10MB</p>
                
                {/* Uploaded File Indicator from Figma */}
                <div className="mt-4 w-full bg-white border border-slate-100 rounded-lg p-2 flex items-center justify-between shadow-sm">
                  <span className="text-[10px] text-slate-500 font-medium truncate italic">j_doe_resume_2024.pdf</span>
                  <button className="text-rose-500 text-xs font-bold px-1 hover:bg-rose-50 rounded">✕</button>
                </div>
              </div>
            </div>
          </div>

          {/* Final Submission Section */}
          <div className="flex flex-col items-center gap-6 pt-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-xs text-slate-500">I agree to the <span className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">Terms of Service</span> and <span className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">Privacy Policy</span>.</span>
            </label>
            <button type="submit" className="w-full md:w-auto px-16 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
              Complete Registration <span className="text-lg">→</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Sub-components for cleaner structure
const FormField = ({ label, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition" />
  </div>
);

const RadioOption = ({ label, name, defaultChecked }: any) => (
  <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 hover:border-blue-200 transition">
    <input type="radio" name={name} defaultChecked={defaultChecked} className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500" />
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);

export default CandidateForm;
