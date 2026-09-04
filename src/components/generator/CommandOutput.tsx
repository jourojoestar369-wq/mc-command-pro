import { copyText, highlightCommand } from "./CommandText";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface OutputMeta {
  label: string;
  value: string;
}

export function CommandOutput({
  command,
  placeholder = "// configure the options on the left…",
  version,
  legacy,
  meta = [],
  tips = [],
  accent = "emerald",
}: {
  command: string;
  placeholder?: string;
  version: string;
  legacy: boolean;
  meta?: OutputMeta[];
  tips?: string[];
  accent?: "emerald" | "amber";
}) {
  const [copied, setCopied] = useState(false);
  const isEmpty = command.trim() === "";
  const accentText = accent === "emerald" ? "text-emerald-700" : "text-amber-700";
  const accentDot = accent === "emerald" ? "bg-emerald-600" : "bg-amber-600";

  const handleCopy = async () => {
    try {
      await copyText(command);
      setCopied(true);
      toast.success("Command copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy — select the text manually");
    }
  };

  return (
    <div className="panel overflow-hidden shadow-none">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="size-2 rounded-full bg-[oklch(0.7_0.1_30)]" />
            <span className="size-2 rounded-full bg-[oklch(0.65_0.1_85)]" />
            <span className="size-2 rounded-full bg-[oklch(0.55_0.1_150)]" />
          </span>
          <span className="tick-label ml-1">output</span>
          <span className={cn("flex items-center gap-1 text-[10px] font-medium", accentText)}>
            <span className={cn("size-1.5 animate-pulse rounded-full", accentDot)} />
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            MC {version}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            disabled={isEmpty}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md border px-2.5 font-mono text-[11px] transition-colors disabled:opacity-40",
              copied
                ? "border-emerald-700/50 bg-emerald-700/10 text-emerald-800"
                : "border-border bg-card text-foreground hover:bg-accent",
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </div>

      {/* Command body */}
      <div className="min-h-40 bg-card px-3 py-3">
        <pre className="font-mono text-[13px] leading-6 whitespace-pre-wrap break-all text-foreground">
          {isEmpty ? (
            <span className="text-amber-700/80 italic">{placeholder}</span>
          ) : (
            highlightCommand(command)
          )}
        </pre>
      </div>

      {/* Footer meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary/40 px-3 py-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {meta.map((m) => (
            <span key={m.label} className="font-mono text-[10px] text-muted-foreground">
              <span className="tick-label mr-1">{m.label}</span>
              {m.value}
            </span>
          ))}
          <span className="font-mono text-[10px] text-muted-foreground">
            <span className="tick-label mr-1">len</span>
            {command.length}
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {legacy ? "legacy syntax (1.12-)" : "modern syntax (1.13+)"}
        </span>
      </div>

      {tips.length > 0 && (
        <div className="border-t border-dashed border-border px-3 py-2">
          {tips.map((tip) => (
            <p key={tip} className="font-mono text-[11px] leading-5 text-muted-foreground">
              <span className={accentText}>//</span> {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}