import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if user came from a valid reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = passwordSchema.parse({ password, confirmPassword });
      
      const { error } = await supabase.auth.updateUser({
        password: validated.password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Password updated",
          description: "Your password has been successfully reset.",
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
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

  if (!isValidSession && !isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-3xl font-bold text-white">Adorzia</span>
            </Link>
          </div>

          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-display">Invalid or expired link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/forgot-password">
                <Button className="w-full bg-gradient-accent hover:opacity-90">
                  Request a new link
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white">Adorzia</span>
          </Link>
        </div>

        <Card className="bg-card/95 backdrop-blur border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-display">
              {isSuccess ? "Password updated!" : "Reset your password"}
            </CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Redirecting you to login..."
                : "Enter your new password below."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isSuccess ? (
              <div className="text-center space-y-6 py-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <Link to="/auth">
                  <Button className="w-full bg-gradient-accent hover:opacity-90">
                    Go to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-accent hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
