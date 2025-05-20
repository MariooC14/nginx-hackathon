import { Copy } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip.tsx";


export default function TruncateWithTooltip({ text, width = 500 }: { text: string, width: number }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger className="truncate text-left" style={{ width }}>{text}</TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>{text}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => { navigator.clipboard.writeText(text) }}
              title="Copy path"
            >
              <Copy />
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}