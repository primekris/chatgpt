import { Session } from "@shared/schema";
import { PlusCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionList } from "./SessionList";
import { ThemeToggle } from "./ThemeToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChatSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onExportChat: () => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onExportChat,
}: ChatSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-3 space-y-2">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          data-testid="button-new-chat"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="py-2">
          <div className="px-3 mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Conversations
            </h2>
          </div>
          <SessionList
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
            onRenameSession={onRenameSession}
          />
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-3 space-y-2">
        <Button
          variant="ghost"
          onClick={onExportChat}
          disabled={!activeSessionId}
          className="w-full justify-start gap-2"
          data-testid="button-export-chat"
        >
          <Download className="h-4 w-4" />
          Export Chat
        </Button>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
