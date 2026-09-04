export interface EnchantDef {
  name: string;
  id: string;
  /** Legacy (1.12-) numeric enchantment id for NBT. Absent = not in 1.12-. */
  legacyId?: number;
}

export const ENCHANTMENTS: EnchantDef[] = [
  { name: "Protection", id: "protection", legacyId: 0 },
  { name: "Fire Protection", id: "fire_protection", legacyId: 1 },
  { name: "Feather Falling", id: "feather_falling", legacyId: 2 },
  { name: "Blast Protection", id: "blast_protection", legacyId: 3 },
  { name: "Projectile Protection", id: "projectile_protection", legacyId: 4 },
  { name: "Respiration", id: "respiration", legacyId: 5 },
  { name: "Aqua Affinity", id: "aqua_affinity", legacyId: 6 },
  { name: "Thorns", id: "thorns", legacyId: 7 },
  { name: "Depth Strider", id: "depth_strider", legacyId: 8 },
  { name: "Frost Walker", id: "frost_walker", legacyId: 9 },
  { name: "Curse of Binding", id: "binding_curse", legacyId: 10 },
  { name: "Curse of Vanishing", id: "vanishing_curse", legacyId: 11 },
  { name: "Sharpness", id: "sharpness", legacyId: 16 },
  { name: "Smite", id: "smite", legacyId: 17 },
  { name: "Bane of Arthropods", id: "bane_of_arthropods", legacyId: 18 },
  { name: "Knockback", id: "knockback", legacyId: 19 },
  { name: "Fire Aspect", id: "fire_aspect", legacyId: 20 },
  { name: "Looting", id: "looting", legacyId: 21 },
  { name: "Sweeping Edge", id: "sweeping_edge", legacyId: 22 },
  { name: "Efficiency", id: "efficiency", legacyId: 32 },
  { name: "Silk Touch", id: "silk_touch", legacyId: 33 },
  { name: "Unbreaking", id: "unbreaking", legacyId: 34 },
  { name: "Fortune", id: "fortune", legacyId: 35 },
  { name: "Power", id: "power", legacyId: 48 },
  { name: "Punch", id: "punch", legacyId: 49 },
  { name: "Flame", id: "flame", legacyId: 50 },
  { name: "Infinity", id: "infinity", legacyId: 51 },
  { name: "Luck of the Sea", id: "luck_of_the_sea", legacyId: 61 },
  { name: "Lure", id: "lure", legacyId: 62 },
  { name: "Loyalty", id: "loyalty", legacyId: 65 },
  { name: "Impaling", id: "impaling", legacyId: 66 },
  { name: "Riptide", id: "riptide", legacyId: 67 },
  { name: "Channeling", id: "channeling", legacyId: 68 },
  { name: "Mending", id: "mending", legacyId: 70 },
  { name: "Multishot", id: "multishot" },
  { name: "Piercing", id: "piercing" },
  { name: "Quick Charge", id: "quick_charge" },
  { name: "Soul Speed", id: "soul_speed" },
  { name: "Swift Sneak", id: "swift_sneak" },
];

export const enchantById = new Map(
  ENCHANTMENTS.map((enchant) => [enchant.id, enchant]),
);

export function enchantsForVersion(legacy: boolean): EnchantDef[] {
  return legacy ? ENCHANTMENTS.filter((e) => e.legacyId !== undefined) : ENCHANTMENTS;
}