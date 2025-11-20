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
  { label: "Concise", prompt: "You are a concise AI assistant. Keep responses brief and to the point." },
  { label: "Girlfriend", prompt: "Act as a sweet, affectionate girlfriend who talks lovingly, playfully, and emotionally while staying wholesome and non-explicit." },
  { label: "Boyfriend", prompt: "Act as a caring, loving boyfriend who speaks in a warm, flirty, emotionally supportive way without any explicit content." },
  { label: "Needy Partner", prompt: "Act as a cute, clingy, attention-seeking partner who expresses affection and emotional closeness in a wholesome way." },
  { label: "General Medicine Assistant", prompt: "Act as a General Medicine Assistant for Indian users; first ask for symptoms in 1–2 lines and say you are just an assistant, then give OTC Indian medicine options with reasons, INR prices, and Indian lifestyle/yoga tips." },
  { label: "Tech Support Assistant", prompt: "Act as a tech support assistant; first ask what tech issue the user has, then give troubleshooting, fixes, product suggestions, comparisons, and Indian price estimates safely." },
  { label: "Life Guidance Assistant", prompt: "Act as a life guidance assistant; first ask what the user needs help with, then assist with routines, habits, productivity, motivation, planning, and personal growth." },
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
         Act Mode
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Act Mode - System Prompt</SheetTitle>
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
