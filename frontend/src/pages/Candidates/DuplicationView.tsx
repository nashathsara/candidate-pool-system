import React, { useState } from 'react';
import { FiAlertTriangle, FiRotateCcw, FiPlusCircle, FiMessageCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const DuplicationView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Why am I seeing this duplicate detection screen?", a: "Our system identifies profiles with similar information to ensure data integrity and prevent redundant entries." },
    { q: "How is the match confidence calculated?", a: "It is based on a comparison of key identifiers like Name, Date of Birth, and Phone Number." },
    { q: "What happens if I recover my existing profile?", a: "You will be prompted to verify your identity, after which you can update your previous information." },
    { q: "Can I still create a new profile if this isn't me?", a: "Yes, if the details do not match your identity, you can choose to create a new record." }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8 flex flex-col items-center font-sans">
      <div className="max-w-4xl w-full">
        
        {/* Header Progress Stepper */}
        <div className="flex justify-between items-center mb-16 px-10 relative">
          <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-700 -z-0"></div>
          {['Account Setup', 'Verification', 'Duplicate Check', 'Profile Completion'].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3 z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-4 border-[#0F172A] ${i < 2 ? 'bg-blue-600' : i === 2 ? 'bg-blue-600 ring-4 ring-blue-600/20' : 'bg-slate-700'}`}>
                {i < 2 ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${i === 2 ? 'text-blue-500' : 'text-slate-500'}`}>{step}</span>
            </div>
          ))}
        </div>

        {/* Potential Duplicate Alert */}
        <div className="bg-[#452710]/30 border border-orange-500/30 rounded-2xl p-6 mb-8 flex gap-5 items-start">
          <div className="bg-orange-500/20 p-2 rounded-lg">
            <FiAlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-orange-500 font-bold text-lg mb-1">Potential Duplicate Profile Detected</h2>
            <p className="text-slate-300 text-sm leading-relaxed">We found a profile that may already belong to you. Please review the details below to confirm. Not sure what this means? <span className="text-blue-400 cursor-pointer hover:underline">Learn more</span></p>
          </div>
        </div>

        {/* Match Confidence Score */}
        <div className="bg-[#1E293B]/50 rounded-2xl p-6 border border-slate-800 mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
             Match Confidence based on submitted information
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-blue-500">82%</span>
            <span className="text-slate-500 text-sm font-medium italic">Similarity Score</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[82%]"></div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Submitted Profile Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-slate-700/50 p-2 rounded-lg"><FiPlusCircle className="text-slate-400" /></div>
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Submitted Profile</h3>
            </div>
            <div className="space-y-6">
              <ComparisonField label="Full Name" value="Sarah Mitchell" match />
              <ComparisonField label="Phone Number" value="+1 (555) 234-5678" match />
              <ComparisonField label="Date of Birth" value="March 15, 1992" match />
              <ComparisonField label="Email Address" value="sarah.mitchell@email.com" partial />
            </div>
          </div>

          {/* Existing Profile Card */}
          <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter">Existing Profile</div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-500/20 p-2 rounded-lg"><FiRotateCcw className="text-blue-400" /></div>
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest italic">Created 8 months ago</h3>
            </div>
            <div className="space-y-6">
              <ComparisonField label="Full Name" value="Sarah Mitchell" />
              <ComparisonField label="Phone Number" value="+1 (555) ****-5678" />
              <ComparisonField label="Date of Birth" value="**/**/1992" />
              <ComparisonField label="Email Address" value="s*******@email.com" />
            </div>
          </div>
        </div>

        {/* Action Decision Area */}
        <div className="bg-[#1E293B]/80 rounded-3xl p-10 border border-slate-800 text-center mb-12">
          <h3 className="text-xl font-bold mb-2">What would you like to do?</h3>
          <p className="text-slate-400 text-sm mb-10">Choose an option below to proceed with your onboarding</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 py-4 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20">
              <FiRotateCcw className="w-5 h-5" /> Recover Existing Profile
            </button>
            <button className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 py-4 px-6 rounded-2xl font-bold transition-all border border-slate-700">
              <FiPlusCircle className="w-5 h-5" /> Create New Profile
            </button>
            <button className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 py-4 px-6 rounded-2xl font-bold transition-all border border-slate-700">
              <FiMessageCircle className="w-5 h-5" /> Contact Support
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#1E293B]/40 rounded-3xl p-8 border border-slate-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-500/20 p-1.5 rounded-full text-blue-500 font-bold text-xs">?</div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-slate-800 last:border-0">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center py-4 text-left hover:text-blue-400 transition"
                >
                  <span className="text-sm font-medium">{faq.q}</span>
                  {openFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openFaq === idx && (
                  <div className="pb-4 text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component for clean profile fields
const ComparisonField = ({ label, value, match, partial }: any) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      {match && <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">Match</span>}
      {partial && <span className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">Partial Match</span>}
    </div>
    <p className={`font-semibold text-base ${match ? 'text-white' : partial ? 'text-slate-200' : 'text-slate-300'}`}>{value}</p>
  </div>
);

export default DuplicationView;