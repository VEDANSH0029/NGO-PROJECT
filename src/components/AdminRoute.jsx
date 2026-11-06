import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p>Verifying admin permissions...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}

