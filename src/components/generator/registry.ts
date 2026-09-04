import { BLOCKS, ITEMS, itemsForVersion } from "@/data/mc/items";
import { ENTITIES } from "@/data/mc/entities";
import { EFFECTS } from "@/data/mc/effects";
import { ENCHANTMENTS } from "@/data/mc/enchantments";
import { GAMERULES } from "@/data/mc/gamerules";
import {
  DEFAULT_POS,
  type ClearOpts,
  type CloneOpts,
  type DifficultyOpts,
  type EffectOpts,
  type EnchantOpts,
  type ExecuteOpts,
  type FillOpts,
  type GamemodeOpts,
  type GameruleOpts,
  type GiveOpts,
  type KillOpts,
  type SetblockOpts,
  type SpawnpointOpts,
  type SummonOpts,
  type TimeOpts,
  type TpOpts,
  type WeatherOpts,
} from "@/lib/mc/commands";

export type GeneratorId =
  | "give"
  | "clear"
  | "enchant"
  | "setblock"
  | "fill"
  | "clone"
  | "summon"
  | "effect"
  | "execute"
  | "gamemode"
  | "difficulty"
  | "time"
  | "weather"
  | "kill"
  | "tp"
  | "spawnpoint"
  | "gamerule";

export interface GeneratorDef {
  id: GeneratorId;
  label: string;
  category: "items" | "blocks" | "entities" | "effects" | "execute" | "world";
  description: string;
}

export const GENERATORS: GeneratorDef[] = [
  { id: "give", label: "Give", category: "items", description: "Give items with NBT — enchantments, names, unbreakable" },
  { id: "clear", label: "Clear", category: "items", description: "Clear items from a player's inventory" },
  { id: "enchant", label: "Enchant", category: "items", description: "Enchant an item in a player's hand" },
  { id: "setblock", label: "Setblock", category: "blocks", description: "Place a block at coordinates" },
  { id: "fill", label: "Fill", category: "blocks", description: "Fill a volume with a block" },
  { id: "clone", label: "Clone", category: "blocks", description: "Copy a block volume to a destination" },
  { id: "summon", label: "Summon", category: "entities", description: "Summon entities with NBT" },
  { id: "effect", label: "Effect", category: "effects", description: "Apply or clear status effects" },
  { id: "execute", label: "Execute", category: "execute", description: "Run commands as/at entities with conditions" },
  { id: "gamemode", label: "Gamemode", category: "world", description: "Change a player's gamemode" },
  { id: "difficulty", label: "Difficulty", category: "world", description: "Set the world difficulty" },
  { id: "time", label: "Time", category: "world", description: "Set or add to the world time" },
  { id: "weather", label: "Weather", category: "world", description: "Set the weather" },
  { id: "kill", label: "Kill", category: "world", description: "Kill entities or players" },
  { id: "tp", label: "Teleport", category: "world", description: "Teleport a target to coordinates" },
  { id: "spawnpoint", label: "Spawnpoint", category: "world", description: "Set a player's spawnpoint" },
  { id: "gamerule", label: "Gamerule", category: "world", description: "Toggle world rules" },
];

export const CATEGORIES: { id: GeneratorDef["category"]; label: string }[] = [
  { id: "items", label: "Items" },
  { id: "blocks", label: "Blocks" },
  { id: "entities", label: "Entities" },
  { id: "effects", label: "Effects" },
  { id: "execute", label: "Execute" },
  { id: "world", label: "World / Player" },
];

export const generatorById = new Map(GENERATORS.map((g) => [g.id, g]));

export interface GenState {
  give: GiveOpts;
  clear: ClearOpts;
  summon: SummonOpts;
  setblock: SetblockOpts;
  fill: FillOpts;
  clone: CloneOpts;
  effect: EffectOpts;
  execute: ExecuteOpts;
  enchant: EnchantOpts;
  gamemode: GamemodeOpts;
  difficulty: DifficultyOpts;
  time: TimeOpts;
  weather: WeatherOpts;
  kill: KillOpts;
  tp: TpOpts;
  spawnpoint: SpawnpointOpts;
  gamerule: GameruleOpts;
}

