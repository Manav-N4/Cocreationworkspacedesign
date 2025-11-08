import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { MainWorkspace } from "./components/MainWorkspace";
import { Toaster } from "./components/ui/sonner";
import type { Mode } from "./components/ModeSelection";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface Session {
  id: string;
  mode: Mode;
  title: string;
  date: string;
  messages: Message[];
}

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [showLanding, setShowLanding] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("gemini-cocreate-sessions");
    const hasVisited = localStorage.getItem("gemini-cocreate-visited");
    const savedDarkMode = localStorage.getItem("gemini-cocreate-darkmode");
    
    if (hasVisited) {
      setShowLanding(false);
    }
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
    
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      // Set the most recent session as current
      if (parsed.length > 0) {
        setCurrentSessionId(parsed[0].id);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("gemini-cocreate-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleGetStarted = () => {
    localStorage.setItem("gemini-cocreate-visited", "true");
    setShowLanding(false);
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("gemini-cocreate-darkmode", String(newDarkMode));
  };

  const handleNewChat = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      mode: "idea",
      title: "New chat",
      date: new Date().toISOString(),
      messages: []
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      
      // If we deleted the current session, switch to another
      if (sessionId === currentSessionId) {
        setCurrentSessionId(filtered.length > 0 ? filtered[0].id : undefined);
      }
      
      return filtered;
    });
  };

  const handleUpdateSession = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        // Update title based on first user message
        const firstUserMessage = messages.find(m => m.role === "user");
        const title = firstUserMessage 
          ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
          : "New chat";

        return {
          ...session,
          messages,
          title,
          date: new Date().toISOString()
        };
      }
      return session;
    }));
  };

  return (
    <>
      {showLanding ? (
        <LandingPage onGetStarted={handleGetStarted} darkMode={darkMode} />
      ) : (
        <MainWorkspace
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          onUpdateSession={handleUpdateSession}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      )}
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;