export interface GameruleDef {
  name: string;
  type: "bool" | "int";
  defaultValue: string;
}

export const GAMERULES: GameruleDef[] = [
  { name: "doFireTick", type: "bool", defaultValue: "true" },
  { name: "mobGriefing", type: "bool", defaultValue: "true" },
  { name: "keepInventory", type: "bool", defaultValue: "false" },
  { name: "doMobSpawning", type: "bool", defaultValue: "true" },
  { name: "doMobLoot", type: "bool", defaultValue: "true" },
  { name: "doTileDrops", type: "bool", defaultValue: "true" },
  { name: "doEntityDrops", type: "bool", defaultValue: "true" },
  { name: "doDaylightCycle", type: "bool", defaultValue: "true" },
  { name: "doWeatherCycle", type: "bool", defaultValue: "true" },
  { name: "naturalRegeneration", type: "bool", defaultValue: "true" },
  { name: "commandBlockOutput", type: "bool", defaultValue: "true" },
  { name: "sendCommandFeedback", type: "bool", defaultValue: "true" },
  { name: "showDeathMessages", type: "bool", defaultValue: "true" },
  { name: "reducedDebugInfo", type: "bool", defaultValue: "false" },
  { name: "doImmediateRespawn", type: "bool", defaultValue: "false" },
  { name: "doLimitedCrafting", type: "bool", defaultValue: "false" },
  { name: "doInsomnia", type: "bool", defaultValue: "true" },
  { name: "doPatrolSpawning", type: "bool", defaultValue: "true" },
  { name: "doTraderSpawning", type: "bool", defaultValue: "true" },
  { name: "doWardenSpawning", type: "bool", defaultValue: "true" },
  { name: "spectatorsGenerateChunks", type: "bool", defaultValue: "true" },
  { name: "disableElytraMovementCheck", type: "bool", defaultValue: "false" },
  { name: "logAdminCommands", type: "bool", defaultValue: "true" },
  { name: "randomTickSpeed", type: "int", defaultValue: "3" },
  { name: "maxCommandChainLength", type: "int", defaultValue: "65536" },
  { name: "maxEntityCramming", type: "int", defaultValue: "24" },
  { name: "spawnRadius", type: "int", defaultValue: "10" },
  { name: "playersSleepingPercentage", type: "int", defaultValue: "100" },
];