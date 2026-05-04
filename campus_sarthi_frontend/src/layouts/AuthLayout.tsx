import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#0B0B0B' }}
    >
      {/* Static radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,215,0,0.07) 0%, transparent 65%)',
        }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 110%, rgba(255,140,0,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="relative w-full max-w-md z-10">
        <Outlet />
      </div>
    </div>
  );
}
