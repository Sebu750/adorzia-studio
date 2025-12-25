import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Unauthorized() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.state?.attemptedPath?.startsWith('/admin');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            {user ? (
              isAdminRoute 
                ? "You don't have permission to access the admin panel. This area is restricted to administrators only."
                : "You don't have the required permissions to view this page."
            ) : (
              "You need to be logged in to access this page."
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button className="gap-2 w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" state={{ from: location.state?.attemptedPath }}>
                <Button className="gap-2 w-full sm:w-auto">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Error Code: 403 Forbidden
        </p>
      </div>
    </div>
  );
}
