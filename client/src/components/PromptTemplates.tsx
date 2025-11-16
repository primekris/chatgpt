import { promptTemplates } from "@/lib/prompt-templates";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Code, 
  FileText, 
  TrendingUp, 
  Home, 
  Languages,
  LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Code,
  FileText,
  TrendingUp,
  Home,
  Languages,
};

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

export function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">Quick Start Templates</h3>
        <p className="text-xs text-muted-foreground">Click a template to get started</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {promptTemplates.map((template) => {
          const Icon = iconMap[template.icon];
          return (
            <Card
              key={template.id}
              className="cursor-pointer transition-all hover-elevate active-elevate-2"
              onClick={() => onSelectTemplate(template.prompt)}
              data-testid={`template-${template.id}`}
            >
              <CardHeader className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-primary" />}
                  <CardTitle className="text-sm">{template.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {template.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
