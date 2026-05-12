
import React from 'react';

const TicketSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="w-full max-w-2xl text-center">
        
        {/* Success Header */}
        <div className="mb-10">
          <div className="w-16 h-16 bg-[#4FD1C5] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ticket Submitted Successfully</h1>
          
          {/* Change 1: Adjusted background to a darker light-blue and used 'rounded-md' for a less circular look */}
          <div className="inline-block bg-[#BEE3F8] text-[#2C5282] px-4 py-1.5 rounded-md text-xs font-black tracking-wider uppercase">
            Reference: #TKT-82951
          </div>
          
          <p className="text-gray-500 text-sm mt-6 leading-relaxed px-10">
            Thank you for reaching out. Our support team is currently reviewing your request. 
            We typically respond within 24-48 hours.
          </p>
        </div>

        {/* Main Action Box */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-6 text-left">
            Next Steps & Helpful Links
          </h2>

          {/* Change 2: Force side-by-side using 'flex' or 'grid' with explicit widths */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 w-full">
            
            {/* Dashboard Button */}
            <button className="flex-1 flex items-center gap-4 p-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all text-left">
              <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center grayscale text-lg">
                📊
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Back to Dashboard</p>
                <p className="text-[11px] text-gray-700 font-semibold">Return to candidate overview</p>
              </div>
            </button>

            {/* View Tickets Button */}
            <button className="flex-1 flex items-center gap-4 p-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all text-left">
              <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center grayscale text-lg">
                📋
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">View My Tickets</p>
                <p className="text-[11px] text-gray-700 font-semibold">Track the status of your request</p>
              </div>
            </button>
          </div>

          {/* Browse button section */}
          <div className="max-w-xs mx-auto">
            <button className="w-full py-2.5 bg-[#102A38] text-white text-xs font-bold rounded-lg hover:bg-black transition-all mb-3">
              Browse More Help Topics
            </button>
            
            <p className="text-[11px] text-gray-500">
              Need urgent assistance? <span className="text-blue-600 cursor-pointer font-bold hover:underline">Check our system status page</span>
            </p>
          </div>
        </div>

        <footer className="mt-12 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
           © 2024 WHS Solution Recruitment Suite. All rights reserved. Privacy Policy. Help Center
        </footer>
      </div>
    </div>
  );
};

export default TicketSuccess;