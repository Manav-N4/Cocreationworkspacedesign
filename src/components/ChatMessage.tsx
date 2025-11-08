import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, User, Copy, ThumbsUp, Heart, Lightbulb, Edit2, Reply, BookmarkPlus, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  timestamp?: string;
  onRefine?: () => void;
  onVariations?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onReply?: () => void;
  onSaveSnippet?: () => void;
  onAddComment?: () => void;
}

const reactionIcons = [
  { icon: ThumbsUp, label: "Like" },
  { icon: Heart, label: "Love" },
  { icon: Lightbulb, label: "Idea" },
];

export function ChatMessage({ 
  role, 
  content, 
  timestamp,
  onCopy,
  onEdit,
  onReply,
  onSaveSnippet,
  onAddComment
}: ChatMessageProps) {
  const isAI = role === "ai";
  const [reactions, setReactions] = useState<{ [key: string]: number }>({});
  const [showReplyThread, setShowReplyThread] = useState(false);

  const handleReaction = (label: string) => {
    setReactions(prev => ({
      ...prev,
      [label]: (prev[label] || 0) + 1
    }));
    toast.success(`Reacted with ${label}!`);
  };

  // Format timestamp
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Syntax highlighting for code blocks (simple approach)
  const renderContent = () => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add code block
      const language = match[1] || 'code';
      const code = match[2];
      parts.push(
        <div key={`code-${match.index}`} className="my-2">
          <div className="bg-muted rounded-t-lg px-3 py-1 text-xs text-muted-foreground border-b border-border">
            {language}
          </div>
          <pre className="bg-muted rounded-b-lg p-3 overflow-x-auto">
            <code className="text-sm">{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {content.substring(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-8 group"
    >
      <div className="flex gap-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
          {isAI ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          {/* Timestamp */}
          <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formattedTime}
          </div>

          {/* Content */}
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {renderContent()}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAI ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCopy}
                  className="h-8 px-3 gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSaveSnippet}
                  className="h-8 px-3 gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 px-3 gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowReplyThread(!showReplyThread);
                onReply?.();
              }}
              className="h-8 px-3 gap-1.5"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onAddComment}
              className="h-8 px-3 gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Comment
            </Button>

            {/* Reactions */}
            <div className="flex gap-1 ml-3">
              {reactionIcons.map(({ icon: Icon, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(label)}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Reaction counts */}
          {Object.keys(reactions).length > 0 && (
            <div className="flex gap-2 mt-2">
              {Object.entries(reactions).map(([label, count]) => {
                const Icon = reactionIcons.find(r => r.label === label)?.icon;
                return Icon ? (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted text-xs"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {count}
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Reply thread indicator */}
          {showReplyThread && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pl-4 border-l-2 border-purple-500/50 ml-2 py-2"
            >
              <p className="text-sm text-muted-foreground italic">
                Reply thread will appear here
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}