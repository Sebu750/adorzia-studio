import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Box, FolderOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function WelcomeModal({ isOpen, onClose, userName }: WelcomeModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      title: `Welcome to Adorzia${userName ? `, ${userName}` : ""}!`,
      description:
        "You've just joined an exclusive community of talented designers. Let's get you started on your creative journey.",
      action: "Get Started",
    },
    {
      icon: BookOpen,
      title: "Start with Walkthroughs",
      description:
        "Complete guided walkthroughs to learn the platform, build your skills, and earn XP to climb the ranks.",
      action: "Next",
    },
    {
      icon: Box,
      title: "Take on Styleboxes",
      description:
        "Compete in design challenges, showcase your creativity, and get your work featured on the marketplace.",
      action: "Next",
    },
    {
      icon: FolderOpen,
      title: "Build Your Portfolio",
      description:
        "Your best work gets published to the marketplace where you earn revenue from every sale. Ready to begin?",
      action: "Let's Go!",
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
      navigate("/walkthroughs");
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center">
            <Icon className="h-8 w-8 text-background" />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle className="text-2xl">{currentStep.title}</DialogTitle>
            <DialogDescription className="text-base">
              {currentStep.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex justify-center gap-1.5 py-4">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                idx <= step ? "bg-accent" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleNext} className="gap-2">
            {currentStep.action}
            <ArrowRight className="h-4 w-4" />
          </Button>
          {step === 0 && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
