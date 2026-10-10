import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  User,
  FileUp,
  Users,
  Compass,
  Briefcase,
  Sparkles,
  ClipboardList,
  Building2,
  FileCheck2,
  Shield,
  Layers,
  Rss,
  UserCheck,
  Send,
} from 'lucide-react';

export default function Sidebar({ role }) {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/feed', label: 'Feed & Discussions', icon: Rss },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/student/resume', label: 'Resume & Skills', icon: FileUp },
    { to: '/internships', label: 'Browse Internships', icon: Briefcase },
    { to: '/student/recommendations', label: 'Recommended Internships', icon: Sparkles },
    { to: '/student/applications', label: 'My Applications', icon: ClipboardList },
    { to: '/student/network', label: 'Student Discovery', icon: Compass },
    { to: '/student/requests', label: 'Connection Requests', icon: UserCheck },
    { to: '/student/connections', label: 'My Connections', icon: Users },
  ];

  const companyLinks = [
    { to: '/company/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/company/internships', label: 'Manage Internships', icon: Briefcase },
    { to: '/company/applications', label: 'Review Applicants', icon: FileCheck2 },
    { to: '/feed', label: 'Community Feed', icon: Rss },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'System Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Registered Users', icon: Users },
    { to: '/admin/internships', label: 'All Internships', icon: Briefcase },
    { to: '/admin/applications', label: 'All Applications', icon: ClipboardList },
  ];

  const links = role === 'STUDENT' ? studentLinks : role === 'COMPANY' ? companyLinks : adminLinks;

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white py-6 hidden lg:block">
      {/* Profile quick block */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</h4>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
              {role}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4">
        <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
          Navigation
        </p>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/student/dashboard' || link.to === '/company/dashboard' || link.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
