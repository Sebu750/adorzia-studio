import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: ReactNode;
<<<<<<< HEAD
  requireSuperadmin?: boolean;
}

export function AdminProtectedRoute({ 
  children, 
  requireSuperadmin = false 
}: AdminProtectedRouteProps) {
  const { user, loading, isAdmin, isSuperadmin, adminRole } = useAdminAuth();
  const location = useLocation();

  console.log('AdminProtectedRoute state:', { user: !!user, loading, isAdmin, isSuperadmin, adminRole });

=======
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, loading, isAdmin } = useAdminAuth();
  const location = useLocation();

>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-login-background))]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-login-button))]" />
          <p className="text-[hsl(var(--admin-login-text-muted))]">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to admin login
  if (!user) {
<<<<<<< HEAD
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Check for superadmin requirement if specified
  if (requireSuperadmin && !isSuperadmin) {
    console.log('Superadmin required but user is not superadmin');
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname, roleRequired: 'superadmin' }} replace />;
  }

  // Authenticated but not an admin - redirect to unauthorized
  if (!isAdmin) {
    console.log('User authenticated but not admin, redirecting to unauthorized');
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
  }

  console.log('Admin access granted');
=======
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Authenticated but not an admin - redirect to unauthorized
  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
  }

>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  return <>{children}</>;
}
