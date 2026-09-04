export interface EntityDef {
  name: string;
  /** Modern namespaced id (1.13+). */
  id: string;
  /** Legacy (1.12-) summon id; defaults to `name`. Absent = not in 1.12-. */
  legacy?: string;
}

export const ENTITIES: EntityDef[] = [
  // ── Hostile mobs ──────────────────────────────────────────────────────────
  { name: "Zombie", id: "zombie" },
  { name: "Husk", id: "husk" },
  { name: "Drowned", id: "drowned" },
  { name: "Zombie Villager", id: "zombie_villager" },
  { name: "Zombified Piglin", id: "zombified_piglin", legacy: "PigZombie" },
  { name: "Skeleton", id: "skeleton" },
  { name: "Stray", id: "stray" },
  { name: "Wither Skeleton", id: "wither_skeleton", legacy: "WitherSkeleton" },
  { name: "Creeper", id: "creeper" },
  { name: "Spider", id: "spider" },
  { name: "Cave Spider", id: "cave_spider", legacy: "CaveSpider" },
  { name: "Enderman", id: "enderman" },
  { name: "Endermite", id: "endermite" },
  { name: "Silverfish", id: "silverfish" },
  { name: "Witch", id: "witch" },
  { name: "Slime", id: "slime" },
  { name: "Magma Cube", id: "magma_cube", legacy: "MagmaCube" },
  { name: "Ghast", id: "ghast" },
  { name: "Blaze", id: "blaze" },
  { name: "Guardian", id: "guardian" },
  { name: "Elder Guardian", id: "elder_guardian", legacy: "ElderGuardian" },
  { name: "Phantom", id: "phantom" },
  { name: "Shulker", id: "shulker" },
  { name: "Vex", id: "vex" },
  { name: "Pillager", id: "pillager" },
  { name: "Vindicator", id: "vindicator" },
  { name: "Evoker", id: "evoker" },
  { name: "Ravager", id: "ravager" },
  { name: "Warden", id: "warden" },
  { name: "Piglin", id: "piglin" },
  { name: "Piglin Brute", id: "piglin_brute", legacy: "PiglinBrute" },
  { name: "Hoglin", id: "hoglin" },
  { name: "Zoglin", id: "zoglin" },
  { name: "Illusioner", id: "illusioner", legacy: "Illusioner" },
  { name: "Giant", id: "giant", legacy: "Giant" },

  // ── Passive / neutral mobs ────────────────────────────────────────────────
  { name: "Allay", id: "allay" },
  { name: "Axolotl", id: "axolotl" },
  { name: "Bat", id: "bat" },
  { name: "Bee", id: "bee" },
  { name: "Cat", id: "cat" },
  { name: "Chicken", id: "chicken" },
  { name: "Cod", id: "cod" },
  { name: "Cow", id: "cow" },
  { name: "Dolphin", id: "dolphin" },
  { name: "Donkey", id: "donkey" },
  { name: "Fox", id: "fox" },
  { name: "Frog", id: "frog" },
  { name: "Glow Squid", id: "glow_squid", legacy: "GlowSquid" },
  { name: "Goat", id: "goat" },
  { name: "Horse", id: "horse" },
  { name: "Iron Golem", id: "iron_golem", legacy: "VillagerGolem" },
  { name: "Llama", id: "llama" },
  { name: "Mooshroom", id: "mooshroom" },
  { name: "Mule", id: "mule" },
  { name: "Ocelot", id: "ocelot" },
  { name: "Panda", id: "panda" },
  { name: "Parrot", id: "parrot" },
  { name: "Pig", id: "pig" },
  { name: "Polar Bear", id: "polar_bear", legacy: "PolarBear" },
  { name: "Pufferfish", id: "pufferfish" },
  { name: "Rabbit", id: "rabbit" },
  { name: "Salmon", id: "salmon" },
  { name: "Sheep", id: "sheep" },
  { name: "Snow Golem", id: "snow_golem", legacy: "SnowMan" },
  { name: "Squid", id: "squid" },
  { name: "Strider", id: "strider" },
  { name: "Tadpole", id: "tadpole" },
  { name: "Trader Llama", id: "trader_llama", legacy: "TraderLlama" },
  { name: "Tropical Fish", id: "tropical_fish", legacy: "TropicalFish" },
  { name: "Turtle", id: "turtle" },
  { name: "Villager", id: "villager" },
  { name: "Wandering Trader", id: "wandering_trader", legacy: "WanderingTrader" },
  { name: "Wolf", id: "wolf" },
  { name: "Zombie Horse", id: "zombie_horse", legacy: "ZombieHorse" },
  { name: "Skeleton Horse", id: "skeleton_horse", legacy: "SkeletonHorse" },

  // ── Bosses ────────────────────────────────────────────────────────────────
  { name: "Ender Dragon", id: "ender_dragon", legacy: "EnderDragon" },
  { name: "Wither", id: "wither" },

  // ── Projectiles & effects ─────────────────────────────────────────────────
  { name: "Fireball", id: "fireball" },
  { name: "Small Fireball", id: "small_fireball", legacy: "SmallFireball" },
  { name: "Dragon Fireball", id: "dragon_fireball", legacy: "DragonFireball" },
  { name: "Wither Skull", id: "wither_skull", legacy: "WitherSkull" },
  { name: "Shulker Bullet", id: "shulker_bullet", legacy: "ShulkerBullet" },
  { name: "Snowball (projectile)", id: "snowball" },
  { name: "Ender Pearl (projectile)", id: "ender_pearl", legacy: "ThrownEnderpearl" },
  { name: "Arrow (projectile)", id: "arrow" },
  { name: "Spectral Arrow (projectile)", id: "spectral_arrow", legacy: "SpectralArrow" },
  { name: "Lightning Bolt", id: "lightning_bolt", legacy: "LightningBolt" },
  { name: "Area Effect Cloud", id: "area_effect_cloud", legacy: "AreaEffectCloud" },
  { name: "Trident (projectile)", id: "trident" },

  // ── Misc entities ─────────────────────────────────────────────────────────
  { name: "Armor Stand", id: "armor_stand", legacy: "ArmorStand" },
  { name: "Boat", id: "boat" },
  { name: "Minecart", id: "minecart", legacy: "MinecartRideable" },
  { name: "Chest Minecart", id: "chest_minecart", legacy: "MinecartChest" },
  { name: "Furnace Minecart", id: "furnace_minecart", legacy: "MinecartFurnace" },
  { name: "TNT Minecart", id: "tnt_minecart", legacy: "MinecartTNT" },
  { name: "Hopper Minecart", id: "hopper_minecart", legacy: "MinecartHopper" },
  { name: "Command Block Minecart", id: "command_block_minecart", legacy: "MinecartCommandBlock" },
  { name: "Experience Orb", id: "experience_orb", legacy: "XPOrb" },
  { name: "Item (dropped)", id: "item" },
  { name: "Item Frame", id: "item_frame", legacy: "ItemFrame" },
  { name: "Painting", id: "painting" },
  { name: "Primed TNT", id: "tnt", legacy: "PrimedTnt" },
  { name: "Falling Block", id: "falling_block", legacy: "FallingSand" },
  { name: "Ender Crystal", id: "end_crystal", legacy: "EnderCrystal" },
];

export const entityById = new Map(ENTITIES.map((entity) => [entity.id, entity]));

export function entitiesForVersion(legacy: boolean): EntityDef[] {
  return legacy ? ENTITIES.filter((e) => e.legacy) : ENTITIES;
}

export function entitySummonId(entity: EntityDef, legacy: boolean): string {
  if (legacy) return entity.legacy ?? entity.name;
  return `minecraft:${entity.id}`;
}