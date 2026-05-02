import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin' && !user?.is_staff) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
