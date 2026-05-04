import React, { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FileText, Library,
  Newspaper, Shirt, User, ShieldCheck, LogOut, Upload, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem { label: string; path: string; icon: React.ReactNode; }

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={17} /> },
  { label: 'Companies', path: '/companies', icon: <Building2 size={17} /> },
  { label: 'Study Materials', path: '/study-materials', icon: <FileText size={17} /> },
  { label: 'Resources', path: '/resources', icon: <Library size={17} /> },
  { label: 'News', path: '/news', icon: <Newspaper size={17} /> },
  { label: 'Attire Guide', path: '/attire', icon: <Shirt size={17} /> },
  { label: 'Profile', path: '/profile', icon: <User size={17} /> },
];

const adminFullNav: NavItem[] = [
  { label: 'Admin Panel', path: '/admin', icon: <ShieldCheck size={17} /> },
  ...studentNav.slice(0, -1),
  { label: 'My Uploads', path: '/my-uploads', icon: <Upload size={17} /> },
  studentNav[studentNav.length - 1],
];

const crewNav: NavItem[] = [
  ...studentNav.slice(0, -1),
  { label: 'My Uploads', path: '/my-uploads', icon: <Upload size={17} /> },
  studentNav[studentNav.length - 1],
];

const roleBadge: Record<string, { bg: string; color: string }> = {
  admin: { bg: 'rgba(239,68,68,0.15)', color: '#F87171' },
  crew:  { bg: 'rgba(245,158,11,0.15)', color: '#FCD34D' },
  student: { bg: 'rgba(99,102,241,0.15)', color: '#818CF8' },
};

const NavItem = memo(({ item }: { item: NavItem }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
        isActive
          ? 'text-white'
          : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
      }`
    }
    style={({ isActive }) =>
      isActive
        ? { background: 'rgba(99,102,241,0.15)', color: '#818CF8' }
        : {}
    }
  >
    {({ isActive }) => (
      <>
        <span
          className="flex-shrink-0 transition-transform duration-200"
          style={{ color: isActive ? '#818CF8' : undefined }}
        >
          {item.icon}
        </span>
        <span>{item.label}</span>
        {isActive && (
          <span
            className="absolute right-3 w-1.5 h-1.5 rounded-full"
            style={{ background: '#6366F1', boxShadow: '0 0 6px rgba(99,102,241,0.8)' }}
          />
        )}
      </>
    )}
  </NavLink>
));

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nav =
    user?.role === 'admin' ? adminFullNav :
    user?.role === 'crew'  ? crewNav :
    studentNav;

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const badge = roleBadge[user?.role || 'student'];

  return (
    <aside
      className="w-64 h-screen flex flex-col flex-shrink-0 fixed left-0 top-0 z-20 scrollbar-thin"
      style={{ background: '#0A0E1A', borderRight: '1px solid #1E2A45' }}
    >
      {/* Logo */}
      <div
        className="px-5 py-6 cursor-pointer"
        onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-heading leading-none">Campus Sarthi</p>
            <p className="text-[10px] mt-0.5 font-medium tracking-wider uppercase" style={{ color: '#334155' }}>
              Placement Portal
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1E2A45', margin: '0 16px' }} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin">
        {nav.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* User */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid #1E2A45' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #A855F7)',
              color: 'white',
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-heading truncate leading-none mb-1">
              {user?.full_name}
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
              style={{ background: badge.bg, color: badge.color }}
            >
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ color: '#475569' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#EF4444';
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#475569';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
