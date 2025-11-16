import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

interface InputBoxProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputBox({ onSend, disabled = false, placeholder = "Ask anything..." }: InputBoxProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isListening, transcript, isSupported: isSpeechSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  // Update content when transcript changes
  useEffect(() => {
    if (transcript) {
      setContent(prev => prev + (prev ? " " : "") + transcript);
    }
  }, [transcript]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent("");
      resetTranscript();
      if (isListening) {
        stopListening();
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(prev => prev + (prev ? "\n\n" : "") + `[File: ${file.name}]\n${text}`);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 256)}px`;
    }
  }, [content]);

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex items-end gap-2 p-2 rounded-xl border border-input bg-background shadow-lg focus-within:ring-2 focus-within:ring-ring">
            <div className="flex gap-1 pb-2 pl-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-attach"
                disabled={disabled}
                className="h-9 w-9 rounded-lg"
                title="Upload text file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleVoiceInput}
                data-testid="button-voice"
                disabled={disabled || !isSpeechSupported}
                className={cn(
                  "h-9 w-9 rounded-lg",
                  isListening && "bg-destructive text-destructive-foreground"
                )}
                title={isSpeechSupported ? (isListening ? "Stop recording" : "Start voice input") : "Voice input not supported"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              data-testid="input-message"
              className="flex-1 min-h-[48px] max-h-64 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-3"
              rows={1}
            />

            <Button
              type="submit"
              size="icon"
              disabled={!content.trim() || disabled}
              data-testid="button-send"
              className="h-9 w-9 rounded-lg shrink-0 mb-2 mr-1"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {isListening ? "Listening... Click mic to stop" : "Press Enter to send, Shift+Enter for new line"}
          </p>
        </form>
      </div>
    </div>
  );
}
