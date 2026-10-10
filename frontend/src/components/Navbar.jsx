import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Briefcase,
  Users,
  Compass,
  FileText,
  BookmarkCheck,
  Building2,
  Shield,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 text-slate-900 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg shadow-xs">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Career<span className="text-blue-600">Connect</span>
          </span>
        </Link>

        {/* Zone 2: Nav Links (Role-specific or Public) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {!isAuthenticated && (
            <>
              <Link
                to="/"
                className={`transition-colors whitespace-nowrap ${isActive('/') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Home
              </Link>
              <Link
                to="/internships"
                className={`transition-colors whitespace-nowrap ${isActive('/internships') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Browse Internships
              </Link>
            </>
          )}

          {isAuthenticated && role === 'STUDENT' && (
            <>
              <Link
                to="/student/dashboard"
                className={`transition-colors whitespace-nowrap ${isActive('/student/dashboard') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/feed"
                className={`transition-colors whitespace-nowrap ${isActive('/feed') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Feed
              </Link>
              <Link
                to="/internships"
                className={`transition-colors whitespace-nowrap ${isActive('/internships') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Internships
              </Link>
              <Link
                to="/student/recommendations"
                className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${isActive('/student/recommendations') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                <Sparkles className="h-4 w-4 text-blue-500" />
                Recommendations
              </Link>
              <Link
                to="/student/network"
                className={`transition-colors whitespace-nowrap ${isActive('/student/network') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Network
              </Link>
            </>
          )}

          {isAuthenticated && role === 'COMPANY' && (
            <>
              <Link
                to="/company/dashboard"
                className={`transition-colors whitespace-nowrap ${isActive('/company/dashboard') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/company/internships"
                className={`transition-colors whitespace-nowrap ${isActive('/company/internships') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Manage Internships
              </Link>
              <Link
                to="/company/applications"
                className={`transition-colors whitespace-nowrap ${isActive('/company/applications') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Review Applicants
              </Link>
            </>
          )}

          {isAuthenticated && role === 'ADMIN' && (
            <>
              <Link
                to="/admin/dashboard"
                className={`transition-colors whitespace-nowrap ${isActive('/admin/dashboard') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className={`transition-colors whitespace-nowrap ${isActive('/admin/users') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Users
              </Link>
              <Link
                to="/admin/internships"
                className={`transition-colors whitespace-nowrap ${isActive('/admin/internships') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Internships
              </Link>
              <Link
                to="/admin/applications"
                className={`transition-colors whitespace-nowrap ${isActive('/admin/applications') ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'}`}
              >
                Applications
              </Link>
            </>
          )}
        </nav>

        {/* Zone 3: User controls / Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
                aria-expanded={profileDropdownOpen}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-semibold text-slate-900 leading-none truncate max-w-[120px]">{user?.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{role}</div>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg ring-1 ring-black/5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>

                  {role === 'STUDENT' && (
                    <>
                      <Link
                        to="/student/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/student/resume"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-slate-400" />
                        Upload Resume
                      </Link>
                      <Link
                        to="/student/applications"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <BookmarkCheck className="h-4 w-4 text-slate-400" />
                        My Applications
                      </Link>
                    </>
                  )}

                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                to="/internships"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Browse Internships
              </Link>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              {role === 'STUDENT' && (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/feed"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Feed
                  </Link>
                  <Link
                    to="/internships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Internships
                  </Link>
                  <Link
                    to="/student/recommendations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Recommendations
                  </Link>
                  <Link
                    to="/student/network"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Network
                  </Link>
                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/student/resume"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Upload Resume
                  </Link>
                  <Link
                    to="/student/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Applications
                  </Link>
                </>
              )}
              {role === 'COMPANY' && (
                <>
                  <Link
                    to="/company/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/company/internships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Manage Internships
                  </Link>
                  <Link
                    to="/company/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Review Applicants
                  </Link>
                </>
              )}
              {role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/internships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Internships
                  </Link>
                  <Link
                    to="/admin/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Applications
                  </Link>
                </>
              )}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 font-medium hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
