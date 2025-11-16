import { useState, useEffect } from "react";
import { Session, Message } from "@shared/schema";
import { storage } from "@/lib/storage";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { ChatHeader } from "@/components/ChatHeader";
import { PromptTemplates } from "@/components/PromptTemplates";
import { exportSessionAsText } from "@/lib/export-utils";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState("meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.");
  const { toast } = useToast();

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  useEffect(() => {
    const loadedSessions = storage.getSessions();
    setSessions(loadedSessions);
    
    const activeId = storage.getActiveSessionId();
    if (activeId && loadedSessions.find((s) => s.id === activeId)) {
      setActiveSessionId(activeId);
    } else if (loadedSessions.length > 0) {
      setActiveSessionId(loadedSessions[0].id);
      storage.setActiveSessionId(loadedSessions[0].id);
    }

    const settings = storage.getSettings();
    setTemperature(settings.temperature);
    setSelectedModel(settings.selectedModel);
    setSystemPrompt(storage.getSystemPrompt());
  }, []);

  useEffect(() => {
    storage.saveSettings({ temperature, selectedModel });
  }, [temperature, selectedModel]);

  const createNewChat = () => {
    const newSession = storage.createSession();
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    storage.setActiveSessionId(newSession.id);
  };

  const selectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    storage.setActiveSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    storage.deleteSession(sessionId);
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);
    
    if (activeSessionId === sessionId) {
      const nextSession = updatedSessions[0];
      if (nextSession) {
        setActiveSessionId(nextSession.id);
        storage.setActiveSessionId(nextSession.id);
      } else {
        setActiveSessionId(null);
        storage.setActiveSessionId(null);
      }
    }
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      const updated = { ...session, title: newTitle, updatedAt: Date.now() };
      storage.saveSession(updated);
      setSessions(sessions.map((s) => (s.id === sessionId ? updated : s)));
    }
  };

  const exportChat = () => {
    if (activeSession) {
      exportSessionAsText(activeSession);
      toast({
        title: "Chat exported",
        description: "Your conversation has been downloaded as a text file.",
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!activeSession) {
      createNewChat();
      return;
    }

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...activeSession.messages, userMessage];
    const updatedSession = {
      ...activeSession,
      messages: updatedMessages,
      updatedAt: Date.now(),
      title: activeSession.messages.length === 0 ? content.slice(0, 50) : activeSession.title,
    };

    storage.saveSession(updatedSession);
    setSessions(sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)));

    setIsLoading(true);
    setStreamingMessage({
      id: nanoid(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    });

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          temperature,
          systemPrompt,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  setStreamingMessage({
                    id: nanoid(),
                    role: "assistant",
                    content: assistantContent,
                    timestamp: Date.now(),
                  });
                }
              } catch (e) {
                console.error("Failed to parse chunk:", e);
              }
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: assistantContent,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalSession = {
        ...updatedSession,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      storage.saveSession(finalSession);
      setSessions(sessions.map((s) => (s.id === finalSession.id ? finalSession : s)));
      setStreamingMessage(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
      setStreamingMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const editMessage = (messageId: string, newContent: string) => {
    if (!activeSession) return;
    
    const messageIndex = activeSession.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const updatedMessages = activeSession.messages.slice(0, messageIndex);
    const updatedSession = {
      ...activeSession,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    storage.saveSession(updatedSession);
    setSessions(sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    
    sendMessage(newContent);
  };

  const regenerateMessage = (messageId: string) => {
    if (!activeSession) return;
    
    const messageIndex = activeSession.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const previousUserMessage = activeSession.messages
      .slice(0, messageIndex)
      .reverse()
      .find((m) => m.role === "user");
    
    if (previousUserMessage) {
      editMessage(messageId, previousUserMessage.content);
    }
  };

  const deleteMessage = (messageId: string) => {
    if (!activeSession) return;
    
    const updatedMessages = activeSession.messages.filter((m) => m.id !== messageId);
    const updatedSession = {
      ...activeSession,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    storage.saveSession(updatedSession);
    setSessions(sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative z-30 md:z-0 w-64 h-full transition-transform duration-300 md:translate-x-0`}
      >
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={createNewChat}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          onExportChat={exportChat}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader
          selectedModel={selectedModel}
          temperature={temperature}
          systemPrompt={systemPrompt}
          onModelChange={setSelectedModel}
          onTemperatureChange={setTemperature}
          onSystemPromptChange={(prompt) => {
            setSystemPrompt(prompt);
            storage.saveSystemPrompt(prompt);
          }}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {!activeSession || activeSession.messages.length === 0 ? (
          <div className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto py-8">
              <div className="text-center mb-8 space-y-3">
                <h1 className="text-4xl font-semibold">Where should we begin?</h1>
                <p className="text-muted-foreground">
                  Choose a template below or start typing your own message
                </p>
              </div>
              <PromptTemplates onSelectTemplate={sendMessage} />
            </div>
          </div>
        ) : (
          <ChatArea
            session={activeSession}
            streamingMessage={streamingMessage}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            onEditMessage={editMessage}
            onRegenerateMessage={regenerateMessage}
            onDeleteMessage={deleteMessage}
          />
        )}
      </div>
    </div>
  );
}
