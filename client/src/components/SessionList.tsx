import { Session } from "@shared/schema";
import { MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SessionListProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
}

export function SessionList({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
}: SessionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEdit = (session: Session) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const saveEdit = (sessionId: string) => {
    if (editTitle.trim()) {
      onRenameSession(sessionId, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="space-y-1 px-2">
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No conversations yet
        </div>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              activeSessionId === session.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover-elevate text-sidebar-foreground"
            )}
          >
            {editingId === session.id ? (
              <div className="flex-1 flex items-center gap-1">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(session.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="h-7 text-sm"
                  autoFocus
                  data-testid={`input-rename-${session.id}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => saveEdit(session.id)}
                  className="h-7 w-7 shrink-0"
                  data-testid="button-save-rename"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                  className="h-7 w-7 shrink-0"
                  data-testid="button-cancel-rename"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onSelectSession(session.id)}
                  className="flex-1 flex items-center gap-2 text-left min-w-0"
                  data-testid={`session-${session.id}`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate flex-1">{session.title}</span>
                </button>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(session)}
                    className="h-7 w-7 shrink-0"
                    data-testid={`button-edit-${session.id}`}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteSession(session.id)}
                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                    data-testid={`button-delete-${session.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
