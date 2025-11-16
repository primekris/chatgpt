import { useState } from "react";
import { Message } from "@shared/schema";
import { Copy, Download, Edit, RotateCw, Trash2, MoreVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportMessageAsText } from "@/lib/export-utils";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  message: Message;
  onEdit?: (content: string) => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function MessageActions({
  message,
  onEdit,
  onRegenerate,
  onDelete,
  className,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    exportMessageAsText(message);
  };

  return (
    <div className={cn("flex items-start", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            data-testid={`button-message-actions-${message.id}`}
            className="h-8 w-8 rounded-lg"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Message actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopy} data-testid="action-copy">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} data-testid="action-download">
            <Download className="mr-2 h-4 w-4" />
            Download TXT
          </DropdownMenuItem>
          {isUser && onEdit && (
            <DropdownMenuItem onClick={() => onEdit(message.content)} data-testid="action-edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {!isUser && onRegenerate && (
            <DropdownMenuItem onClick={onRegenerate} data-testid="action-regenerate">
              <RotateCw className="mr-2 h-4 w-4" />
              Regenerate
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={onDelete}
              data-testid="action-delete"
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
