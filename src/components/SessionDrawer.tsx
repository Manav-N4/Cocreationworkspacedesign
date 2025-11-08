import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Lightbulb, Pen, Palette, Plus, MessageSquare, Trash2, Search, Star, Tag, CheckSquare, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import type { Mode } from "./ModeSelection";

interface Session {
  id: string;
  mode: Mode;
  title: string;
  date: string;
  favorite?: boolean;
  tags?: string[];
}

interface SessionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onToggleFavorite?: (sessionId: string) => void;
  onBulkDelete?: (sessionIds: string[]) => void;
  darkMode: boolean;
}

const getModeIcon = (mode: Mode) => {
  switch (mode) {
    case "idea": return Lightbulb;
    case "write": return Pen;
    case "design": return Palette;
  }
};

const groupSessionsByDate = (sessions: Session[]) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  const groups: { [key: string]: Session[] } = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Older: []
  };

  sessions.forEach(session => {
    const sessionDate = new Date(session.date).toDateString();
    const daysAgo = Math.floor((Date.now() - new Date(session.date).getTime()) / 86400000);

    if (sessionDate === today) {
      groups.Today.push(session);
    } else if (sessionDate === yesterday) {
      groups.Yesterday.push(session);
    } else if (daysAgo <= 7) {
      groups["Previous 7 Days"].push(session);
    } else if (daysAgo <= 30) {
      groups["Previous 30 Days"].push(session);
    } else {
      groups.Older.push(session);
    }
  });

  return Object.entries(groups).filter(([_, sessions]) => sessions.length > 0);
};

export function SessionDrawer({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onToggleFavorite,
  onBulkDelete,
  darkMode
}: SessionDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<Mode | "all">("all");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === "all" || session.mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const groupedSessions = groupSessionsByDate(filteredSessions);

  const handleToggleSelect = (sessionId: string) => {
    setSelectedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedSessions.length === 0) return;
    onBulkDelete?.(selectedSessions);
    setSelectedSessions([]);
    setBulkMode(false);
    toast.success(`Deleted ${selectedSessions.length} session(s)`);
  };

  const handleToggleFavorite = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(sessionId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className={`w-[320px] p-0 flex flex-col ${darkMode ? 'dark' : ''}`}>
        <SheetHeader className="p-4">
          <SheetTitle className="text-left text-foreground">Gemini CoCreate</SheetTitle>
          <SheetDescription className="sr-only">
            Manage your chat sessions and start new conversations
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 space-y-3">
          <Button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full justify-start rounded-lg text-foreground h-10"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="pl-9 h-10"
            />
          </div>

          {/* Filter by Mode */}
          <Select value={filterMode} onValueChange={(v) => setFilterMode(v as Mode | "all")}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Filter by mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="idea">Ideate</SelectItem>
              <SelectItem value="write">Write</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <Button
              variant={bulkMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedSessions([]);
              }}
              className="flex-1 h-9 gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              {bulkMode ? "Cancel" : "Select"}
            </Button>
            {bulkMode && selectedSessions.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex-1 h-9 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedSessions.length})
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 py-4">
            {groupedSessions.map(([period, periodSessions]) => (
              <div key={period}>
                <h3 className="text-xs text-muted-foreground mb-3">{period}</h3>
                <div className="space-y-1">
                  {periodSessions.map((session) => {
                    const ModeIcon = getModeIcon(session.mode);
                    const isActive = session.id === currentSessionId;

                    return (
                      <div
                        key={session.id}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          isActive
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        } ${selectedSessions.includes(session.id) ? "bg-purple-500/20" : ""}`}
                        onClick={() => {
                          if (bulkMode) {
                            handleToggleSelect(session.id);
                          } else {
                            onSelectSession(session.id);
                            onClose();
                          }
                        }}
                      >
                        {bulkMode && (
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedSessions.includes(session.id)
                              ? "bg-purple-500 border-purple-500"
                              : "border-border"
                          }`}>
                            {selectedSessions.includes(session.id) && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </div>
                        )}
                        <ModeIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm truncate block text-foreground">{session.title}</span>
                          {session.tags && session.tags.length > 0 && (
                            <div className="flex gap-1 mt-1.5">
                              {session.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {!bulkMode && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleToggleFavorite(session.id, e)}
                            >
                              <Star className={`w-3.5 h-3.5 ${session.favorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="text-center py-12 px-4">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No previous chats</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}