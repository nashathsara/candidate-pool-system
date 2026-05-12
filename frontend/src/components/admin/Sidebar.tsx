import React from 'react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' }, // Use grayscale version or SVG
    { name: 'Candidates', icon: '👥' },
    { name: 'Duplicates', icon: '📁' },
    { name: 'Settings', icon: '⚙️', active: true },
  ];

  return (
    /* Changed text-sm to text-xs for smaller sidebar font */
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-6 text-xs">
      <div className="mb-10">
        <h1 className="font-bold text-lg text-black">CandidateHub</h1>
        <p className="text-[10px] text-gray-400">Global Talent Pool</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer font-medium transition-all ${
              item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {/* Filter used to make icons black and white */}
            <span className="grayscale opacity-70">{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>

      {/* This container is pushed to the bottom using mt-auto */}
      <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
        <button className="w-full py-2.5 bg-black text-white rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-gray-800 transition-all">
          <span className="grayscale">🔍</span> New Search
        </button>
        <div className="text-gray-500 space-y-3 px-4">
          <p className="cursor-pointer hover:text-black flex items-center gap-2">
            <span className="grayscale">🎧</span> Support
          </p>
          <p className="cursor-pointer hover:text-black flex items-center gap-2">
            <span className="grayscale">🚪</span> Sign Out
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;