export function makeDefaultState(): GenState {
  const diamondSword = ITEMS.find((i) => i.id === "diamond_sword") ?? null;
  const stone = ITEMS.find((i) => i.id === "stone") ?? null;
  const zombie = ENTITIES.find((e) => e.id === "zombie") ?? null;
  const speed = EFFECTS.find((e) => e.id === "speed") ?? null;
  const sharpness = ENCHANTMENTS.find((e) => e.id === "sharpness") ?? null;
  return {
    give: { target: "@p", item: diamondSword, count: 1, enchants: [], name: "", unbreakable: false },
    clear: { target: "@p", item: null, count: 1 },
    summon: { entity: zombie, pos: { ...DEFAULT_POS }, name: "", health: "", invulnerable: false, noAI: false, silent: false, glowing: false },
    setblock: { pos: { ...DEFAULT_POS }, block: stone, mode: "replace" },
    fill: { from: { x: "~", y: "~", z: "~" }, to: { x: "~5", y: "~5", z: "~5" }, block: stone, mode: "replace" },
    clone: {
      from: { x: "~", y: "~", z: "~" },
      to: { x: "~5", y: "~5", z: "~5" },
      dest: { x: "~10", y: "~", z: "~" },
      mode: "replace",
    },
    effect: { mode: "give", target: "@p", effect: speed, seconds: 30, amplifier: 1, hideParticles: false },
    execute: { asTarget: "@p", atTarget: "@s", ifEntity: "", runCommand: "/give @s minecraft:diamond 1", legacyEntity: "@p", legacyPos: { ...DEFAULT_POS } },
    enchant: { target: "@p", enchant: sharpness, level: 5 },
    gamemode: { mode: "creative", target: "@p" },
    difficulty: { difficulty: "peaceful" },
    time: { action: "set", preset: "day", ticks: 1000 },
    weather: { type: "clear", duration: 0 },
    kill: { target: "@p" },
    tp: { target: "@p", pos: { ...DEFAULT_POS } },
    spawnpoint: { target: "@p", pos: { ...DEFAULT_POS } },
    gamerule: { rule: "keepInventory", value: "true" },
  };
}

/** When the version flips to legacy, drop picks that don't exist pre-1.13. */
export function sanitizeState(state: GenState, legacy: boolean): GenState {
  if (!legacy) return state;
  const next: GenState = { ...state };
  const patchItem = (item: typeof ITEMS[number] | null) => {
    if (item && !item.legacy) return itemsForVersion(ITEMS, true)[0] ?? null;
    return item;
  };
  const patchEntity = (e: (typeof ENTITIES)[number] | null) =>
    e && !e.legacy ? ENTITIES.find((x) => x.legacy) ?? e : e;
  const patchEffect = (e: (typeof EFFECTS)[number] | null) =>
    e && e.legacy === false ? EFFECTS.find((x) => x.legacy !== false) ?? e : e;
  const patchEnchant = (e: (typeof ENCHANTMENTS)[number] | null) =>
    e && e.legacyId === undefined ? ENCHANTMENTS.find((x) => x.legacyId !== undefined) ?? e : e;

  next.give = { ...state.give, item: patchItem(state.give.item) };
  next.clear = { ...state.clear, item: patchItem(state.clear.item) };
  next.setblock = { ...state.setblock, block: patchItem(state.setblock.block) };
  next.fill = { ...state.fill, block: patchItem(state.fill.block) };
  next.summon = { ...state.summon, entity: patchEntity(state.summon.entity) };
  next.effect = { ...state.effect, effect: patchEffect(state.effect.effect) };
  next.enchant = { ...state.enchant, enchant: patchEnchant(state.enchant.enchant) };
  next.give = {
    ...next.give,
    enchants: state.give.enchants.filter((e) => {
      const def = ENCHANTMENTS.find((x) => x.id === e.id);
      return def && def.legacyId !== undefined;
    }),
  };
  return next;
}

export { BLOCKS, itemsForVersion };