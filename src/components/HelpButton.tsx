import { HelpCircle, MessageSquare, Keyboard, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { motion } from "motion/react";

interface HelpButtonProps {
  onShowShortcuts: () => void;
  onShowOnboarding: () => void;
}

export function HelpButton({ onShowShortcuts, onShowOnboarding }: HelpButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 right-6 z-30"
        >
          <Button
            size="icon"
            className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-br from-purple-500 to-blue-600 hover:shadow-xl transition-shadow"
          >
            <HelpCircle className="w-6 h-6" />
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-1">
          <p className="text-sm mb-4">Need help?</p>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-10 gap-3"
            onClick={onShowOnboarding}
          >
            <MessageSquare className="w-4 h-4" />
            Show tutorial
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-10 gap-3"
            onClick={onShowShortcuts}
          >
            <Keyboard className="w-4 h-4" />
            Keyboard shortcuts
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-10 gap-3"
          >
            <FileText className="w-4 h-4" />
            Documentation
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
