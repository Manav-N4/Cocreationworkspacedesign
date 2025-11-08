import { useState } from "react";
import { MessageSquare, Palette, Users, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: MessageSquare,
    title: "Start Creating",
    description: "Begin a conversation with AI to ideate, write, or design. Choose from different AI personas to match your creative needs.",
    highlight: "Chat with AI in natural language"
  },
  {
    icon: Palette,
    title: "Visualize on Whiteboard",
    description: "Switch to the whiteboard tab to draw, sketch, and create visual diagrams. Use AI Assist to generate ideas and structures automatically.",
    highlight: "Collaborative canvas workspace"
  },
  {
    icon: Users,
    title: "Collaborate & Share",
    description: "Invite team members to collaborate in real-time. Share sessions, leave comments, and work together seamlessly.",
    highlight: "Real-time team collaboration"
  }
];

export function OnboardingOverlay({ isOpen, onClose }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("gemini-cocreate-onboarding", "completed");
    onClose();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-background rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleComplete} className="h-9 w-9">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-8"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto">
                    <Icon className="w-12 h-12 text-white" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl">{step.title}</h2>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                      {step.description}
                    </p>
                  </div>

                  <div className="inline-block px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-purple-400">{step.highlight}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-border flex items-center justify-between">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === currentStep ? "bg-purple-500" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrev} className="h-10 px-5 gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
                <Button onClick={handleNext} className="bg-gradient-to-r from-purple-500 to-blue-600 h-10 px-6">
                  {currentStep === steps.length - 1 ? (
                    "Get Started"
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
