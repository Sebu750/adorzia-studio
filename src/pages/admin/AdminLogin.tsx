import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
  const { signIn, user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Redirect if already logged in as admin
  if (user && isAdmin) {
    navigate("/admin");
    return null;
  }

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
    <div className="min-h-screen bg-admin-coffee flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-admin-wine flex items-center justify-center">
              <Shield className="h-6 w-6 text-admin-wine-foreground" />
            </div>
            <div className="text-left">
              <span className="font-display text-2xl font-bold text-admin-wine-foreground block">
                Adorzia
              </span>
              <span className="text-admin-apricot/70 text-sm">Admin Portal</span>
            </div>
          </div>
        </div>

        <Card className="bg-admin-chocolate/50 border-admin-chocolate backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-admin-wine-foreground">Admin Login</CardTitle>
            <CardDescription className="text-admin-apricot/70">
              Sign in with your admin credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-admin-apricot">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-apricot/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@adorzia.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-admin-coffee border-admin-chocolate text-admin-wine-foreground placeholder:text-admin-apricot/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-admin-apricot">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-apricot/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-admin-coffee border-admin-chocolate text-admin-wine-foreground placeholder:text-admin-apricot/40"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-admin-wine hover:bg-admin-wine/90 text-admin-wine-foreground"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="text-center pt-6">
              <Link 
                to="/auth" 
                className="text-sm text-admin-apricot/70 hover:text-admin-apricot transition-colors"
              >
                ← Designer Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-admin-apricot/50">
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  );
}
