import { SiteNav } from "@/components/SiteNav";
import { copyText } from "@/components/generator/CommandText";
import { Button } from "@/components/ui/button";
import { Dices, History } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function randomSeed(): bigint {
  const buf = new Uint32Array(2);
  crypto.getRandomValues(buf);
  let v = (BigInt(buf[0]) << 32n) | BigInt(buf[1]);
  v &= (1n << 63n) - 1n;
  return v;
}

function toHex(v: bigint): string {
  return `0x${v.toString(16).padStart(16, "0")}`;
}

function CopyButton({ text, label = "copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await copyText(text);
          setCopied(true);
          toast.success("Seed copied");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Could not copy");
        }
      }}
      className={cn(
        "rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors",
        copied
          ? "border-amber-700/50 bg-amber-700/10 text-amber-800"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {copied ? "copied" : label}
    </button>
  );
}

interface SeedRow {
  id: number;
  seed: bigint;
  at: string;
}

export default function Seeds() {
  const [count, setCount] = useState(1);
  const [rows, setRows] = useState<SeedRow[]>([]);
  const [history, setHistory] = useState<SeedRow[]>([]);
  const nextId = useRef(1);

  const generate = useCallback(() => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const fresh: SeedRow[] = Array.from({ length: count }, () => ({
      id: nextId.current++,
      seed: randomSeed(),
      at: time,
    }));
    setRows(fresh);
    setHistory((h) => [...fresh.slice().reverse(), ...h].slice(0, 8));
  }, [count]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="mb-8">
          <p className="tick-label mb-2">
            <span className="text-amber-700">//</span> seed lab · internal tool
          </p>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
            GENERATE WORLD SEEDS<span className="text-amber-700">_</span>
          </h1>
          <p className="mt-2 max-w-xl font-mono text-[13px] leading-6 text-muted-foreground">
            Internal world-seed generator for Minecraft. Produces
            cryptographically random 63-bit Java seeds — generate, copy, and
            paste straight into the “Seed” field of the world-creation screen.
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Controls */}
          <div className="panel p-4">
            <p className="tick-label mb-3">options</p>
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="tick-label">Seeds per run</span>
                  <span className="text-[10px] text-muted-foreground">{count}</span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={cn(
                        "h-9 rounded-md border font-mono text-[12px] transition-colors",
                        count === n
                          ? "border-amber-700/50 bg-amber-700/10 text-amber-800"
                          : "border-border bg-card text-foreground hover:bg-accent",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                onClick={generate}
                className="gap-2 font-mono text-[13px]"
              >
                <Dices className="size-4" />
                $ generate
              </Button>
              <p className="font-mono text-[10px] leading-5 text-muted-foreground">
                <span className="text-amber-700">//</span> uses
                crypto.getRandomValues — no patterns, no bias, and nothing is
                sent to a server.
              </p>
            </div>
          </div>

          {/* Output */}
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-3 py-2">
              <span className="tick-label">output</span>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await copyText(rows.map((r) => r.seed.toString()).join("\n"));
                      toast.success(`${rows.length} seeds copied`);
                    } catch {
                      toast.error("Could not copy");
                    }
                  }}
                  className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:bg-accent"
                >
                  copy all
                </button>
              )}
            </div>
            <div className="divide-y divide-border/60">
              {rows.map((row, i) => (
                <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-3.5">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] text-amber-700">[{i + 1}]</span>
                      <span className="truncate font-mono text-[15px] font-semibold text-foreground">
                        {row.seed.toString()}
                      </span>
                    </div>
                    <p className="mt-1 pl-5 font-mono text-[11px] text-muted-foreground">
                      hex {toHex(row.seed)} · {row.at}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <CopyButton text={row.seed.toString()} />
                    <CopyButton text={toHex(row.seed)} label="hex" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <section className="mt-8">
            <h2 className="tick-label mb-2 flex items-center gap-2">
              <History className="size-3.5" /> session history
            </h2>
            <div className="panel overflow-hidden">
              <div className="divide-y divide-border/60">
                {history.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <span className="truncate font-mono text-[12px] text-muted-foreground">
                      {row.seed.toString()}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{row.at}</span>
                      <CopyButton text={row.seed.toString()} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}