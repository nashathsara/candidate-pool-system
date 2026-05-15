import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Candidates', icon: '👥', path: '/candidates' },
    { name: 'Duplicates', icon: '📁', path: '/duplicates' },
    { name: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];


  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Admin sidebar sign out failed:', error);
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="w-full lg:w-64 min-h-screen bg-white border-b border-gray-100 lg:border-b-0 lg:border-r flex flex-col p-6 text-xs">
      <div className="mb-10">
        <h1 className="font-bold text-lg text-black">CandidateHub</h1>
        <p className="text-[10px] text-gray-400">Global Talent Pool</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.path)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="grayscale opacity-70">{item.icon}</span>
              {item.name}
            </button>
          );
        })}
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
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left cursor-pointer hover:text-black flex items-center gap-2"
          >
            <span className="grayscale">🚪</span> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;