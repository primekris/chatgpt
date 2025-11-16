import { Session, Message, SystemPrompt } from "@shared/schema";
import { nanoid } from "nanoid";

const SESSIONS_KEY = "chat-sessions";
const ACTIVE_SESSION_KEY = "chat-active-session";
const SYSTEM_PROMPT_KEY = "chat-system-prompt";
const SETTINGS_KEY = "chat-settings";

export interface ChatSettings {
  temperature: number;
  selectedModel: string;
}

export const storage = {
  // Sessions
  getSessions(): Session[] {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSession(session: Session): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  deleteSession(sessionId: string): void {
    const sessions = this.getSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    
    if (this.getActiveSessionId() === sessionId) {
      this.setActiveSessionId(sessions[0]?.id || null);
    }
  },

  createSession(title: string = "New Chat"): Session {
    const session: Session = {
      id: nanoid(),
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.saveSession(session);
    return session;
  },

  // Active Session
  getActiveSessionId(): string | null {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  },

  setActiveSessionId(sessionId: string | null): void {
    if (sessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  },

  // System Prompt
  getSystemPrompt(): string {
    return localStorage.getItem(SYSTEM_PROMPT_KEY) || "You are a helpful AI assistant.";
  },

  saveSystemPrompt(prompt: string): void {
    localStorage.setItem(SYSTEM_PROMPT_KEY, prompt);
  },

  // Settings
  getSettings(): ChatSettings {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      temperature: 0.7,
      selectedModel: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    };
  },

  saveSettings(settings: ChatSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
};
