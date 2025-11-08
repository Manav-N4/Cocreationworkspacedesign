import { motion } from "motion/react";
import { Sparkles, Lightbulb, Pen, Palette, ArrowRight, Zap, Lock, Cloud } from "lucide-react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
  darkMode: boolean;
}

export function LandingPage({ onGetStarted, darkMode }: LandingPageProps) {
  const features = [
    {
      icon: Lightbulb,
      title: "Ideate",
      description: "Brainstorm innovative ideas with AI-powered suggestions and creative frameworks",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Pen,
      title: "Write",
      description: "Craft compelling content with intelligent writing assistance and style refinement",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Palette,
      title: "Design",
      description: "Create stunning visual concepts with design thinking and color theory guidance",
      gradient: "from-pink-500 to-pink-600"
    }
  ];

  const capabilities = [
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Interact with AI in a natural, conversational flow"
    },
    {
      icon: Cloud,
      title: "Session History",
      description: "Access all your previous conversations organized by time"
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Your creative work stays private and secure"
    }
  ];

  return (
    <div className={`min-h-screen bg-background text-foreground overflow-auto ${darkMode ? 'dark' : ''}`}>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl max-w-3xl mx-auto">
            Your AI Creative Partner
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gemini CoCreate brings together ideation, writing, and design in one seamless workspace. 
            Collaborate with AI to bring your creative vision to life.
          </p>

          <Button
            onClick={onGetStarted}
            size="lg"
            className="mt-8 bg-white text-black hover:bg-gray-100 rounded-full px-8"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Creative Modes Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-center mb-12">Three Modes of Creativity</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-8 hover:border-muted-foreground/20 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center space-y-12"
        >
          <h2>Simple & Intuitive</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                1
              </div>
              <h3>Start a Conversation</h3>
              <p className="text-muted-foreground">
                Type your creative challenge or idea into the chat
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                2
              </div>
              <h3>Collaborate with AI</h3>
              <p className="text-muted-foreground">
                Receive intelligent suggestions and iterate together
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center">
                3
              </div>
              <h3>Refine & Create</h3>
              <p className="text-muted-foreground">
                Polish your work and bring your vision to reality
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Capabilities Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-center mb-12">Powerful Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <capability.icon className="w-7 h-7 text-foreground" />
                </div>
                <h4>{capability.title}</h4>
                <p className="text-muted-foreground text-sm">
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center space-y-6 border border-border rounded-3xl p-12 bg-card"
        >
          <h2>Ready to Create?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join the future of human-AI collaboration. Start your first creative session today.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 rounded-full px-8"
          >
            Start Creating
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Gemini CoCreate. AI-powered creative collaboration.
          </p>
        </div>
      </div>
    </div>
  );
}