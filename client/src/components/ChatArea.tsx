import { Session, Message } from "@shared/schema";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { InputBox } from "./InputBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface ChatAreaProps {
  session: Session | null;
  streamingMessage: Message | null;
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onRegenerateMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export function ChatArea({
  session,
  streamingMessage,
  isLoading,
  onSendMessage,
  onEditMessage,
  onRegenerateMessage,
  onDeleteMessage,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth: boolean = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [session?.messages, streamingMessage]);

  const isEmpty = !session || session.messages.length === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="pb-32 overflow-x-hidden w-full max-w-full">
            {isEmpty ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-3 max-w-md px-4">
                  <h1 className="text-4xl font-semibold">Where should we begin?</h1>
                  <p className="text-muted-foreground">
                    Start a conversation by typing a message below
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {session.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onEdit={(content) => onEditMessage(message.id, content)}
                    onRegenerate={() => onRegenerateMessage(message.id)}
                    onDelete={() => onDeleteMessage(message.id)}
                  />
                ))}
                {streamingMessage && (
                  <MessageBubble
                    message={streamingMessage}
                    isStreaming
                  />
                )}
                {isLoading && !streamingMessage && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <InputBox
        onSend={onSendMessage}
        disabled={isLoading}
        placeholder={isEmpty ? "Ask anything..." : "Send a message..."}
      />
    </div>
  );
}
