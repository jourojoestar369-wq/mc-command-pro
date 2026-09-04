import { effectsForVersion } from "@/data/mc/effects";
import { enchantsForVersion } from "@/data/mc/enchantments";
import { entitiesForVersion } from "@/data/mc/entities";
import { BLOCKS, ITEMS, itemsForVersion } from "@/data/mc/items";
import { GAMERULES } from "@/data/mc/gamerules";
import type {
  ClearOpts,
  CloneOpts,
  DifficultyOpts,
  EffectOpts,
  EnchantOpts,
  ExecuteOpts,
  FillOpts,
  GamemodeOpts,
  GameruleOpts,
  GiveOpts,
  GenContext,
  KillOpts,
  SetblockOpts,
  SpawnpointOpts,
  SummonOpts,
  TimeOpts,
  TpOpts,
  WeatherOpts,
} from "@/lib/mc/commands";
import { EnchantEditor, type AppliedEnchant } from "./EnchantEditor";
import { ItemPicker } from "./ItemPicker";
import {
  CheckField,
  CoordRow,
  Field,
  NumberInput,
  SelectField,
  TargetField,
  TextInput,
} from "./fields";

type Patch<T> = (partial: Partial<T>) => void;

function itemOptions(legacy: boolean) {
  return itemsForVersion(ITEMS, legacy).map((i) => ({
    name: i.name,
    id: i.id,
    legacyLabel: legacy
      ? i.legacy
        ? `minecraft:${i.legacy.id}${i.legacy.data ? `:${i.legacy.data}` : ""}`
        : i.id
      : `minecraft:${i.id}`,
  }));
}

function blockOptions(legacy: boolean) {
  return itemsForVersion(BLOCKS, legacy).map((i) => ({
    name: i.name,
    id: i.id,
    legacyLabel: legacy
      ? i.legacy
        ? `minecraft:${i.legacy.id}${i.legacy.data ? `:${i.legacy.data}` : ""}`
        : i.id
      : `minecraft:${i.id}`,
  }));
}

function entityOptions(legacy: boolean) {
  return entitiesForVersion(legacy).map((e) => ({
    name: e.name,
    id: e.id,
    legacyLabel: legacy ? (e.legacy ?? e.name) : `minecraft:${e.id}`,
  }));
}

// ── Give ────────────────────────────────────────────────────────────────────

