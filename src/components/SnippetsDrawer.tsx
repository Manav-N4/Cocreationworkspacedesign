import { useState } from "react";
import { X, Search, Tag, Copy, Trash2, Plus, BookmarkPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

export interface Snippet {
  id: string;
  content: string;
  tags: string[];
  date: string;
}

interface SnippetsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snippets: Snippet[];
  onAddSnippet: (snippet: Snippet) => void;
  onDeleteSnippet: (id: string) => void;
}

export function SnippetsDrawer({
  isOpen,
  onClose,
  snippets,
  onAddSnippet,
  onDeleteSnippet
}: SnippetsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(snippets.flatMap(s => s.tags)));

  // Filter snippets
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || snippet.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookmarkPlus className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg text-foreground">My Snippets</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search & Filter */}
            <div className="px-6 py-4 space-y-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search snippets..."
                  className="pl-9 h-10"
                />
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(null)}
                    className="h-8 px-3"
                  >
                    All
                  </Button>
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                      className="h-8 px-3 gap-1.5"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Snippets List */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-3">
                {filteredSnippets.length === 0 ? (
                  <div className="text-center py-16">
                    <BookmarkPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {snippets.length === 0
                        ? "No snippets saved yet"
                        : "No matching snippets"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Hover over AI messages and click "Save" to create snippets
                    </p>
                  </div>
                ) : (
                  filteredSnippets.map(snippet => (
                    <motion.div
                      key={snippet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="p-4 rounded-lg border border-border bg-card hover:border-purple-500/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-xs text-muted-foreground">
                          {new Date(snippet.date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopy(snippet.content)}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => onDeleteSnippet(snippet.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3 mb-3">
                        {snippet.content}
                      </p>
                      {snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {snippet.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
