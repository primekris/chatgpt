import { Message } from "@shared/schema";
import { User, Bot, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageActions } from "./MessageActions";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { useEffect, useRef } from "react";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onEdit?: (content: string) => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

export function MessageBubble({ 
  message, 
  isStreaming = false,
  onEdit,
  onRegenerate,
  onDelete 
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const cursorRef = useRef<HTMLSpanElement>(null);
  const { speak, stop, isSpeaking, isSupported: isTTSSupported } = useTextToSpeech();

  useEffect(() => {
    if (isStreaming && cursorRef.current) {
      cursorRef.current.classList.add("animate-pulse");
    }
  }, [isStreaming]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(message.content);
    }
  };

  return (
    <div
      className="group relative px-4 py-6 hover:bg-muted/30 transition-colors overflow-hidden"
      data-testid={`message-${message.id}`}
    >
      <div className="max-w-3xl mx-auto flex gap-4 overflow-hidden">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-2 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {isUser ? "You" : "AI Assistant"}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            {!isUser && isTTSSupported && !isStreaming && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSpeech}
                data-testid={`button-read-aloud-${message.id}`}
                className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-3 w-3 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3 w-3 mr-1" />
                    Read Aloud
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-full break-words overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  
                  return !inline && match ? (
                    <CodeBlock code={codeString} language={match[1]} />
                  ) : (
                    <code className="break-all overflow-hidden" {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="break-words overflow-wrap-anywhere max-w-full">{children}</p>;
                },
                a({ children, href }) {
                  return <a href={href} className="break-all max-w-full inline-block">{children}</a>;
                },
                pre({ children }) {
                  return <pre className="overflow-x-auto max-w-full">{children}</pre>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span ref={cursorRef} className="inline-block w-1 h-4 bg-foreground ml-0.5">
                |
              </span>
            )}
          </div>
        </div>

        <MessageActions
          message={message}
          onEdit={onEdit}
          onRegenerate={onRegenerate}
          onDelete={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