export function GiveForm({
  value,
  patch,
  ctx,
}: {
  value: GiveOpts;
  patch: Patch<GiveOpts>;
  ctx: GenContext;
}) {
  return (
    <div className="flex flex-col gap-4">
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
      <ItemPicker
        label="Item"
        options={itemOptions(ctx.legacy)}
        value={value.item?.id ?? ""}
        onSelect={(id) => {
          const item = itemsForVersion(ITEMS, ctx.legacy).find((i) => i.id === id) ?? null;
          patch({ item });
        }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Count" hint="per stack">
          <NumberInput
            value={value.count}
            min={1}
            max={9999}
            onChange={(e) => patch({ count: Math.max(1, Number(e.target.value) || 1) })}
          />
        </Field>
        <Field label="Item name" hint="display name">
          <TextInput
            value={value.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="e.g. Sword of Doom"
          />
        </Field>
      </div>
      <CheckField
        label="Unbreakable"
        checked={value.unbreakable}
        onCheckedChange={(unbreakable) => patch({ unbreakable })}
      />
      <Field label="Enchantments" hint={`${value.enchants.length} applied`}>
        <EnchantEditor
          enchants={value.enchants}
          onChange={(enchants: AppliedEnchant[]) => patch({ enchants })}
          legacy={ctx.legacy}
        />
      </Field>
    </div>
  );
}

// ── Clear ───────────────────────────────────────────────────────────────────

export function ClearForm({
  value,
  patch,
  ctx,
}: {
  value: ClearOpts;
  patch: Patch<ClearOpts>;
  ctx: GenContext;
}) {
  return (
    <div className="flex flex-col gap-4">
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
      <ItemPicker
        label="Item (optional — empty clears everything)"
        options={itemOptions(ctx.legacy)}
        value={value.item?.id ?? ""}
        onSelect={(id) => {
          const item = itemsForVersion(ITEMS, ctx.legacy).find((i) => i.id === id) ?? null;
          patch({ item });
        }}
      />
      {value.item && (
        <Field label="Max count" hint="1 = single item">
          <NumberInput
            value={value.count}
            min={1}
            max={9999}
            onChange={(e) => patch({ count: Math.max(1, Number(e.target.value) || 1) })}
          />
        </Field>
      )}
    </div>
  );
}

// ── Enchant ─────────────────────────────────────────────────────────────────

export function EnchantForm({
  value,
  patch,
  ctx,
}: {
  value: EnchantOpts;
  patch: Patch<EnchantOpts>;
  ctx: GenContext;
}) {
  return (
    <div className="flex flex-col gap-4">
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
      <SelectField
        label="Enchantment"
        value={value.enchant?.id ?? ""}
        onValueChange={(id) => {
          const enchant = enchantsForVersion(ctx.legacy).find((e) => e.id === id) ?? null;
          patch({ enchant });
        }}
        options={enchantsForVersion(ctx.legacy).map((e) => ({ value: e.id, label: e.name }))}
      />
      <Field label="Level">
        <NumberInput
          value={value.level}
          min={1}
          max={255}
          onChange={(e) => patch({ level: Math.max(1, Math.min(255, Number(e.target.value) || 1)) })}
        />
      </Field>
    </div>
  );
}

// ── Setblock ────────────────────────────────────────────────────────────────

export function SetblockForm({
  value,
  patch,
  ctx,
}: {
  value: SetblockOpts;
  patch: Patch<SetblockOpts>;
  ctx: GenContext;
}) {
  return (
    <div className="flex flex-col gap-4">
      <CoordRow
        label="Position"
        value={value.pos}
        onChange={(pos) => patch({ pos })}
      />
      <ItemPicker
        label="Block"
        options={blockOptions(ctx.legacy)}
        value={value.block?.id ?? ""}
        onSelect={(id) => {
          const block = itemsForVersion(BLOCKS, ctx.legacy).find((b) => b.id === id) ?? null;
          patch({ block });
        }}
      />
      <SelectField
        label="Mode"
        value={value.mode}
        onValueChange={(mode) => patch({ mode: mode as SetblockOpts["mode"] })}
        options={[
          { value: "replace", label: "replace — overwrite anything" },
          { value: "keep", label: "keep — only if empty" },
          { value: "destroy", label: "destroy — break and drop" },
        ]}
      />
    </div>
  );
}

// ── Fill ────────────────────────────────────────────────────────────────────

export function FillForm({
  value,
  patch,
  ctx,
}: {
  value: FillOpts;
  patch: Patch<FillOpts>;
  ctx: GenContext;
}) {
  return (
    <div className="flex flex-col gap-4">
      <CoordRow label="From" value={value.from} onChange={(from) => patch({ from })} />
      <CoordRow label="To" value={value.to} onChange={(to) => patch({ to })} />
      <ItemPicker
        label="Block"
        options={blockOptions(ctx.legacy)}
        value={value.block?.id ?? ""}
        onSelect={(id) => {
          const block = itemsForVersion(BLOCKS, ctx.legacy).find((b) => b.id === id) ?? null;
          patch({ block });
        }}
      />
      <SelectField
        label="Mode"
        value={value.mode}
        onValueChange={(mode) => patch({ mode: mode as FillOpts["mode"] })}
        options={[
          { value: "replace", label: "replace" },
          { value: "destroy", label: "destroy" },
          { value: "keep", label: "keep" },
          { value: "outline", label: "outline" },
          { value: "hollow", label: "hollow" },
        ]}
      />
    </div>
  );
}

// ── Clone ───────────────────────────────────────────────────────────────────

export function CloneForm({
  value,
  patch,
}: {
  value: CloneOpts;
  patch: Patch<CloneOpts>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <CoordRow label="From" value={value.from} onChange={(from) => patch({ from })} />
      <CoordRow label="To" value={value.to} onChange={(to) => patch({ to })} />
      <CoordRow label="Destination" value={value.dest} onChange={(dest) => patch({ dest })} />
      <SelectField
        label="Mode"
        value={value.mode}
        onValueChange={(mode) => patch({ mode: mode as CloneOpts["mode"] })}
        options={[
          { value: "replace", label: "replace — overwrite destination" },
          { value: "masked", label: "masked — skip air blocks" },
        ]}
      />
    </div>
  );
}

// ── Summon ──────────────────────────────────────────────────────────────────

export function SummonForm({
  value,
  patch,
  ctx,
}: {
  value: SummonOpts;
  patch: Patch<SummonOpts>;
  ctx: GenContext;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ItemPicker
        label="Entity"
        options={entityOptions(ctx.legacy)}
        value={value.entity?.id ?? ""}
        onSelect={(id) => {
          const entity = entitiesForVersion(ctx.legacy).find((e) => e.id === id) ?? null;
          patch({ entity });
        }}
      />
      <CoordRow label="Position" value={value.pos} onChange={(pos) => patch({ pos })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Custom name" hint="shown above head">
          <TextInput
            value={value.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="e.g. Big Boss"
          />
        </Field>
        <Field label="Health" hint="leave empty for default">
          <TextInput
            value={value.health}
            onChange={(e) => patch({ health: e.target.value })}
            placeholder="20"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <CheckField label="Invulnerable" checked={value.invulnerable} onCheckedChange={(invulnerable) => patch({ invulnerable })} />
        <CheckField label="No AI" checked={value.noAI} onCheckedChange={(noAI) => patch({ noAI })} />
        <CheckField label="Silent" checked={value.silent} onCheckedChange={(silent) => patch({ silent })} />
        <CheckField label="Glowing" checked={value.glowing} onCheckedChange={(glowing) => patch({ glowing })} />
      </div>
    </div>
  );
}

// ── Effect ──────────────────────────────────────────────────────────────────

export function EffectForm({
  value,
  patch,
  ctx,
}: {
  value: EffectOpts;
  patch: Patch<EffectOpts>;
  ctx: GenContext;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Action"
        value={value.mode}
        onValueChange={(mode) => patch({ mode: mode as EffectOpts["mode"] })}
        options={[
          { value: "give", label: "give — apply the effect" },
          { value: "clear", label: "clear — remove effects" },
        ]}
      />
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
      {value.mode === "give" ? (
        <>
          <SelectField
            label="Effect"
            value={value.effect?.id ?? ""}
            onValueChange={(id) => {
              const effect = effectsForVersion(ctx.legacy).find((e) => e.id === id) ?? null;
              patch({ effect });
            }}
            options={effectsForVersion(ctx.legacy).map((e) => ({ value: e.id, label: e.name }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration" hint="seconds">
              <NumberInput
                value={value.seconds}
                min={0}
                max={9999}
                onChange={(e) => patch({ seconds: Math.max(0, Number(e.target.value) || 0) })}
              />
            </Field>
            <Field label="Amplifier" hint="0 = level I">
              <NumberInput
                value={value.amplifier}
                min={0}
                max={255}
                onChange={(e) => patch({ amplifier: Math.max(0, Math.min(255, Number(e.target.value) || 0)) })}
              />
            </Field>
          </div>
          <CheckField
            label="Hide particles"
            checked={value.hideParticles}
            onCheckedChange={(hideParticles) => patch({ hideParticles })}
          />
        </>
      ) : (
        !ctx.legacy && (
          <SelectField
            label="Effect (optional)"
            value={value.effect?.id ?? ""}
            onValueChange={(id) => {
              const effect = effectsForVersion(ctx.legacy).find((e) => e.id === id) ?? null;
              patch({ effect });
            }}
            options={[
              { value: "", label: "— all effects —" },
              ...effectsForVersion(ctx.legacy).map((e) => ({ value: e.id, label: e.name })),
            ]}
          />
        )
      )}
    </div>
  );
}

// ── Execute ─────────────────────────────────────────────────────────────────

export function ExecuteForm({
  value,
  patch,
  ctx,
}: {
  value: ExecuteOpts;
  patch: Patch<ExecuteOpts>;
  ctx: GenContext;
}) {
  if (ctx.legacy) {
    return (
      <div className="flex flex-col gap-4">
        <TargetField value={value.legacyEntity} onChange={(legacyEntity) => patch({ legacyEntity })} />
        <CoordRow label="Position" value={value.legacyPos} onChange={(legacyPos) => patch({ legacyPos })} />
        <Field label="Command to run" hint="any command">
          <TextInput
            value={value.runCommand}
            onChange={(e) => patch({ runCommand: e.target.value })}
            placeholder="/give @s minecraft:diamond 1"
          />
        </Field>
        <p className="font-mono text-[11px] leading-5 text-muted-foreground">
          <span className="text-amber-700">//</span> legacy /execute runs the
          command from the target&apos;s position.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <TargetField value={value.asTarget} onChange={(asTarget) => patch({ asTarget })} />
      <TargetField value={value.atTarget} onChange={(atTarget) => patch({ atTarget })} />
      <Field label="Condition" hint="optional — if entity">
        <TextInput
          value={value.ifEntity}
          onChange={(e) => patch({ ifEntity: e.target.value })}
          placeholder="@e[type=zombie]"
        />
      </Field>
      <Field label="Command to run" hint="any command">
        <TextInput
          value={value.runCommand}
          onChange={(e) => patch({ runCommand: e.target.value })}
          placeholder="/give @s minecraft:diamond 1"
        />
      </Field>
    </div>
  );
}

// ── World / player ──────────────────────────────────────────────────────────

export function GamemodeForm({
  value,
  patch,
}: {
  value: GamemodeOpts;
  patch: Patch<GamemodeOpts>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Gamemode"
        value={value.mode}
        onValueChange={(mode) => patch({ mode: mode as GamemodeOpts["mode"] })}
        options={[
          { value: "survival", label: "survival" },
          { value: "creative", label: "creative" },
          { value: "adventure", label: "adventure" },
          { value: "spectator", label: "spectator" },
        ]}
      />
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
    </div>
  );
}

export function DifficultyForm({
  value,
  patch,
}: {
  value: DifficultyOpts;
  patch: Patch<DifficultyOpts>;
}) {
  return (
    <SelectField
      label="Difficulty"
      value={value.difficulty}
      onValueChange={(difficulty) => patch({ difficulty: difficulty as DifficultyOpts["difficulty"] })}
      options={[
        { value: "peaceful", label: "peaceful" },
        { value: "easy", label: "easy" },
        { value: "normal", label: "normal" },
        { value: "hard", label: "hard" },
      ]}
    />
  );
}

export function TimeForm({
  value,
  patch,
}: {
  value: TimeOpts;
  patch: Patch<TimeOpts>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Action"
        value={value.action}
        onValueChange={(action) => patch({ action: action as TimeOpts["action"] })}
        options={[
          { value: "set", label: "set — jump to a time" },
          { value: "add", label: "add — advance by ticks" },
        ]}
      />
      {value.action === "set" ? (
        <SelectField
          label="Preset"
          value={value.preset}
          onValueChange={(preset) => patch({ preset: preset as TimeOpts["preset"] })}
          options={[
            { value: "day", label: "day" },
            { value: "noon", label: "noon" },
            { value: "night", label: "night" },
            { value: "midnight", label: "midnight" },
            { value: "custom", label: "custom ticks…" },
          ]}
        />
      ) : null}
      {value.action === "add" || value.preset === "custom" ? (
        <Field label="Ticks" hint="20 ticks = 1 second">
          <NumberInput
            value={value.ticks}
            min={0}
            max={24000}
            onChange={(e) => patch({ ticks: Math.max(0, Math.min(24000, Number(e.target.value) || 0)) })}
          />
        </Field>
      ) : null}
    </div>
  );
}

export function WeatherForm({
  value,
  patch,
}: {
  value: WeatherOpts;
  patch: Patch<WeatherOpts>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Weather"
        value={value.type}
        onValueChange={(type) => patch({ type: type as WeatherOpts["type"] })}
        options={[
          { value: "clear", label: "clear" },
          { value: "rain", label: "rain" },
          { value: "thunder", label: "thunder" },
        ]}
      />
      <Field label="Duration" hint="seconds — 0 = default">
        <NumberInput
          value={value.duration}
          min={0}
          max={999999}
          onChange={(e) => patch({ duration: Math.max(0, Number(e.target.value) || 0) })}
        />
      </Field>
    </div>
  );
}

export function KillForm({ value, patch }: { value: KillOpts; patch: Patch<KillOpts> }) {
  return (
    <div className="flex flex-col gap-4">
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
      <p className="font-mono text-[11px] leading-5 text-muted-foreground">
        <span className="text-amber-700">//</span> use a selector like{" "}
        <code className="text-foreground">@e[type=!player]</code> to clear mobs.
      </p>
    </div>
  );
}

export function TpForm({ value, patch }: { value: TpOpts; patch: Patch<TpOpts> }) {
  return (
    <div className="flex flex-col gap-4">
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
      <CoordRow label="Destination" value={value.pos} onChange={(pos) => patch({ pos })} />
    </div>
  );
}

export function SpawnpointForm({
  value,
  patch,
}: {
  value: SpawnpointOpts;
  patch: Patch<SpawnpointOpts>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <TargetField value={value.target} onChange={(target) => patch({ target })} />
      <CoordRow label="Position" value={value.pos} onChange={(pos) => patch({ pos })} />
    </div>
  );
}

export function GameruleForm({
  value,
  patch,
}: {
  value: GameruleOpts;
  patch: Patch<GameruleOpts>;
}) {
  const rule = GAMERULES.find((r) => r.name === value.rule) ?? GAMERULES[0];
  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Gamerule"
        value={value.rule}
        onValueChange={(rule) => {
          const def = GAMERULES.find((r) => r.name === rule);
          patch({ rule, value: def?.defaultValue ?? "true" });
        }}
        options={GAMERULES.map((r) => ({ value: r.name, label: r.name }))}
      />
      {rule.type === "bool" ? (
        <SelectField
          label="Value"
          value={value.value}
          onValueChange={(v) => patch({ value: v })}
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
        />
      ) : (
        <Field label="Value" hint="integer">
          <NumberInput
            value={Number(value.value) || 0}
            onChange={(e) => patch({ value: String(Math.max(0, Number(e.target.value) || 0)) })}
          />
        </Field>
      )}
    </div>
  );
}