import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Wallet, 
  User, 
  Calendar, 
  FileText, 
  Image,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit3,
  Upload,
  Check,
  X,
  Lock,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";

// Mock data for available branded styleboxes
const mockStyleboxes = [
  {
    id: 1,
    title: "Summer Collection Capsule",
    client: "Luxury Fashion House",
    budget: 2500,
    status: "available",
    deadline: "2024-03-15",
    category: "Apparel",
    difficulty: "Advanced",
    archetype: {
      silhouette: "A-line dress with empire waist",
      commercialLogic: "Mass production ready",
      anchorImage: ""
    },
    mutation: {
      concept: "Tropical paradise inspired",
      moodboards: ["moodboard1.jpg", "moodboard2.jpg"],
      creativeDirective: "Bright colors, flowing fabrics"
    },
    restrictions: {
      fabricLimits: "Natural fibers only",
      colorLimits: "Bright tropical colors",
      numericalTolerances: "±2mm precision"
    },
    manifestation: {
      masterPrompt: "Tropical paradise dress with flowing fabric and vibrant colors"
    },
    deliverables: {
      techPacks: true,
      sketches: true,
      grading: true,
      samplingInstructions: true
    }
  },
  {
    id: 2,
    title: "Corporate Business Attire",
    client: "Executive Wear Inc.",
    budget: 1800,
    status: "available",
    deadline: "2024-03-20",
    category: "Formal Wear",
    difficulty: "Intermediate",
    archetype: {
      silhouette: "Tailored blazer and trousers",
      commercialLogic: "Office wear ready",
      anchorImage: ""
    },
    mutation: {
      concept: "Modern minimalist",
      moodboards: ["moodboard3.jpg"],
      creativeDirective: "Clean lines, professional look"
    },
    restrictions: {
      fabricLimits: "Wool blends only",
      colorLimits: "Neutral tones",
      numericalTolerances: "±1mm precision"
    },
    manifestation: {
      masterPrompt: "Minimalist professional attire with clean lines"
    },
    deliverables: {
      techPacks: true,
      sketches: true,
      grading: false,
      samplingInstructions: true
    }
  },
  {
    id: 3,
    title: "Streetwear Collection",
    client: "Urban Fashion Co.",
    budget: 3200,
    status: "in-progress",
    deadline: "2024-03-10",
    category: "Streetwear",
    difficulty: "Advanced",
    archetype: {
      silhouette: "Oversized hoodie and joggers",
      commercialLogic: "Trend-driven",
      anchorImage: ""
    },
    mutation: {
      concept: "Retro-inspired street style",
      moodboards: ["moodboard4.jpg", "moodboard5.jpg"],
      creativeDirective: "Bold graphics, oversized fit"
    },
    restrictions: {
      fabricLimits: "Cotton and polyester blends",
      colorLimits: "Bold primary colors",
      numericalTolerances: "±3mm precision"
    },
    manifestation: {
      masterPrompt: "Retro-inspired streetwear with bold graphics"
    },
    deliverables: {
      techPacks: true,
      sketches: true,
      grading: true,
      samplingInstructions: false
    }
  },
  {
    id: 4,
    title: "Evening Gowns",
    client: "Haute Couture Atelier",
    budget: 5000,
    status: "completed",
    deadline: "2024-02-28",
    category: "Couture",
    difficulty: "Expert",
    archetype: {
      silhouette: "Floor-length ball gowns",
      commercialLogic: "Runway show ready",
      anchorImage: ""
    },
    mutation: {
      concept: "Vintage glamour revival",
      moodboards: ["moodboard6.jpg"],
      creativeDirective: "Luxurious fabrics, intricate details"
    },
    restrictions: {
      fabricLimits: "Silk, satin, lace",
      colorLimits: "Rich jewel tones",
      numericalTolerances: "±0.5mm precision"
    },
    manifestation: {
      masterPrompt: "Vintage glamour evening gowns with luxurious details"
    },
    deliverables: {
      techPacks: true,
      sketches: true,
      grading: true,
      samplingInstructions: true
    }
  }
];

const statusConfig = {
  available: { label: "Available", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Check },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle }
};

