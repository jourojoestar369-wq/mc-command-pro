import type { ReactNode } from "react";

/**
 * Lightweight terminal-style highlighting for generated commands:
 * the command name renders green, NBT payloads (and quoted strings) render
 * amber, everything else renders in the default ink.
 */
export function highlightCommand(command: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let key = 0;
  const push = (text: string, cls?: string) => {
    if (!text) return;
    nodes.push(
      <span key={key++} className={cls}>
        {text}
      </span>,
    );
  };

  let i = 0;
  const cmdMatch = /^\/([a-z]+)/.exec(command);
  if (cmdMatch) {
    push(cmdMatch[0], "text-emerald-700 font-semibold");
    i = cmdMatch[0].length;
  }

  let buf = "";
  let depth = 0;
  let inQuote: "'" | '"' | null = null;
  const flush = () => {
    if (!buf) return;
    push(buf, depth > 0 || inQuote ? "text-amber-700" : undefined);
    buf = "";
  };

  while (i < command.length) {
    const c = command[i];
    if (inQuote) {
      buf += c;
      if (c === inQuote) inQuote = null;
    } else if (c === "'" || c === '"') {
      flush();
      inQuote = c;
      buf += c;
    } else if (c === "{") {
      flush();
      depth++;
      buf += c;
    } else if (c === "}") {
      buf += c;
      flush();
      depth = Math.max(0, depth - 1);
    } else {
      buf += c;
    }
    i++;
  }
  flush();
  return nodes;
}

export function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (e) {
      reject(e);
    } finally {
      document.body.removeChild(ta);
    }
  });
}