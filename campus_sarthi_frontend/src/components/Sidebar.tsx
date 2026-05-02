import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, BookOpen, Library,
  Newspaper, Shirt, Star, User, ShieldCheck, LogOut, FileText, Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Companies', path: '/companies', icon: <Building2 size={18} /> },
  { label: 'Study Materials', path: '/study-materials', icon: <FileText size={18} /> },
  { label: 'Resources', path: '/resources', icon: <Library size={18} /> },
  { label: 'News', path: '/news', icon: <Newspaper size={18} /> },
  { label: 'Attire Guide', path: '/attire', icon: <Shirt size={18} /> },
  { label: 'Crew Rating', path: '/crew-rating', icon: <Star size={18} /> },
  { label: 'Profile', path: '/profile', icon: <User size={18} /> },
];

const adminNav: NavItem[] = [
  { label: 'Admin Panel', path: '/admin', icon: <ShieldCheck size={18} /> },
  ...studentNav,
];

const crewNav: NavItem[] = [
  ...studentNav.slice(0, -1), // Exclude Profile from middle
  { label: 'My Uploads', path: '/my-uploads', icon: <Upload size={18} /> },
  studentNav[studentNav.length - 1], // Add Profile back
];

const adminFullNav: NavItem[] = [
  { label: 'Admin Panel', path: '/admin', icon: <ShieldCheck size={18} /> },
  ...studentNav.slice(0, -1),
  { label: 'My Uploads', path: '/my-uploads', icon: <Upload size={18} /> },
  studentNav[studentNav.length - 1],
];

const roleColors: Record<string, string> = {
  admin: 'bg-red-50 text-danger',
  crew: 'bg-yellow-50 text-warning',
  student: 'bg-primary-light text-primary',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  let nav = studentNav;
  if (user?.role === 'admin') nav = adminFullNav;
  else if (user?.role === 'crew') nav = crewNav;

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <aside className="w-64 h-screen bg-white border-r border-border flex flex-col flex-shrink-0 fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="px-6 py-8">
        <div
          className="cursor-pointer group"
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
              <span className="font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold text-heading tracking-tight">Campus Sarthi</h1>
          </div>
          <p className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">Placement Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary/5 text-primary font-semibold shadow-sm shadow-primary/5'
                  : 'text-muted hover:text-heading hover:bg-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-muted/60'}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-heading truncate">{user?.full_name}</p>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${roleColors[user?.role || 'student']}`}>
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