export default function BrandedStyleboxes() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { tier } = useSubscription();
  
  // Check access requirements
  const hasProSubscription = tier === 'pro' || tier === 'founder';
  const userRank = profile?.rank || 0;
  const meetsRankRequirement = userRank >= 3;
  const hasAccess = hasProSubscription && meetsRankRequirement;
  
  const [selectedStylebox, setSelectedStylebox] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');
  const [submissionStep, setSubmissionStep] = useState<number | null>(null);

  const availableStyleboxes = mockStyleboxes.filter(sb => sb.status === 'available');
  const myStyleboxes = mockStyleboxes.filter(sb => sb.status !== 'available');

  // If user doesn't meet requirements, show access restriction message
  if (!hasAccess) {
    return (
      <AppLayout>
        <div className="min-h-screen w-full relative overflow-hidden">
          {/* Full-screen background with subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-background/80">
            <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          </div>
          
          {/* Content container with z-index to appear above background */}
          <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
            <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
              <div className="mb-6 p-4 bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                <Lock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Branded StyleBoxes</h1>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                This feature is exclusively available to Pro subscribers with Rank 3 or higher.
              </p>
              
              <div className="bg-secondary/50 rounded-xl p-6 w-full">
                <h3 className="font-semibold mb-4 flex items-center justify-center">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Access Requirements
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                    <span>Pro Subscription</span>
                    <Badge variant={hasProSubscription ? "default" : "destructive"}> 
                      {hasProSubscription ? "✓ Active" : "✗ Required"}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                    <span>Minimum Rank 3</span>
                    <Badge variant={meetsRankRequirement ? "default" : "destructive"}>
                      {meetsRankRequirement ? `✓ Rank ${userRank}` : `✗ Rank ${userRank}/3`}
                    </Badge>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">Preview Mode Active</p>
                  <p className="text-xs text-muted-foreground mt-1">This is a preview of the upcoming feature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSelectStylebox = (id: number) => {
    setSelectedStylebox(id);
    setSubmissionStep(1);
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    const IconComponent = config.icon;
    return (
      <Badge className={cn("text-xs", config.color)}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Full-screen background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-background/80">
          <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        </div>
        
        {/* Content container with z-index to appear above background */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Coming Soon Overlay */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-destructive/10 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <Badge variant="destructive" className="mb-2">COMING SOON</Badge>
                <p className="text-sm text-muted-foreground">This feature is currently in development</p>
              </div>
            </div>
            
            {/* Page Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20"
            >
              <h1 className="text-3xl font-display font-bold tracking-tight">
                Branded StyleBoxes
              </h1>
              <p className="text-muted-foreground mt-2">
                Work on client-sponsored projects with guaranteed earnings
              </p>
              <p className="text-sm text-muted-foreground mt-1 italic">
                Preview of upcoming feature - not yet functional
              </p>
            </motion.div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted/50 p-1 rounded-lg w-fit">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Available Projects
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('my')}
          >
            My Projects
          </button>
        </div>

        {activeTab === 'available' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableStyleboxes.map((stylebox) => (
              <motion.div
                key={stylebox.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * stylebox.id }}
              >
                <Card className="h-full flex flex-col border-0 bg-gradient-to-b from-background to-muted/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{stylebox.title}</CardTitle>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{stylebox.client}</span>
                          </div>
                        </div>
                        {getStatusBadge(stylebox.status)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-sm">
                            <Wallet className="h-4 w-4 mr-1 text-emerald-500" />
                            <span className="font-semibold text-emerald-600">${stylebox.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(stylebox.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {stylebox.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {stylebox.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        Premium client project with guaranteed payment upon acceptance. Perfect for showcasing your expertise.
                      </p>
                      
                      <Button 
                        className="w-full bg-muted text-muted-foreground border-muted-foreground/30 cursor-not-allowed"
                        disabled
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details & Apply
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myStyleboxes.map((stylebox) => (
              <motion.div
                key={stylebox.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * stylebox.id }}
              >
                <Card className="h-full flex flex-col border-0 bg-gradient-to-b from-background to-muted/30 shadow-sm overflow-hidden">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{stylebox.title}</CardTitle>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{stylebox.client}</span>
                          </div>
                        </div>
                        {getStatusBadge(stylebox.status)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-sm">
                            <Wallet className="h-4 w-4 mr-1 text-emerald-500" />
                            <span className="font-semibold text-emerald-600">${stylebox.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(stylebox.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {stylebox.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {stylebox.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" 
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex-1 border-muted-foreground/30 text-muted-foreground cursor-not-allowed"
                          disabled
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-muted-foreground/30 text-muted-foreground cursor-not-allowed"
                          disabled
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div> {/* Close the content container div */}

        {/* Submission Modal */}
        {selectedStylebox !== null && submissionStep && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">
                    {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStylebox(null);
                      setSubmissionStep(null);
                    }}
                  >
                    Close
                  </Button>
                </div>

                {/* Steps Navigation */}
                <div className="flex items-center justify-center mb-8">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step <= submissionStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`h-0.5 w-16 ${
                            step < submissionStep ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {submissionStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Requirements Review</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Archetype
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Silhouette:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.archetype.silhouette}</p>
                          <p><span className="font-medium">Commercial Logic:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.archetype.commercialLogic}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Image className="h-4 w-4 mr-2" />
                          Mutation
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Concept:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.mutation.concept}</p>
                          <p><span className="font-medium">Creative Directive:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.mutation.creativeDirective}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Restrictions</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Fabric Limits:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.restrictions.fabricLimits}</p>
                          <p><span className="font-medium">Color Limits:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.restrictions.colorLimits}</p>
                          <p><span className="font-medium">Tolerances:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.restrictions.numericalTolerances}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Deliverables</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Tech Packs:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.deliverables.techPacks ? 'Yes' : 'No'}</p>
                          <p><span className="font-medium">Sketches:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.deliverables.sketches ? 'Yes' : 'No'}</p>
                          <p><span className="font-medium">Grading:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.deliverables.grading ? 'Yes' : 'No'}</p>
                          <p><span className="font-medium">Sampling Instructions:</span> {mockStyleboxes.find(sb => sb.id === selectedStylebox)?.deliverables.samplingInstructions ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        className="cursor-not-allowed"
                        disabled
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-muted text-muted-foreground border-muted-foreground/30 cursor-not-allowed"
                        disabled
                      >
                        Accept & Continue
                      </Button>
                    </div>
                  </div>
                )}

                {submissionStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Upload Deliverables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Tech Packs</h4>
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Click to upload tech pack files</p>
                            </div>
                            <input type="file" className="hidden" multiple />
                          </label>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Sketches & Designs</h4>
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Click to upload design sketches</p>
                            </div>
                            <input type="file" className="hidden" multiple />
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Mood Boards</h4>
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Upload mood boards</p>
                            </div>
                            <input type="file" className="hidden" multiple />
                          </label>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Additional Files</h4>
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Any additional files</p>
                            </div>
                            <input type="file" className="hidden" multiple />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        className="cursor-not-allowed"
                        disabled
                      >
                        Back
                      </Button>
                      <Button
                        className="bg-muted text-muted-foreground border-muted-foreground/30 cursor-not-allowed"
                        disabled
                      >
                        Continue to Review
                      </Button>
                    </div>
                  </div>
                )}

                {submissionStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Review & Submit</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Project Summary</h4>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">{mockStyleboxes.find(sb => sb.id === selectedStylebox)?.title}</p>
                                <p className="text-sm text-muted-foreground">{mockStyleboxes.find(sb => sb.id === selectedStylebox)?.client}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-emerald-600">${mockStyleboxes.find(sb => sb.id === selectedStylebox)?.budget.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Payment upon acceptance</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Files Uploaded</h4>
                        <Card>
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              <li className="flex items-center justify-between">
                                <span>Tech Pack.pdf</span>
                                <Check className="h-4 w-4 text-emerald-500" />
                              </li>
                              <li className="flex items-center justify-between">
                                <span>Design Sketches.zip</span>
                                <Check className="h-4 w-4 text-emerald-500" />
                              </li>
                              <li className="flex items-center justify-between">
                                <span>Mood Board.jpg</span>
                                <Check className="h-4 w-4 text-emerald-500" />
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Confirmation</h4>
                        <div className="flex items-start space-x-2">
                          <input type="checkbox" id="confirmation" className="mt-1" />
                          <label htmlFor="confirmation" className="text-sm text-muted-foreground">
                            I confirm that all deliverables meet the client's requirements and I understand that payment is contingent upon client acceptance.
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        className="cursor-not-allowed"
                        disabled
                      >
                        Back
                      </Button>
                      <Button
                        className="bg-muted text-muted-foreground border-muted-foreground/30 cursor-not-allowed"
                        disabled
                      >
                        Submit Project
                      </Button>
                    </div>
                  </div>
                )}

                {submissionStep === 4 && (
                  <div className="space-y-6 text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-display font-bold">Submission Successful!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your project has been submitted to the client. You will receive notification when they review your work.
                    </p>
                    <div className="bg-muted rounded-lg p-4 max-w-md mx-auto">
                      <p className="font-medium">Expected Response</p>
                      <p className="text-sm text-muted-foreground">Within 5-7 business days</p>
                    </div>
                    <Button
                      className="bg-muted text-muted-foreground border-muted-foreground/30 cursor-not-allowed mx-auto"
                      disabled
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>  {/* Close content container */}
    </div>    {/* Close outer background */}
   
    </AppLayout>
  );
}