import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CustomerProtectedRouteProps {
  children: React.ReactNode;
  allowGuest?: boolean;
}

export function CustomerProtectedRoute({ 
  children, 
  allowGuest = false 
}: CustomerProtectedRouteProps) {
  const { user, loading, isCustomer, isDesigner, isAdmin } = useAuth();
  const location = useLocation();

  console.log('CustomerProtectedRoute state:', { 
    user: !!user, 
    loading, 
    isCustomer, 
    isDesigner, 
    isAdmin,
    allowGuest,
    path: location.pathname 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your account...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to customer login
  if (!user) {
    // If guest access is allowed, show a prompt to login but still allow access
    if (allowGuest) {
      return (
        <>
          <GuestPromptBanner />
          {children}
        </>
      );
    }

    return (
      <Navigate 
        to="/shop/auth" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Authenticated but not a customer (designer or admin trying to access customer area)
  if (!isCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-foreground">
              Designer Account
            </h1>
            <p className="text-muted-foreground">
              This area is for shoppers only. As a designer, you have access to your 
              studio dashboard instead.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                Go to Studio Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/shop">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Customer access granted
  return <>{children}</>;
}

/**
 * Banner shown to guests on protected pages that allow guest access
 */
function GuestPromptBanner() {
  return (
    <div className="bg-primary/5 border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            You're browsing as a guest. Create an account to save your items and track orders.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/shop/auth" state={{ from: window.location.pathname }}>
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/shop/auth?tab=signup" state={{ from: window.location.pathname }}>
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if current user can access customer routes
 * Returns { canAccess, isLoading, redirectTo }
 */
export function useCustomerAccess(allowGuest = false) {
  const { user, loading, isCustomer } = useAuth();
  const location = useLocation();

  if (loading) {
    return { canAccess: false, isLoading: true, redirectTo: null };
  }

  if (!user && !allowGuest) {
    return { 
      canAccess: false, 
      isLoading: false, 
      redirectTo: `/shop/auth?from=${encodeURIComponent(location.pathname)}` 
    };
  }

  if (user && !isCustomer) {
    return { 
      canAccess: false, 
      isLoading: false, 
      redirectTo: '/dashboard' 
    };
  }

  return { canAccess: true, isLoading: false, redirectTo: null };
}
