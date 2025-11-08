import { Users } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Collaborator {
  id: string;
  name: string;
  color: string;
  active: boolean;
}

interface CollaboratorAvatarsProps {
  collaborators: Collaborator[];
  onShare: () => void;
}

export function CollaboratorAvatars({ collaborators, onShare }: CollaboratorAvatarsProps) {
  const activeCollaborators = collaborators.filter(c => c.active);

  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <div className="flex -space-x-2">
          {activeCollaborators.slice(0, 3).map((collaborator, index) => (
            <Tooltip key={collaborator.id}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Avatar className="w-9 h-9 border-2 border-background cursor-pointer hover:z-10">
                    <AvatarFallback 
                      className="text-white text-xs"
                      style={{ background: collaborator.color }}
                    >
                      {collaborator.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{collaborator.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {activeCollaborators.length > 3 && (
            <Avatar className="w-9 h-9 border-2 border-background bg-muted">
              <AvatarFallback className="text-xs">
                +{activeCollaborators.length - 3}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </TooltipProvider>

      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        className="h-9 px-4 gap-2"
      >
        <Users className="w-4 h-4" />
        Share
      </Button>
    </div>
  );
}
