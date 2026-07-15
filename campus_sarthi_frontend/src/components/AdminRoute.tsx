import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center" style={{ background: '#0B0B0B' }}>
      <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin' && !user?.is_staff) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
