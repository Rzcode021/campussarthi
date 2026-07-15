import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center" style={{ background: '#0B0B0B' }}>
      <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full" />
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
