import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, Shield } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, user, isAdmin, loading } = useAdminAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin");
    }
  }, [loading, user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = loginSchema.parse(formData);
      const { error } = await signIn(validated.email, validated.password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message === "Invalid login credentials" 
            ? "Invalid email or password."
            : error.message,
          variant: "destructive",
        });
      } else {
        // Check if user has admin role - this will be verified by the auth context
        toast({ title: "Checking admin access..." });
        
        // Give time for role check
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-login-background))] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[hsl(var(--admin-login-button))] flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-[hsl(var(--admin-login-button-foreground))]" />
            </div>
            <div className="text-left">
              <span className="font-display text-2xl font-bold text-[hsl(var(--admin-login-text))] block">
                Adorzia
              </span>
              <span className="text-[hsl(var(--admin-login-text-muted))] text-sm">Admin Portal</span>
            </div>
          </div>
        </div>

        <Card className="bg-[hsl(var(--admin-login-card))] border-[hsl(var(--admin-login-card-border))] shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-[hsl(var(--admin-login-text))]">Admin Login</CardTitle>
            <CardDescription className="text-[hsl(var(--admin-login-text-muted))]">
              Sign in with your admin credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(var(--admin-login-text))]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-login-text-muted))]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@adorzia.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-[hsl(var(--admin-login-input-bg))] border-[hsl(var(--admin-login-input-border))] text-[hsl(var(--admin-login-text))] placeholder:text-[hsl(var(--admin-login-text-muted))]/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[hsl(var(--admin-login-text))]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-login-text-muted))]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-[hsl(var(--admin-login-input-bg))] border-[hsl(var(--admin-login-input-border))] text-[hsl(var(--admin-login-text))] placeholder:text-[hsl(var(--admin-login-text-muted))]/60"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[hsl(var(--admin-login-button))] hover:bg-[hsl(var(--admin-login-button))]/90 text-[hsl(var(--admin-login-button-foreground))]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="text-center pt-6">
              <Link 
                to="/auth" 
                className="text-sm text-[hsl(var(--admin-login-text-muted))] hover:text-[hsl(var(--admin-login-text))] transition-colors"
              >
                ← Designer Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[hsl(var(--admin-login-text-muted))]/70">
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  );
}
