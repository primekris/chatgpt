export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3" data-testid="typing-indicator">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  );
}
