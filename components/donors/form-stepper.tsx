import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  steps: string[];
  current: number;
}

export function FormStepper({ steps, current }: Props) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center flex-1">
          <div className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                i < current
                  ? "bg-primary text-primary-foreground"
                  : i === current
                  ? "bg-primary/15 text-primary border-2 border-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium hidden sm:block", i === current ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn("h-0.5 flex-1 mx-1 rounded", i < current ? "bg-primary" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  );
}
