import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type AppRole = 'designer' | 'admin' | 'superadmin';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireRole?: AppRole;
  allowRoles?: AppRole[];
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireRole,
  allowRoles 
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isDesigner, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to appropriate login
  if (!user) {
    const loginPath = requireAdmin || location.pathname.startsWith('/admin') ? '/admin/login' : '/auth';
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  // Check for admin requirement (backwards compatibility)
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
  }

  // Check for specific role requirement
  if (requireRole) {
    const hasRole = 
      requireRole === 'designer' ? (isDesigner || isAdmin) :
      requireRole === 'admin' ? isAdmin :
      requireRole === 'superadmin' ? userRole === 'superadmin' :
      false;
    
    if (!hasRole) {
      return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
    }
  }

  // Check for allowed roles list
  if (allowRoles && allowRoles.length > 0) {
    const hasAllowedRole = allowRoles.some(role => {
      if (role === 'designer') return isDesigner || isAdmin;
      if (role === 'admin') return isAdmin;
      if (role === 'superadmin') return userRole === 'superadmin';
      return false;
    });
    
    if (!hasAllowedRole) {
      return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
}
