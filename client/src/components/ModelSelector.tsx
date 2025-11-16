import { Check, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { availableModels } from "@/lib/models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const currentModel = availableModels.find(m => m.id === selectedModel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          data-testid="button-model-selector"
          className="gap-2 font-semibold"
        >
          <Sparkles className="h-4 w-4" />
          {currentModel?.name || "Select Model"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold">Select AI Model</p>
          <p className="text-xs text-muted-foreground">Choose the model for your conversation</p>
        </div>
        <DropdownMenuSeparator />
        {availableModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => !model.comingSoon && onModelChange(model.id)}
            disabled={model.comingSoon}
            data-testid={`model-option-${model.id}`}
            className="flex items-start gap-3 p-3 cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{model.name}</span>
                {model.id === selectedModel && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                {model.comingSoon && (
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{model.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{model.provider}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
