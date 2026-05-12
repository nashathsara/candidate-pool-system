import React from 'react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Candidates', icon: '👥' },
    { name: 'Duplicates', icon: '📁' },
    { name: 'Settings', icon: '⚙️', active: true },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-6">
      <div className="mb-10">
        <h1 className="font-bold text-xl">CandidateHub</h1>
        <p className="text-xs text-gray-400">Global Talent Pool</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-all ${
              item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
        <button className="w-full py-3 bg-black text-white rounded-lg flex items-center justify-center gap-2 text-sm font-bold">
          🔍 New Search
        </button>
        <div className="text-sm text-gray-500 space-y-3 px-4">
          <p className="cursor-pointer hover:text-black">🎧 Support</p>
          <p className="cursor-pointer hover:text-black">🚪 Sign Out</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;