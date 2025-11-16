import { useState } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface SystemPromptEditorProps {
  systemPrompt: string;
  onSave: (prompt: string) => void;
}

const presetPrompts = [
  { label: "Helpful", prompt: "You are a helpful AI assistant." },
  { label: "Professional", prompt: "You are a professional AI assistant focused on providing accurate, well-structured responses." },
  { label: "Creative", prompt: "You are a creative AI assistant who thinks outside the box and provides imaginative solutions." },
  { label: "Concise", prompt: "You are a concise AI assistant. Keep responses brief and to the point." },
  { label: "Technical", prompt: "You are a technical AI assistant with deep expertise in programming and software development." },
];

export function SystemPromptEditor({ systemPrompt, onSave }: SystemPromptEditorProps) {
  const [prompt, setPrompt] = useState(systemPrompt);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(prompt);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          data-testid="button-system-prompt"
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          System Prompt
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>System Prompt</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">Custom Instructions</Label>
            <Textarea
              id="system-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter system prompt..."
              className="min-h-48"
              data-testid="textarea-system-prompt"
            />
            <p className="text-xs text-muted-foreground">
              Customize how the AI assistant behaves and responds
            </p>
          </div>

          <div className="space-y-3">
            <Label>Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map((preset) => (
                <Badge
                  key={preset.label}
                  variant="secondary"
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => setPrompt(preset.prompt)}
                  data-testid={`preset-${preset.label.toLowerCase()}`}
                >
                  {preset.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1" data-testid="button-save-prompt">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
