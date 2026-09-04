export interface EffectDef {
  name: string;
  id: string;
  /** False = added after 1.12, filtered out in legacy mode. */
  legacy?: boolean;
}

export const EFFECTS: EffectDef[] = [
  { name: "Speed", id: "speed" },
  { name: "Slowness", id: "slowness" },
  { name: "Haste", id: "haste" },
  { name: "Mining Fatigue", id: "mining_fatigue" },
  { name: "Strength", id: "strength" },
  { name: "Instant Health", id: "instant_health" },
  { name: "Instant Damage", id: "instant_damage" },
  { name: "Jump Boost", id: "jump_boost" },
  { name: "Nausea", id: "nausea" },
  { name: "Regeneration", id: "regeneration" },
  { name: "Resistance", id: "resistance" },
  { name: "Fire Resistance", id: "fire_resistance" },
  { name: "Water Breathing", id: "water_breathing" },
  { name: "Invisibility", id: "invisibility" },
  { name: "Blindness", id: "blindness" },
  { name: "Night Vision", id: "night_vision" },
  { name: "Hunger", id: "hunger" },
  { name: "Weakness", id: "weakness" },
  { name: "Poison", id: "poison" },
  { name: "Wither", id: "wither" },
  { name: "Health Boost", id: "health_boost" },
  { name: "Absorption", id: "absorption" },
  { name: "Saturation", id: "saturation" },
  { name: "Glowing", id: "glowing" },
  { name: "Levitation", id: "levitation" },
  { name: "Luck", id: "luck" },
  { name: "Unluck", id: "unluck" },
  { name: "Slow Falling", id: "slow_falling", legacy: false },
  { name: "Conduit Power", id: "conduit_power", legacy: false },
  { name: "Dolphin's Grace", id: "dolphins_grace", legacy: false },
  { name: "Bad Omen", id: "bad_omen", legacy: false },
  { name: "Hero of the Village", id: "hero_of_the_village", legacy: false },
  { name: "Darkness", id: "darkness", legacy: false },
];

export const effectById = new Map(EFFECTS.map((effect) => [effect.id, effect]));

export function effectsForVersion(legacy: boolean): EffectDef[] {
  return legacy ? EFFECTS.filter((e) => e.legacy !== false) : EFFECTS;
}