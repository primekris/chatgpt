import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "./ModelSelector";
import { TemperatureSlider } from "./TemperatureSlider";
import { SystemPromptEditor } from "./SystemPromptEditor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface ChatHeaderProps {
  selectedModel: string;
  temperature: number;
  systemPrompt: string;
  onModelChange: (modelId: string) => void;
  onTemperatureChange: (temp: number) => void;
  onSystemPromptChange: (prompt: string) => void;
  onToggleSidebar: () => void;
}

export function ChatHeader({
  selectedModel,
  temperature,
  systemPrompt,
  onModelChange,
  onTemperatureChange,
  onSystemPromptChange,
  onToggleSidebar,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          data-testid="button-toggle-sidebar"
          className="rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-settings"
              className="hidden md:flex"
            >
              Settings
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Configuration</h4>
                <p className="text-xs text-muted-foreground">
                  Adjust model parameters
                </p>
              </div>
              <Separator />
              <TemperatureSlider
                value={temperature}
                onChange={onTemperatureChange}
              />
            </div>
          </PopoverContent>
        </Popover>
        <SystemPromptEditor
          systemPrompt={systemPrompt}
          onSave={onSystemPromptChange}
        />
      </div>
    </header>
  );
}
