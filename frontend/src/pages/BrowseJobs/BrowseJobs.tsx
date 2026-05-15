import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, MapPin, Briefcase, FileText, HelpCircle, User, LogOut, Menu, X, BarChart3, Settings } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { fetchJobs } from "../../services/firebaseService";
import { useAuth } from "../../hooks/useAuth";

type Job = {
  id: string;
  title?: string;
  location?: string;
  jobType?: string;
  salary?: string;
  badge?: string;
  description?: string;
  department?: string;
};

type JobFilters = {
  department?: string;
  location?: string;
  jobType?: string;
};

const PAGE_SIZE = 6;

function BrowseJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [lastFetchedCount, setLastFetchedCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const navLinks = [
    { path: '/candidate-dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
    { path: '/browse-jobs', label: 'Browse Jobs', icon: <Search size={18} /> },
    { path: '/applications', label: 'Applications', icon: <FileText size={18} /> },
    { path: '/help', label: 'Help Center', icon: <HelpCircle size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/signin');
  };

  const canLoad = useMemo(() => !loading && isSignedIn, [loading, isSignedIn]);

  useEffect(() => {
    if (!canLoad) return;

    const load = async () => {
      setLoadingJobs(true);
      setError("");
      try {
        const { jobs } = await fetchJobs(filters, PAGE_SIZE, null);
        setAllJobs(jobs as Job[]);
        setLastFetchedCount((jobs as Job[]).length);
        setPage(1);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load jobs";
        setError(message);
        setAllJobs([]);
        setLastFetchedCount(0);
      } finally {
        setLoadingJobs(false);
      }
    };

    void load();
  }, [canLoad, filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false);
      }
    };
    if (showNotificationsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotificationsDropdown]);

  const normalizedSearch = useMemo(() => searchQuery.trim().toLowerCase(), [searchQuery]);

  const searchFilteredJobs = useMemo(() => {
    if (!normalizedSearch) return allJobs;
    return allJobs.filter((job) => {
      const haystack = [
        job.title,
        job.location,
        job.jobType,
        job.department,
        job.badge,
        job.description,
        job.salary,
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [allJobs, normalizedSearch]);

  useEffect(() => {
    setPage(1);
  }, [normalizedSearch]);

  const totalPages = Math.max(1, Math.ceil(searchFilteredJobs.length / PAGE_SIZE));
  const visibleJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return searchFilteredJobs.slice(start, start + PAGE_SIZE);
  }, [searchFilteredJobs, page]);

  const handleFindJobs = () => setPage(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar - Same as Candidate Dashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Briefcase className="w-7 h-7 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900">CandidateHub</h1>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">Notifications</p>
                    </div>
                    <ul className="p-2">
                      <li className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-600">
                        New job match found: Senior React Developer!
                      </li>
                      <li className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-600">
                        Your application for UX Designer has been reviewed.
                      </li>
                      <li className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-600">
                        System update: New features available.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Settings */}
              <Link to="/candidate-settings" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>

              {/* User Profile */}
              <Link to="/candidate-settings" className="hidden md:block">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-900">
                      {user?.email?.split('@')[0] || 'Candidate'}
                    </span>
                    <span className="text-xs text-gray-500">Candidate</span>
                  </div>
                </div>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                <LogOut size={18} />
                <span className="hidden md:inline font-medium">Sign Out</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(link.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            <Link
              to="/candidate-settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              <Settings size={18} />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Join the Future of Engineering</h1>
              <p className="text-gray-300 mb-6">Browse our current openings across globally distributed teams.</p>
              
              {/* Search Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="search"
                    placeholder="Search by title, keywords, or technology..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={filters.department ?? ""}
                  onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value || undefined }))}
                >
                  <option value="">Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Operations">Operations</option>
                </select>
                <button
                  type="button"
                  onClick={handleFindJobs}
                  className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Find Jobs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Summary */}
        <section className="mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {loadingJobs ? "LOADING..." : `SHOWING ${visibleJobs.length} OPEN POSITIONS`}
            </p>
            <p className="text-xs text-gray-400">
              Debug: Fetched jobs: <strong>{lastFetchedCount}</strong>
            </p>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm"><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* No Jobs State */}
        {allJobs.length === 0 && !loadingJobs && !error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800">No jobs found. Please check back later.</p>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleJobs.map((job) => (
            <article key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                    {job.badge ?? "🧠"}
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {job.badge ?? "GENERAL"}
                  </span>
                </div>
                <Link to={`/jobs/${job.id}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-gray-600 transition">
                    {job.title ?? "Untitled position"}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <MapPin size={14} />
                  <span>{job.location ?? "Location not set"}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{job.jobType ?? "Job type not set"}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {job.description || "No description available for this position."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">{job.salary ?? ""}</span>
                  <Link to={`/jobs/${job.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  page === num
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
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
}

export default BrowseJobs;