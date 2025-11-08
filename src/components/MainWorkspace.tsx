import { useState, useRef, useEffect } from "react";
import { Send, Menu, Sparkles, Paperclip, BookmarkPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ChatMessage } from "./ChatMessage";
import { SessionDrawer } from "./SessionDrawer";
import { ProfileDropdown } from "./ProfileDropdown";
import { AIPersonaSelector, type AIPersona } from "./AIPersonaSelector";
import { SnippetsDrawer, type Snippet } from "./SnippetsDrawer";
import { WhiteboardCanvas } from "./WhiteboardCanvas";
import { CollaboratorAvatars } from "./CollaboratorAvatars";
import { ShareDialog } from "./ShareDialog";
import { SettingsPage } from "./SettingsPage";
import { OnboardingOverlay } from "./OnboardingOverlay";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { HelpButton } from "./HelpButton";
import type { Mode } from "./ModeSelection";
import { toast } from "sonner@2.0.3";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp?: string;
}

interface Session {
  id: string;
  mode: Mode;
  title: string;
  date: string;
  messages: Message[];
  favorite?: boolean;
  tags?: string[];
}

interface MainWorkspaceProps {
  sessions: Session[];
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSession: (sessionId: string, messages: Message[]) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const getAIResponse = (userMessage: string, persona: AIPersona): string => {
  const responses = {
    brainstormer: [
      "I love that direction! Here are some ideas to build on that:\n\n1. Consider combining sustainability with technology\n2. Think about solving a personal pain point you've experienced\n3. Look for gaps in existing markets\n4. What if we reimagined traditional services with AI?\n\nWhich angle resonates most with you?",
      "Interesting! Here are 5 creative angles on that:\n\n• Social impact approach\n• Tech-enabled solution\n• Community-driven model\n• Subscription-based service\n• Marketplace platform\n\nWant me to dive deeper into any of these?",
    ],
    critic: [
      "Let me analyze this critically. While the concept has merit, here are some potential weaknesses to address:\n\n1. Market saturation concerns\n2. Scalability challenges\n3. User adoption barriers\n\nHow would you address these?",
      "From an analytical perspective, I see both strengths and areas for improvement. The core idea is solid, but the execution needs refinement in these areas...",
    ],
    developer: [
      "Here's a technical approach:\n\n```javascript\nfunction implementIdea() {\n  // Step 1: Define architecture\n  // Step 2: Set up infrastructure\n  // Step 3: Build MVP\n}\n```\n\nWould you like me to break down the implementation details?",
      "From a development standpoint, we should focus on:\n\n1. Tech stack selection\n2. Database schema design\n3. API architecture\n4. Testing strategy\n\nWhich aspect should we tackle first?",
    ],
    designer: [
      "Love this concept! Here's a color palette suggestion:\n\n**Primary Colors:**\n• Deep Purple (#6B46C1) - Trust & creativity\n• Soft Blue (#60A5FA) - Calm & clarity\n\n**Accent Colors:**\n• Warm Coral (#FB7185) - Energy\n• Mint Green (#34D399) - Growth\n\nThese create a modern, approachable feel. Want to see variations?",
      "From a design perspective, let's focus on the user experience:\n\n1. Visual hierarchy\n2. Typography choices\n3. Spacing and layout\n4. Interactive elements\n\nShall we create some mockups?",
    ],
    professor: [
      "Excellent topic! Here's a suggested outline:\n\n**Introduction**\n- Hook: Start with a compelling statistic\n- Context: Why this matters now\n\n**Body**\n- Point 1: The current landscape\n- Point 2: Key benefits\n- Point 3: Real-world examples\n\n**Conclusion**\n- Summary and call to action\n\nShall I draft the introduction?",
      "Let me break this down pedagogically. Understanding the fundamentals is crucial:\n\n1. Core concepts and definitions\n2. Historical context\n3. Current applications\n4. Future implications\n\nWhich area would you like to explore first?",
    ],
  };

  const personaResponses = responses[persona] || responses.brainstormer;
  return personaResponses[Math.floor(Math.random() * personaResponses.length)];
};

export function MainWorkspace({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onUpdateSession,
  darkMode,
  onToggleDarkMode
}: MainWorkspaceProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>("brainstormer");
  const [activeTab, setActiveTab] = useState<"chat" | "whiteboard">("chat");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock collaborators
  const collaborators = [
    { id: "1", name: "Alice", color: "#8B5CF6", active: true },
    { id: "2", name: "Bob", color: "#3B82F6", active: true },
    { id: "3", name: "Carol", color: "#EC4899", active: false },
  ];

  // Check for first visit
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("gemini-cocreate-onboarding");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Load current session messages
  useEffect(() => {
    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (currentSession) {
      setMessages(currentSession.messages);
    } else {
      setMessages([]);
    }
  }, [currentSessionId, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setIsDrawerOpen(!isDrawerOpen);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        onNewChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, onNewChat]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    // Update session with new messages
    if (currentSessionId) {
      onUpdateSession(currentSessionId, newMessages);
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: getAIResponse(input, selectedPersona),
        timestamp: new Date().toISOString()
      };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      
      if (currentSessionId) {
        onUpdateSession(currentSessionId, updatedMessages);
      }
    }, 1000);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleSaveSnippet = (content: string) => {
    const newSnippet: Snippet = {
      id: Date.now().toString(),
      content,
      tags: ["ai-response"],
      date: new Date().toISOString()
    };
    setSnippets([newSnippet, ...snippets]);
    toast.success("Saved to snippets!");
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
    toast.success("Snippet deleted");
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded!`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEditMessage = () => {
    toast.success("Edit functionality will appear here");
  };

  const handleReply = () => {
    toast.success("Reply thread started");
  };

  const handleAddComment = () => {
    toast.success("Comment feature coming soon!");
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const showWelcome = messages.length === 0 && activeTab === "chat";

  if (showSettings) {
    return (
      <SettingsPage
        onBack={() => setShowSettings(false)}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
    );
  }

  return (
    <div className={`h-screen flex flex-col bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDrawerOpen(true)}
            className="h-9 w-9 rounded-lg text-foreground"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg text-foreground">Gemini CoCreate</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <CollaboratorAvatars
            collaborators={collaborators}
            onShare={() => setIsShareOpen(true)}
          />
          <ProfileDropdown
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "chat" | "whiteboard")} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border px-6">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger value="chat" className="data-[state=active]:bg-muted gap-2">
              <Sparkles className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="whiteboard" className="data-[state=active]:bg-muted">
              Whiteboard
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto">
            {showWelcome ? (
              <div className="h-full flex items-center justify-center px-6">
                <div className="text-center max-w-2xl space-y-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl mb-3 text-foreground">Welcome to Gemini CoCreate</h2>
                    <p className="text-muted-foreground">
                      Your AI creative partner for ideation, writing, and design.
                      <br />
                      Start a conversation below.
                    </p>
                  </div>
                  
                  <div className="grid gap-3 max-w-md mx-auto pt-4">
                    <button
                      onClick={() => setInput("Help me brainstorm startup ideas")}
                      className="p-4 rounded-xl border-2 border-border hover:border-purple-500 hover:bg-purple-500/10 transition-colors text-left"
                    >
                      <p className="text-sm text-foreground">Help me brainstorm startup ideas →</p>
                    </button>
                    <button
                      onClick={() => setInput("Write a blog post about AI collaboration")}
                      className="p-4 rounded-xl border-2 border-border hover:border-blue-500 hover:bg-blue-500/10 transition-colors text-left"
                    >
                      <p className="text-sm text-foreground">Write a blog post about AI collaboration →</p>
                    </button>
                    <button
                      onClick={() => setInput("Design a color palette for my brand")}
                      className="p-4 rounded-xl border-2 border-border hover:border-pink-500 hover:bg-pink-500/10 transition-colors text-left"
                    >
                      <p className="text-sm text-foreground">Design a color palette for my brand →</p>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-8">
                <div className="max-w-3xl mx-auto">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      onCopy={() => handleCopy(message.content)}
                      onEdit={handleEditMessage}
                      onReply={handleReply}
                      onSaveSnippet={() => handleSaveSnippet(message.content)}
                      onAddComment={handleAddComment}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* AI Persona Selector & Input Area */}
          <div className="border-t border-border bg-background">
            <div className="max-w-3xl mx-auto px-6 py-3">
              <AIPersonaSelector value={selectedPersona} onChange={setSelectedPersona} />
            </div>
            <div className="px-6 pb-6">
              <div className="max-w-3xl mx-auto">
                <div className="relative flex items-end gap-2 bg-background border-2 border-border rounded-2xl p-2 focus-within:border-muted-foreground/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg flex-shrink-0"
                    onClick={handleFileUpload}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Gemini CoCreate..."
                    className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[24px] max-h-[200px] bg-background text-foreground placeholder:text-muted-foreground"
                    rows={1}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg flex-shrink-0"
                    onClick={() => setIsSnippetsOpen(true)}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    size="icon"
                    className="h-9 w-9 rounded-lg bg-white text-black hover:bg-gray-100 disabled:bg-muted disabled:text-muted-foreground flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Gemini can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whiteboard" className="flex-1 overflow-hidden m-0">
          <WhiteboardCanvas darkMode={darkMode} />
        </TabsContent>
      </Tabs>

      {/* Session Drawer */}
      <SessionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={onNewChat}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
        onToggleFavorite={(id) => toast.success("Favorite toggled!")}
        onBulkDelete={(ids) => ids.forEach(onDeleteSession)}
        darkMode={darkMode}
      />

      {/* Snippets Drawer */}
      <SnippetsDrawer
        isOpen={isSnippetsOpen}
        onClose={() => setIsSnippetsOpen(false)}
        snippets={snippets}
        onAddSnippet={(snippet) => setSnippets([snippet, ...snippets])}
        onDeleteSnippet={handleDeleteSnippet}
      />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        sessionTitle={currentSession?.title || "New chat"}
      />

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Help Button */}
      <HelpButton
        onShowShortcuts={() => setShowShortcuts(true)}
        onShowOnboarding={() => setShowOnboarding(true)}
      />
    </div>
  );
}
