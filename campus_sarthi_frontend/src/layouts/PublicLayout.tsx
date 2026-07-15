import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicLayout — used for pages accessible without login (Events, Crew Rating).
 * Shows a minimal top bar with logo + optional dashboard link if logged in.
 */
export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#0B0B0B' }}>
      {/* Minimal top nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(11,11,11,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold" style={{ color: '#FFD700', letterSpacing: '-0.02em' }}>
            Campus<span className="text-white">Sarthi</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="text-sm font-semibold px-4 py-2 rounded-xl border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-all"
            >
              Dashboard →
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold px-4 py-2 rounded-xl border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
