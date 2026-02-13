import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useFounderPurchase } from '@/hooks/useFounderPurchase';
import FounderTierSelector from '../founder/FounderTierSelector';
import { toast } from 'sonner';

interface SignupFormData {
  email: string;
  password: string;
  name: string;
  category: string;
  bio?: string;
  skills?: string[];
}

const SignupWithFounderTiers: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    name: '',
    category: 'fashion',
    bio: '',
    skills: [],
  });
  const [selectedTier, setSelectedTier] = useState<'standard' | 'f1' | 'f2'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const { purchaseFounderTier, loading: purchaseLoading } = useFounderPurchase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sign up the user first
      const { error: signupError } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.category,
        formData.bio,
        formData.skills
      );

      if (signupError) {
        toast.error(`Signup failed: ${signupError.message}`);
        return;
      }

      // If user selected a paid tier, redirect to payment
      if (selectedTier !== 'standard') {
        const purchaseResult = await purchaseFounderTier(selectedTier);
        if (!purchaseResult.success) {
          toast.error(`Payment setup failed: ${purchaseResult.error}`);
        }
      } else {
        // For standard tier, show success message
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId as 'standard' | 'f1' | 'f2');
  };

  const handlePurchaseTier = async (tierId: string) => {
    // If user is not logged in yet, we need to first create the account with standard tier
    // and then process the payment
    if (!formData.email || !formData.password || !formData.name) {
      toast.error('Please fill in your account details first');
      return;
    }

    // Create the account first
    const { error: signupError } = await signUp(
      formData.email,
      formData.password,
      formData.name,
      formData.category,
      formData.bio,
      formData.skills
    );

    if (signupError) {
      toast.error(`Signup failed: ${signupError.message}`);
      return;
    }

    // Then process the payment
    const purchaseResult = await purchaseFounderTier(tierId);
    if (!purchaseResult.success) {
      toast.error(`Payment failed: ${purchaseResult.error}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Your Designer Account</CardTitle>
          <CardDescription>
            Join Adorzia as a founding member and unlock exclusive benefits
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Design Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion Design</SelectItem>
                      <SelectItem value="textile">Textile Design</SelectItem>
                      <SelectItem value="jewelry">Jewelry Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills?.join(', ') || ''}
                    onChange={handleSkillsChange}
                    placeholder="e.g., pattern-making, 3D modeling, textile innovation"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your design background and interests"
                    rows={4}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Founder Tier Selection</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your lifetime membership tier. You can always upgrade later!
                  </p>
                  
                  <FounderTierSelector
                    selectedTier={selectedTier}
                    onSelectTier={handleTierSelect}
                    onPurchase={handlePurchaseTier}
                    loading={purchaseLoading}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isSubmitting || purchaseLoading}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupWithFounderTiers;