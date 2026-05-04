import { memo } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard':      'Dashboard',
  '/companies':      'Companies',
  '/study-materials':'Study Materials',
  '/resources':      'Resources',
  '/news':           'News & Updates',
  '/attire':         'Attire Guide',
  '/crew-rating':    'Crew Rating',
  '/profile':        'My Profile',
  '/admin':          'Admin Panel',
  '/my-uploads':     'My Uploads',
};

export default memo(function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Campus Sarthi';
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center justify-between"
      style={{
        left: '16rem',          /* exactly matches sidebar w-64 */
        height: '3.5rem',       /* h-14 = 56px */
        padding: '0 1.5rem',    /* px-6 */
        background: 'rgba(10,14,26,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid #1E2A45',
      }}
    >
      {/* Page title */}
      <h2
        className="font-bold text-sm tracking-wide"
        style={{ color: '#F1F5F9' }}
      >
        {title}
      </h2>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg relative transition-colors duration-150"
          style={{ color: '#475569' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLElement).style.color = '#94A3B8';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#475569';
          }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#6366F1', boxShadow: '0 0 5px rgba(99,102,241,0.9)' }}
          />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: '#1E2A45', flexShrink: 0 }} />

        {/* User info */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}
          >
            {initials}
          </div>
          <div className="hidden md:block leading-none">
            <p className="text-xs font-semibold" style={{ color: '#F1F5F9' }}>
              {user?.full_name}
            </p>
            <p className="text-[10px] capitalize mt-0.5" style={{ color: '#475569' }}>
              {user?.role}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: '#1E2A45', flexShrink: 0 }} />

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{ color: '#475569' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#EF4444';
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#475569';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
          title="Logout"
        >
          <LogOut size={14} />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </header>
  );
});
