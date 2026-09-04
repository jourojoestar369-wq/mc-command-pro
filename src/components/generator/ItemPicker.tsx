import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface PickerOption {
  name: string;
  id: string;
  legacyLabel?: string;
}

export function ItemPicker({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: PickerOption[];
  value: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = options.find((o) => o.id === value);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 60);
    return options
      .filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          (o.legacyLabel ?? "").toLowerCase().includes(q),
      )
      .slice(0, 60);
  }, [query, options]);

  const total = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.length;
    return options.filter((o) => o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)).length;
  }, [query, options]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="tick-label text-[11px]">{label}</span>
        <span className="text-[10px] text-muted-foreground">
          {query.trim() ? `${total} match${total === 1 ? "" : "es"}` : `${options.length} entries`}
        </span>
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute top-2 left-2 text-[12px] text-muted-foreground">
          ▸
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selected ? selected.name : "Search…"}
          className="h-9 w-full rounded-md border border-input bg-transparent pr-3 pl-7 font-mono text-[13px] shadow-none outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </div>
      <div className="max-h-56 overflow-y-auto rounded-md border border-border bg-card">
        {results.length === 0 ? (
          <div className="px-3 py-4 text-center font-mono text-[11px] text-muted-foreground">
            // no matches for “{query}”
          </div>
        ) : (
          <ul>
            {results.map((o) => {
              const isSelected = o.id === value;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(o.id);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-2 border-b border-border/50 px-3 py-1.5 text-left font-mono text-[12px] transition-colors last:border-b-0",
                      isSelected
                        ? "bg-emerald-700/10 text-emerald-800"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    <span className="truncate">
                      {isSelected && <span className="mr-1 text-emerald-700">▸</span>}
                      {o.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {o.legacyLabel ?? o.id}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}