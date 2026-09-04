import { ENCHANTMENTS } from "@/data/mc/enchantments";
import { EFFECTS } from "@/data/mc/effects";
import type { EntityDef } from "@/data/mc/entities";
import type { ItemDef } from "@/data/mc/items";

export interface GenContext {
  legacy: boolean;
  version: string;
}

export interface Vec3 {
  x: string;
  y: string;
  z: string;
}

export const DEFAULT_POS: Vec3 = { x: "~", y: "~", z: "~" };

function ns(id: string): string {
  return `minecraft:${id}`;
}

function escDouble(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escSingle(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function jsonText(s: string): string {
  return JSON.stringify({ text: s });
}

function coords(v: Vec3): string {
  return `${v.x} ${v.y} ${v.z}`;
}

function fmt(n: number): string {
  return String(Math.max(0, Math.floor(n)));
}

// ── Give ────────────────────────────────────────────────────────────────────

export interface GiveOpts {
  target: string;
  item: ItemDef | null;
  count: number;
  enchants: { id: string; level: number }[];
  name: string;
  unbreakable: boolean;
}

export function buildGive(o: GiveOpts, ctx: GenContext): string {
  if (!o.item) return "";
  const nbtParts: string[] = [];

  if (o.enchants.length > 0) {
    const list = o.enchants
      .map((e) => {
        const def = ENCHANTMENTS.find((x) => x.id === e.id);
        if (!def) return null;
        if (ctx.legacy) return `{id:${def.legacyId},lvl:${e.level}}`;
        return `{id:"${ns(def.id)}",lvl:${e.level}s}`;
      })
      .filter((x): x is string => x !== null);
    if (list.length > 0) nbtParts.push(`Enchantments:[${list.join(",")}]`);
  }

  if (o.unbreakable) nbtParts.push("Unbreakable:1b");

  if (o.name) {
    nbtParts.push(
      ctx.legacy
        ? `display:{Name:"${escDouble(o.name)}"}`
        : `display:{Name:'${escSingle(jsonText(o.name))}'}`,
    );
  }

  if (ctx.legacy) {
    const leg = o.item.legacy;
    if (!leg) return "";
    const nbt = nbtParts.length > 0 ? ` {${nbtParts.join(",")}}` : "";
    return `/give ${o.target} ${ns(leg.id)} ${fmt(o.count)} ${leg.data ?? 0}${nbt}`;
  }

  const nbt = nbtParts.length > 0 ? `{${nbtParts.join(",")}}` : "";
  return `/give ${o.target} ${ns(o.item.id)}${nbt} ${fmt(o.count)}`;
}

// ── Clear ───────────────────────────────────────────────────────────────────

export interface ClearOpts {
  target: string;
  item: ItemDef | null;
  count: number;
}

export function buildClear(o: ClearOpts, ctx: GenContext): string {
  if (!o.item) return `/clear ${o.target}`;
  if (ctx.legacy) {
    const leg = o.item.legacy;
    if (!leg) return `/clear ${o.target}`;
    const count = o.count > 1 ? ` ${fmt(o.count)}` : "";
    return `/clear ${o.target} ${ns(leg.id)} ${leg.data ?? 0}${count}`;
  }
  const count = o.count > 1 ? ` ${fmt(o.count)}` : "";
  return `/clear ${o.target} ${ns(o.item.id)}${count}`;
}

// ── Summon ──────────────────────────────────────────────────────────────────

export interface SummonOpts {
  entity: EntityDef | null;
  pos: Vec3;
  name: string;
  health: string;
  invulnerable: boolean;
  noAI: boolean;
  silent: boolean;
  glowing: boolean;
}

export function buildSummon(o: SummonOpts, ctx: GenContext): string {
  if (!o.entity) return "";
  const nbtParts: string[] = [];

  if (o.name) {
    nbtParts.push(
      ctx.legacy
        ? `CustomName:"${escDouble(o.name)}"`
        : `CustomName:'${escSingle(jsonText(o.name))}'`,
    );
  }
  if (o.health) nbtParts.push(`Health:${fmt(parseFloat(o.health))}f`);
  if (o.invulnerable) nbtParts.push("Invulnerable:1b");
  if (o.noAI) nbtParts.push("NoAI:1b");
  if (o.silent) nbtParts.push("Silent:1b");
  if (o.glowing) nbtParts.push("Glowing:1b");

  const entityId = ctx.legacy
    ? (o.entity.legacy ?? o.entity.name)
    : ns(o.entity.id);
  const nbt = nbtParts.length > 0 ? ` {${nbtParts.join(",")}}` : "";
  return `/summon ${entityId} ${coords(o.pos)}${nbt}`;
}

// ── Setblock ────────────────────────────────────────────────────────────────

export interface SetblockOpts {
  pos: Vec3;
  block: ItemDef | null;
  mode: "replace" | "keep" | "destroy";
}

export function buildSetblock(o: SetblockOpts, ctx: GenContext): string {
  if (!o.block) return "";
  if (ctx.legacy) {
    const leg = o.block.legacy;
    if (!leg) return "";
    return `/setblock ${coords(o.pos)} ${ns(leg.id)} ${leg.data ?? 0} ${o.mode}`;
  }
  return `/setblock ${coords(o.pos)} ${ns(o.block.id)} ${o.mode}`;
}

// ── Fill ────────────────────────────────────────────────────────────────────

export interface FillOpts {
  from: Vec3;
  to: Vec3;
  block: ItemDef | null;
  mode: "replace" | "destroy" | "keep" | "outline" | "hollow";
}

export function buildFill(o: FillOpts, ctx: GenContext): string {
  if (!o.block) return "";
  if (ctx.legacy) {
    const leg = o.block.legacy;
    if (!leg) return "";
    return `/fill ${coords(o.from)} ${coords(o.to)} ${ns(leg.id)} ${leg.data ?? 0} ${o.mode}`;
  }
  return `/fill ${coords(o.from)} ${coords(o.to)} ${ns(o.block.id)} ${o.mode}`;
}

export function fillVolume(o: FillOpts): number | null {
  const n = (v: string) => (v.trim() === "" ? NaN : Number(v));
  const x1 = n(o.from.x);
  const y1 = n(o.from.y);
  const z1 = n(o.from.z);
  const x2 = n(o.to.x);
  const y2 = n(o.to.y);
  const z2 = n(o.to.z);
  if ([x1, y1, z1, x2, y2, z2].some((v) => !Number.isFinite(v))) return null;
  const dx = Math.abs(x2 - x1) + 1;
  const dy = Math.abs(y2 - y1) + 1;
  const dz = Math.abs(z2 - z1) + 1;
  return dx * dy * dz;
}

// ── Clone ───────────────────────────────────────────────────────────────────

export interface CloneOpts {
  from: Vec3;
  to: Vec3;
  dest: Vec3;
  mode: "replace" | "masked";
}

export function buildClone(o: CloneOpts, _ctx: GenContext): string {
  return `/clone ${coords(o.from)} ${coords(o.to)} ${coords(o.dest)} ${o.mode}`;
}

// ── Effect ──────────────────────────────────────────────────────────────────

export interface EffectOpts {
  mode: "give" | "clear";
  target: string;
  effect: (typeof EFFECTS)[number] | null;
  seconds: number;
  amplifier: number;
  hideParticles: boolean;
}

export function buildEffect(o: EffectOpts, ctx: GenContext): string {
  if (o.mode === "clear") {
    if (ctx.legacy) return `/effect ${o.target} clear`;
    return o.effect
      ? `/effect clear ${o.target} ${ns(o.effect.id)}`
      : `/effect clear ${o.target}`;
  }
  if (!o.effect) return "";
  const hide = o.hideParticles ? " true" : "";
  const args = `${ns(o.effect.id)} ${fmt(o.seconds)} ${fmt(o.amplifier)}${hide}`;
  return ctx.legacy ? `/effect ${o.target} ${args}` : `/effect give ${o.target} ${args}`;
}

// ── Execute ─────────────────────────────────────────────────────────────────

export interface ExecuteOpts {
  asTarget: string;
  atTarget: string;
  ifEntity: string;
  runCommand: string;
  legacyEntity: string;
  legacyPos: Vec3;
}

export function buildExecute(o: ExecuteOpts, ctx: GenContext): string {
  if (ctx.legacy) {
    return `/execute ${o.legacyEntity} ${coords(o.legacyPos)} ${o.runCommand}`;
  }
  const parts: string[] = [];
  if (o.asTarget) parts.push(`as ${o.asTarget}`);
  if (o.atTarget) parts.push(`at ${o.atTarget}`);
  if (o.ifEntity) parts.push(`if entity ${o.ifEntity}`);
  parts.push(`run ${o.runCommand}`);
  return `/execute ${parts.join(" ")}`;
}

// ── Enchant ─────────────────────────────────────────────────────────────────

export interface EnchantOpts {
  target: string;
  enchant: (typeof ENCHANTMENTS)[number] | null;
  level: number;
}

export function buildEnchant(o: EnchantOpts, _ctx: GenContext): string {
  if (!o.enchant) return "";
  return `/enchant ${o.target} ${ns(o.enchant.id)} ${fmt(o.level)}`;
}

// ── Gamemode ────────────────────────────────────────────────────────────────

export type GameMode = "survival" | "creative" | "adventure" | "spectator";

const GAMEMODE_LEGACY: Record<GameMode, number> = {
  survival: 0,
  creative: 1,
  adventure: 2,
  spectator: 3,
};

export interface GamemodeOpts {
  mode: GameMode;
  target: string;
}

export function buildGamemode(o: GamemodeOpts, ctx: GenContext): string {
  return ctx.legacy
    ? `/gamemode ${GAMEMODE_LEGACY[o.mode]} ${o.target}`
    : `/gamemode ${o.mode} ${o.target}`;
}

// ── Difficulty ──────────────────────────────────────────────────────────────

export type Difficulty = "peaceful" | "easy" | "normal" | "hard";

export interface DifficultyOpts {
  difficulty: Difficulty;
}

export function buildDifficulty(o: DifficultyOpts, _ctx: GenContext): string {
  return `/difficulty ${o.difficulty}`;
}

// ── Time ────────────────────────────────────────────────────────────────────

export type TimePreset = "day" | "noon" | "night" | "midnight" | "custom";

export interface TimeOpts {
  action: "set" | "add";
  preset: TimePreset;
  ticks: number;
}

export function buildTime(o: TimeOpts, _ctx: GenContext): string {
  if (o.action === "add") return `/time add ${fmt(o.ticks)}`;
  if (o.preset !== "custom") return `/time set ${o.preset}`;
  return `/time set ${fmt(o.ticks)}`;
}

// ── Weather ─────────────────────────────────────────────────────────────────

export type WeatherType = "clear" | "rain" | "thunder";

export interface WeatherOpts {
  type: WeatherType;
  duration: number;
}

export function buildWeather(o: WeatherOpts, _ctx: GenContext): string {
  const dur = o.duration > 0 ? ` ${fmt(o.duration)}` : "";
  return `/weather ${o.type}${dur}`;
}

// ── Kill ────────────────────────────────────────────────────────────────────

export interface KillOpts {
  target: string;
}

export function buildKill(o: KillOpts, _ctx: GenContext): string {
  return `/kill ${o.target}`;
}

// ── TP ──────────────────────────────────────────────────────────────────────

export interface TpOpts {
  target: string;
  pos: Vec3;
}

export function buildTp(o: TpOpts, _ctx: GenContext): string {
  return `/tp ${o.target} ${coords(o.pos)}`;
}

// ── Spawnpoint ──────────────────────────────────────────────────────────────

export interface SpawnpointOpts {
  target: string;
  pos: Vec3;
}

export function buildSpawnpoint(o: SpawnpointOpts, _ctx: GenContext): string {
  return `/spawnpoint ${o.target} ${coords(o.pos)}`;
}

// ── Gamerule ────────────────────────────────────────────────────────────────

export interface GameruleOpts {
  rule: string;
  value: string;
}

export function buildGamerule(o: GameruleOpts, _ctx: GenContext): string {
  return `/gamerule ${o.rule} ${o.value}`;
}