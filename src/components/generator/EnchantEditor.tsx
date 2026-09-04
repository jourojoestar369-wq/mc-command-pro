import { ENCHANTMENTS, enchantsForVersion, type EnchantDef } from "@/data/mc/enchantments";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NumberInput, SelectField } from "./fields";

export interface AppliedEnchant {
  id: string;
  level: number;
}

export function EnchantEditor({
  enchants,
  onChange,
  legacy = false,
}: {
  enchants: AppliedEnchant[];
  onChange: (enchants: AppliedEnchant[]) => void;
  legacy?: boolean;
}) {
  const pool = enchantsForVersion(legacy);
  const [pendingId, setPendingId] = useState<string>(pool[0].id);
  const [pendingLevel, setPendingLevel] = useState<number>(5);
  const available = pool.filter((e) => !enchants.some((a) => a.id === e.id));
  const pending: EnchantDef | undefined = pool.find((e) => e.id === pendingId);

  const add = () => {
    if (!pending) return;
    onChange([...enchants, { id: pending.id, level: pendingLevel }]);
    const next = available.find((e) => e.id !== pending.id);
    if (next) setPendingId(next.id);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_5.5rem_2.5rem] items-end gap-1.5">
        <SelectField
          label="Enchantment"
          value={pendingId}
          onValueChange={setPendingId}
          options={available.map((e) => ({ value: e.id, label: e.name }))}
        />
        <NumberInput
          aria-label="Level"
          value={pendingLevel}
          min={1}
          max={255}
          onChange={(e) =>
            setPendingLevel(Math.max(1, Math.min(255, Number(e.target.value) || 1)))
          }
        />
        <button
          type="button"
          onClick={add}
          disabled={!pending}
          className="h-9 rounded-md border border-emerald-700/50 bg-emerald-700/10 px-2 font-mono text-[12px] text-emerald-800 transition-colors hover:bg-emerald-700/20 disabled:opacity-40"
          title="Add enchantment"
        >
          +
        </button>
      </div>
      {enchants.length > 0 && (
        <ul className="rounded-md border border-border bg-card">
          {enchants.map((e) => {
            const def = ENCHANTMENTS.find((x) => x.id === e.id);
            return (
              <li
                key={e.id}
                className="flex items-center justify-between gap-2 border-b border-border/50 px-2.5 py-1.5 font-mono text-[12px] last:border-b-0"
              >
                <span className="truncate text-foreground">
                  <span className="text-emerald-700">▸</span> {def?.name ?? e.id}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">lvl {e.level}</span>
                  <button
                    type="button"
                    onClick={() => onChange(enchants.filter((x) => x.id !== e.id))}
                    className={cn(
                      "rounded px-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                    )}
                    aria-label={`Remove ${def?.name ?? e.id}`}
                  >
                    ✕
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}