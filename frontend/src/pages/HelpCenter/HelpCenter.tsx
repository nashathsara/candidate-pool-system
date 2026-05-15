import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, FileText, HelpCircle, Bell, Search, Settings, LogOut } from 'lucide-react';
import './HelpCenter.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  link: string;
}

interface HelpArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
}

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSignOut = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/signin');
  };

  const helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: '🚀',
      description: 'Learn the basics and get up and running',
      link: '#getting-started',
    },
    {
      id: 'duplicates',
      name: 'Duplicate Profiles',
      icon: '👥',
      description: 'Understand and resolve duplicate profile issues',
      link: '#duplicates',
    },
    {
      id: 'account',
      name: 'Account & Settings',
      icon: '⚙️',
      description: 'Manage your profile and account preferences',
      link: '#account',
    },
    {
      id: 'tickets',
      name: 'Support Tickets',
      icon: '🎫',
      description: 'Track and manage your support requests',
      link: '#tickets',
    },
    {
      id: 'jobs',
      name: 'Job Applications',
      icon: '💼',
      description: 'Browse and apply for available positions',
      link: '#jobs',
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: '🔧',
      description: 'Common issues and solutions',
      link: '#troubleshooting',
    },
  ];

  const popularSearches = [
    'Reset password',
    'Duplicate profile merge',
    'Application status',
    'Update personal details',
  ];

  const topArticles = [
    {
      id: 1,
      title: 'How to restore access to a locked account',
      description:
        'Step-by-step guide for account recovery and email verification.',
      url: '#account',
      category: 'account',
    },
    {
      id: 2,
      title: 'Resolving duplicate profiles in CandidateHub',
      description:
        'Learn how to merge duplicate records and keep your applications intact.',
      url: '#duplicates',
      category: 'duplicates',
    },
    {
      id: 3,
      title: 'Tracking your support ticket status',
      description:
        'Understand the ticket workflow and know when to expect updates.',
      url: '/ticket-success',
      category: 'tickets',
    },
    {
      id: 4,
      title: 'Preparing a winning job application',
      description:
        'Tips for completing your profile and submitting applications with confidence.',
      url: '#jobs',
      category: 'jobs',
    },
  ];

  const categoryArticles: HelpArticle[] = [
    {
      id: 11,
      title: 'Getting started with CandidateHub',
      description: 'Create your first profile and navigate the dashboard with confidence.',
      url: '#getting-started',
      category: 'getting-started',
    },
    {
      id: 12,
      title: 'Best practices for completing your profile',
      description: 'How to build a strong candidate profile that attracts recruiters.',
      url: '#getting-started',
      category: 'getting-started',
    },
    {
      id: 21,
      title: 'Duplicate profile merge guide',
      description: 'A complete walkthrough for identifying and merging duplicate profiles.',
      url: '#duplicates',
      category: 'duplicates',
    },
    {
      id: 22,
      title: 'What happens after duplicate resolution?',
      description: 'Learn what changes after your profiles are merged and archived.',
      url: '#duplicates',
      category: 'duplicates',
    },
    {
      id: 31,
      title: 'Update your email and account settings',
      description: 'Keep your profile information current and secure.',
      url: '#account',
      category: 'account',
    },
    {
      id: 32,
      title: 'Changing notification preferences',
      description: 'Manage alerts and email preferences for your account.',
      url: '#account',
      category: 'account',
    },
    {
      id: 41,
      title: 'Support ticket status explained',
      description: 'Understand each stage of the support ticket workflow.',
      url: '/ticket-success',
      category: 'tickets',
    },
    {
      id: 42,
      title: 'How to submit an effective support request',
      description: 'Tips for giving the right details so your ticket gets resolved faster.',
      url: '/ticket-success',
      category: 'tickets',
    },
    {
      id: 51,
      title: 'How to apply for jobs faster',
      description: 'Use saved preferences and smart filters to submit more applications.',
      url: '#jobs',
      category: 'jobs',
    },
    {
      id: 52,
      title: 'Improving your interview chances',
      description: 'Make your application stand out with better profile and resume tips.',
      url: '#jobs',
      category: 'jobs',
    },
    {
      id: 61,
      title: 'Troubleshooting login issues',
      description: 'Find fixes for common sign-in and account access problems.',
      url: '#troubleshooting',
      category: 'troubleshooting',
    },
    {
      id: 62,
      title: 'Fixing profile sync errors',
      description: 'What to do when your profile updates don’t appear immediately.',
      url: '#troubleshooting',
      category: 'troubleshooting',
    },
  ];

  const faqData: FAQItem[] = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create an account?',
      answer:
        'To create an account, click on the "Sign In" button and select "Create New Account". Fill in your email address and create a secure password. You\'ll receive a verification email to confirm your account.',
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'How do I verify my email?',
      answer:
        'After signing up, check your email inbox for a verification link. Click on the link to verify your email address. If you don\'t see the email, check your spam folder or request a new verification email.',
    },
    {
      id: 3,
      category: 'duplicates',
      question: 'What is a duplicate profile?',
      answer:
        'A duplicate profile occurs when you have multiple accounts with similar information in our system. This can happen if you apply multiple times or if your information was imported from different sources. Our system helps identify and merge these profiles.',
    },
    {
      id: 4,
      category: 'account',
      question: 'How do I update my profile information?',
      answer:
        'Go to your profile page by clicking on your name in the top navigation. Click "Edit Profile" to update your personal information, resume, and preferences. Remember to save your changes.',
    },
    {
      id: 5,
      category: 'jobs',
      question: 'How do I apply for a job?',
      answer:
        'Browse available jobs in the "Browse Jobs" section. Click on a job listing to view details. Click the "Apply" button to submit your application. Make sure your profile is complete before applying.',
    },
    {
      id: 6,
      category: 'troubleshooting',
      question: 'I forgot my password. What should I do?',
      answer:
        'Click "Forgot Password?" on the login page. Enter your email address and click "Send Reset Link". Check your email for a password reset link. Click the link and create a new password.',
    },
  ];

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const activeCategoryData = helpCategories.find((c) => c.id === activeCategory);
  const activeCategoryArticles = activeCategory
    ? categoryArticles.filter((article) => article.category === activeCategory)
    : [];

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="browse-page">
      <header className="browse-header">
        <div className="header-left">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={28} />
            <h1 className="logo">CandidateHub</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <Link to="/candidate-dashboard" className="nav-link">
            <Briefcase size={18} />
            Dashboard
          </Link>
          <Link to="/browse" className="nav-link">
            <Search size={18} />
            Browse Jobs
          </Link>
          <Link to="/applications" className="nav-link">
            <FileText size={18} />
            Applications
          </Link>
          <Link to="/help" className="nav-link active">
            <HelpCircle size={18} />
            Help Center
          </Link>
        </nav>

        <div className="header-right">
          <div className="notifications">
            <Bell className="notification-bell" size={20} />
            <span className="notification-badge">3</span>
          </div>
          <Link to="/settings" className="icon-btn" aria-label="Settings">
            <Settings size={18} />
          </Link>
          <Link to="/candidate-dashboard" className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Candidate</span>
            </div>
          </Link>
          <button 
            type="button" 
            className="signout-btn"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="help-content">
        {/* Header */}
        <div className="help-header">
          <h1>Help Center</h1>
          <p>Find answers to your questions and get support</p>
        </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for help articles, FAQs, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search help articles"
          />
        </div>
        <div className="search-tags">
          <span>Popular searches:</span>
          {popularSearches.map((search) => (
            <button
              key={search}
              type="button"
              className="tag-btn"
              onClick={() => setSearchQuery(search)}
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Help Categories */}
      <div className="categories-section">
        <div className="category-header">
          <div>
            <h2>Browse by Category</h2>
            <p>Filter FAQs and articles by topic to get answers faster.</p>
          </div>
          <button
            type="button"
            className="clear-filter-btn"
            onClick={() => setActiveCategory(null)}
          >
            {activeCategory ? 'Clear Filter' : 'Show All'}
          </button>
        </div>
        <div className="categories-grid">
          {helpCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-action">
                {activeCategory === category.id ? 'Viewing' : 'Filter'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Articles */}
      <div className="top-articles-section">
        <div className="section-title">
          <h2>{activeCategoryData ? `${activeCategoryData.name} articles` : 'Suggested articles'}</h2>
          <p>
            {activeCategoryData
              ? `Helpful guides for ${activeCategoryData.name.toLowerCase()} support.`
              : 'Helpful resources picked for the most common questions.'}
          </p>
        </div>
        <div className="top-articles-grid">
          {(activeCategoryData ? activeCategoryArticles : topArticles).map((article) => (
            <a key={article.id} href={article.url} className="article-card">
              <span className="article-badge">Top</span>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>
          {activeCategory
            ? `${helpCategories.find((c) => c.id === activeCategory)?.name} FAQs`
            : 'Frequently Asked Questions'}
        </h2>
        {activeCategory && (
          <button
            className="clear-filter-btn"
            onClick={() => setActiveCategory(null)}
          >
            ✕ Clear Filter
          </button>
        )}

        <div className="faq-list">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item) => (
              <div key={item.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(item.id)}
                >
                  <span className="faq-icon">
                    {expandedFAQ === item.id ? '−' : '+'}
                  </span>
                  <span>{item.question}</span>
                </button>
                {expandedFAQ === item.id && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>😕 No results found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="contact-support-section">
        <div className="support-wrapper">
          <div className="support-header-panel">
            <span className="support-label">Need help now?</span>
            <h2>Reach our support team instantly</h2>
            <p>Can't find an answer here? Choose the fastest way to get help from our support team.</p>
            <button
              className="btn-contact-support"
              onClick={() => window.location.assign('/ticket-success')}
              type="button"
            >
              📝 Submit a Ticket
            </button>
          </div>

          <div className="support-options-grid">
            <div className="support-option-card email-card">
              <div className="support-option-icon">📧</div>
              <div className="support-option-body">
                <h4>Email Support</h4>
                <p className="support-detail">support@candidatehub.com</p>
                <p className="support-time">Typical response within 24 hours</p>
              </div>
            </div>
            <div className="support-option-card chat-card">
              <div className="support-option-icon">💬</div>
              <div className="support-option-body">
                <h4>Live Chat</h4>
                <p className="support-detail">Available Monday - Friday</p>
                <p className="support-time">9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
            <div className="support-option-card phone-card">
              <div className="support-option-icon">📱</div>
              <div className="support-option-body">
                <h4>Phone Support</h4>
                <p className="support-detail">1-800-CAND-HUB</p>
                <p className="support-time">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="resources-section">
        <h2>Additional Resources</h2>
        <div className="resources-grid">
          <a href="#documentation" className="resource-card">
            <span className="resource-icon">📚</span>
            <h4>Documentation</h4>
            <p>Detailed guides and tutorials</p>
          </a>
          <a href="#video-tutorials" className="resource-card">
            <span className="resource-icon">🎥</span>
            <h4>Video Tutorials</h4>
            <p>Watch step-by-step guides</p>
          </a>
          <a href="#community-forum" className="resource-card">
            <span className="resource-icon">👥</span>
            <h4>Community Forum</h4>
            <p>Connect with other users</p>
          </a>
          <a href="#status-page" className="resource-card">
            <span className="resource-icon">📊</span>
            <h4>System Status</h4>
            <p>Check service availability</p>
          </a>
        </div>
      </div>

      {/* Footer */}
        <div className="help-footer">
          <p>Last updated: May 11, 2024</p>
          <p>Can't find the answer? <a href="#contact">Contact us</a></p>
        </div>
      </main>
    </div>
  );
};

export default HelpCenter;