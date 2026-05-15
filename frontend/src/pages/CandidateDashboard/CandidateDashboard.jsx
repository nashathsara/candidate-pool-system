// frontend/src/pages/CandidateDashboard/CandidateDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, FileText, MessageSquare, TrendingUp, 
  CheckCircle, AlertCircle, Star, ArrowRight, 
  Calendar, BarChart3, Search, HelpCircle 
} from 'lucide-react';
import axios from 'axios';
import CandidateNav from '../../components/CandidateNav';
import StatCard from '../../components/StatCard';
import QuickActionCard from '../../components/QuickActionCard';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    profileCompletion: 0,
    profileViews: 0,
    profileStrength: '',
    isVerified: false,
    uid: ''
  });
  const [stats, setStats] = useState({
    savedJobs: 0,
    applications: 0,
    messages: 0,
    unreadMessages: 0,
    profileStrength: '0%'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/signin');
      return;
    }

    const user = JSON.parse(userStr);
    if (!user || !user.email) {
      navigate('/signin');
      return;
    }

    fetchUserData(user);
    fetchStats(user);
    fetchRecentActivity(user);
  }, []);

  const fetchUserData = async (user) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/candidates/profile/${user.email}`);
      if (response.data.status === 'success') {
        const candidate = response.data.data;
        setUserData({
          fullName: candidate.fullName || '',
          email: candidate.email || '',
          profileCompletion: calculateProfileCompletion(candidate),
          profileViews: candidate.profileViews || 0,
          profileStrength: candidate.profileStrength || '0%',
          isVerified: candidate.isVerified || false,
          uid: candidate.uid || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompletion = (candidate) => {
    let completion = 0;
    if (candidate.fullName && candidate.fullName !== '') completion += 20;
    if (candidate.email && candidate.email !== '') completion += 20;
    if (candidate.phone && candidate.phone !== '') completion += 15;
    if (candidate.skills && candidate.skills.length > 0) completion += 25;
    if (candidate.experience && candidate.experience !== '') completion += 20;
    return completion;
  };

  const fetchStats = async (user) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/candidates/stats/${user.uid}`);
      if (response.data.status === 'success') {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async (user) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/candidates/activity/${user.uid}`);
      if (response.data.status === 'success') {
        setRecentActivity(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/signin');
  };

  const handleUpdateProfile = () => {
    navigate('/create-profile');
  };

  const handleBrowseJobs = () => {
    navigate('/browse-jobs');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CandidateNav 
        fullName={userData.fullName} 
        unreadMessages={stats.unreadMessages} 
        onSignOut={handleSignOut} 
      />

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Welcome back, {userData.fullName || 'Candidate'}! 👋
                </h2>
                <p className="text-gray-500 mt-1">
                  {userData.profileCompletion < 100 
                    ? `Your profile is ${userData.profileCompletion}% complete. Complete it to increase your visibility.`
                    : "Your profile is complete! You're ready to start applying."}
                </p>
              </div>
              {userData.profileCompletion < 100 && (
                <div className="w-full md:w-64">
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gray-900 rounded-full transition-all duration-500"
                      style={{ width: `${userData.profileCompletion}%` }}
                    />
                  </div>
                  <div className="text-right text-sm font-semibold text-gray-900 mt-1">
                    {userData.profileCompletion}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Briefcase} value={stats.savedJobs} label="Saved Jobs" />
          <StatCard icon={FileText} value={stats.applications} label="Applications" />
          <StatCard icon={MessageSquare} value={stats.messages} label="Messages" />
          <StatCard icon={TrendingUp} value={stats.profileStrength} label="Profile Strength" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  CANDIDATE HOME
                </span>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">
                    {userData.isVerified ? 'Verified' : 'Profile Active'}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for your next career move?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {userData.profileViews > 0 
                  ? `Your profile is getting noticed! ${userData.profileViews} recruiters viewed your profile.`
                  : "Complete your profile to get noticed by recruiters."}
                Keep your information updated and explore new opportunities that match your skills.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Star size={16} className="text-gray-900" />
                  <span className="text-sm">Complete your profile to stand out</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <TrendingUp size={16} className="text-gray-900" />
                  <span className="text-sm">Apply to jobs that match your skills</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBrowseJobs}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
                >
                  <Search size={18} />
                  Browse Jobs
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <FileText size={18} />
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">Profile Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  userData.isVerified 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {userData.isVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className={userData.fullName ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm text-gray-700">Basic Information</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className="text-gray-300" />
                  <span className="text-sm text-gray-700">Work Experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className={userData.profileCompletion >= 85 ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm text-gray-700">Skills & Certifications</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                        {activity.type === 'application' && <Briefcase size={14} />}
                        {activity.type === 'message' && <MessageSquare size={14} />}
                        {activity.type === 'profile' && <TrendingUp size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No recent activity</p>
                    <p className="text-xs text-gray-400 mt-1">Start applying to jobs!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <section>
          <div className="text-center mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">QUICK ACTIONS</h3>
            <p className="text-gray-500 mt-1">Get started with these common tasks</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon={BarChart3}
              title="Application Tracker"
              description="Monitor your application status and follow up with recruiters"
              onClick={() => navigate('/applications')}
            />
            <QuickActionCard
              icon={FileText}
              title="Update Resume"
              description="Keep your resume fresh and tailored to new opportunities"
              onClick={handleUpdateProfile}
            />
            <QuickActionCard
              icon={Calendar}
              title="Schedule Interview"
              description="Book interview slots and manage your calendar"
              onClick={() => navigate('/calendar')}
            />
            <QuickActionCard
              icon={HelpCircle}
              title="Help Center"
              description="Get quick answers or open a ticket with our support team"
              onClick={() => navigate('/help')}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <strong className="text-gray-900">CandidateHub</strong>
              <span className="text-gray-500 text-sm ml-2">© 2024 Engineered for Excellence.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition">LEGAL</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition">PRIVACY POLICY</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition">HELP CENTER</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition">CONTACT SUPPORT</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CandidateDashboard;