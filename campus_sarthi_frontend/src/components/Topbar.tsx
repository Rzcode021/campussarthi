import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/companies': 'Companies',
  '/study-materials': 'Study Materials',
  '/resources': 'Resources',
  '/news': 'News & Updates',
  '/attire': 'Attire Guide',
  '/crew-rating': 'Crew Rating',
  '/profile': 'My Profile',
  '/admin': 'Admin Panel',
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Campus Sarthi';
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="h-14 glass border-b border-border flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10">
      <h2 className="font-semibold text-heading text-base">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 text-muted hover:text-body hover:bg-surface rounded-lg transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        
        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-semibold text-xs flex items-center justify-center border border-primary/10">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-heading leading-none">{user?.full_name}</p>
            <p className="text-[10px] text-muted mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="p-2 text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 group"
          title="Logout"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-medium hidden lg:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
