import {
  buildClear,
  buildClone,
  buildDifficulty,
  buildEffect,
  buildEnchant,
  buildExecute,
  buildFill,
  buildGamemode,
  buildGamerule,
  buildGive,
  buildKill,
  buildSetblock,
  buildSpawnpoint,
  buildSummon,
  buildTime,
  buildTp,
  buildWeather,
  fillVolume,
  type GenContext,
} from "@/lib/mc/commands";
import { DEFAULT_VERSION, isLegacyVersion, VERSION_GROUPS } from "@/data/mc/versions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CommandOutput, type OutputMeta } from "./CommandOutput";
import {
  ClearForm,
  CloneForm,
  DifficultyForm,
  EffectForm,
  EnchantForm,
  ExecuteForm,
  FillForm,
  GamemodeForm,
  GameruleForm,
  GiveForm,
  KillForm,
  SetblockForm,
  SpawnpointForm,
  SummonForm,
  TimeForm,
  TpForm,
  WeatherForm,
} from "./forms";
import {
  CATEGORIES,
  GENERATORS,
  generatorById,
  makeDefaultState,
  sanitizeState,
  type GenState,
  type GeneratorId,
} from "./registry";

const builders: {
  [K in GeneratorId]: (state: GenState[K], ctx: GenContext) => string;
} = {
  give: buildGive,
  clear: buildClear,
  enchant: buildEnchant,
  setblock: buildSetblock,
  fill: buildFill,
  clone: buildClone,
  summon: buildSummon,
  effect: buildEffect,
  execute: buildExecute,
  gamemode: buildGamemode,
  difficulty: buildDifficulty,
  time: buildTime,
  weather: buildWeather,
  kill: buildKill,
  tp: buildTp,
  spawnpoint: buildSpawnpoint,
  gamerule: buildGamerule,
};

function metaFor(id: GeneratorId, state: GenState[GeneratorId]): OutputMeta[] {
  if (id === "fill") {
    const volume = fillVolume(state as GenState["fill"]);
    return [{ label: "volume", value: volume === null ? "n/a (~ coords)" : `${volume.toLocaleString()} blocks` }];
  }
  if (id === "give") {
    const s = state as GenState["give"];
    return [
      { label: "enchants", value: String(s.enchants.length) },
      { label: "count", value: String(s.count) },
    ];
  }
  return [];
}

function tipsFor(id: GeneratorId, legacy: boolean): string[] {
  switch (id) {
    case "give":
      return legacy
        ? ["Legacy NBT uses numeric enchantment ids (sharpness = 16).", "Display names use plain strings in 1.12-."]
        : ["Names are raw JSON components — quotes are escaped automatically.", "Enchantment levels are short integers (5s)."];
    case "summon":
      return legacy
        ? ["Legacy summoning uses the class name (e.g. PigZombie)."]
        : ["NBT goes inside the braces right after the entity id."];
    case "execute":
      return legacy
        ? ["Legacy /execute runs from the target's position — no as/at."]
        : ["Leave \"as\" empty to run from the command's context.", "\"if entity\" runs the command only when matches exist."];
    case "setblock":
      return [legacy ? "The data value (e.g. 14 for red wool) is added automatically." : "Block states (facing, waterlogged, …) can be added manually in-game."];
    default:
      return [];
  }
}

export default function GeneratorApp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("g") ?? "give";
  const activeId: GeneratorId = generatorById.has(requested as GeneratorId)
    ? (requested as GeneratorId)
    : "give";
  const active = generatorById.get(activeId)!;

  const [version, setVersion] = useState<string>(() => {
    const saved = localStorage.getItem("mcgen-version") ?? "";
    return VERSION_GROUPS.flatMap((g) => g.versions).includes(saved) ? saved : DEFAULT_VERSION;
  });
  const legacy = isLegacyVersion(version);
  const ctx: GenContext = useMemo(() => ({ legacy, version }), [legacy, version]);

  const [state, setState] = useState<GenState>(makeDefaultState);

  const patch = useCallback(
    <K extends GeneratorId>(id: K, partial: Partial<GenState[K]>) => {
      setState((s) => ({ ...s, [id]: { ...s[id], ...partial } }));
    },
    [],
  );

  useEffect(() => {
    localStorage.setItem("mcgen-version", version);
  }, [version]);

  useEffect(() => {
    setState((s) => sanitizeState(s, legacy));
  }, [legacy]);

  const selectGenerator = (id: string) => {
    setSearchParams(id === "give" ? {} : { g: id });
  };

  const command = useMemo(() => {
    const fn = builders[activeId] as (
      s: GenState[GeneratorId],
      c: GenContext,
    ) => string;
    return fn(state[activeId] as GenState[GeneratorId], ctx);
  }, [state, activeId, ctx]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-mono text-[15px] font-bold text-foreground">
            <span className="text-emerald-700">▚</span> mcgen
            <span className="hidden text-[10px] font-normal tracking-[0.14em] text-muted-foreground uppercase sm:inline">
              command generator
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/seeds"
              className="hidden rounded-md border border-amber-700/40 bg-amber-700/5 px-2.5 py-1.5 font-mono text-[12px] text-amber-800 transition-colors hover:bg-amber-700/15 sm:block"
            >
              seed lab
            </Link>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger className="h-8 w-[130px] font-mono text-[12px] shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono text-[12px]">
                {VERSION_GROUPS.map((group) => (
                  <SelectGroup key={group.group}>
                    <SelectLabel className="tick-label">{group.group}</SelectLabel>
                    {group.versions.map((v) => (
                      <SelectItem key={v} value={v}>
                        MC {v}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-5">
        <div className="grid items-start gap-4 lg:grid-cols-[210px_minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* Generator sidebar */}
          <aside className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-5 lg:overflow-visible lg:pb-0">
            {CATEGORIES.map((cat) => {
              const gens = GENERATORS.filter((g) => g.category === cat.id);
              return (
                <div key={cat.id} className="flex shrink-0 flex-col gap-1">
                  <span className="tick-label hidden px-2 lg:block">{cat.label}</span>
                  <div className="flex gap-1 lg:flex-col">
                    {gens.map((g) => {
                      const isActive = g.id === activeId;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => selectGenerator(g.id)}
                          className={cn(
                            "rounded-md border px-3 py-1.5 text-left font-mono text-[12px] whitespace-nowrap transition-colors",
                            isActive
                              ? "border-emerald-700/50 bg-emerald-700/10 font-semibold text-emerald-800"
                              : "border-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <span className={cn("mr-1.5", isActive ? "text-emerald-700" : "text-muted-foreground/50")}>
                            {isActive ? "▸" : "·"}
                          </span>
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Options panel */}
          <section key={activeId} className="panel p-4">
            <div className="mb-4 flex items-baseline justify-between gap-2 border-b border-dashed border-border pb-3">
              <div>
                <h1 className="font-mono text-[16px] font-bold text-foreground">
                  <span className="text-emerald-700">/</span>
                  {active.label.toLowerCase()}
                </h1>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {active.description}
                </p>
              </div>
              <span className="hidden items-center gap-1.5 font-mono text-[10px] font-medium text-emerald-700 sm:flex">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-600" />
                live edit
              </span>
            </div>
            {renderForm(activeId, state, patch, ctx)}
          </section>

          {/* Output panel */}
          <section className="lg:sticky lg:top-[72px]">
            <CommandOutput
              command={command}
              version={version}
              legacy={legacy}
              meta={metaFor(activeId, state[activeId])}
              tips={tipsFor(activeId, legacy)}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function renderForm(
  id: GeneratorId,
  state: GenState,
  patch: <K extends GeneratorId>(id: K, partial: Partial<GenState[K]>) => void,
  ctx: GenContext,
) {
  switch (id) {
    case "give":
      return <GiveForm value={state.give} patch={(p) => patch("give", p)} ctx={ctx} />;
    case "clear":
      return <ClearForm value={state.clear} patch={(p) => patch("clear", p)} ctx={ctx} />;
    case "enchant":
      return <EnchantForm value={state.enchant} patch={(p) => patch("enchant", p)} ctx={ctx} />;
    case "setblock":
      return <SetblockForm value={state.setblock} patch={(p) => patch("setblock", p)} ctx={ctx} />;
    case "fill":
      return <FillForm value={state.fill} patch={(p) => patch("fill", p)} ctx={ctx} />;
    case "clone":
      return <CloneForm value={state.clone} patch={(p) => patch("clone", p)} />;
    case "summon":
      return <SummonForm value={state.summon} patch={(p) => patch("summon", p)} ctx={ctx} />;
    case "effect":
      return <EffectForm value={state.effect} patch={(p) => patch("effect", p)} ctx={ctx} />;
    case "execute":
      return <ExecuteForm value={state.execute} patch={(p) => patch("execute", p)} ctx={ctx} />;
    case "gamemode":
      return <GamemodeForm value={state.gamemode} patch={(p) => patch("gamemode", p)} />;
    case "difficulty":
      return <DifficultyForm value={state.difficulty} patch={(p) => patch("difficulty", p)} />;
    case "time":
      return <TimeForm value={state.time} patch={(p) => patch("time", p)} />;
    case "weather":
      return <WeatherForm value={state.weather} patch={(p) => patch("weather", p)} />;
    case "kill":
      return <KillForm value={state.kill} patch={(p) => patch("kill", p)} />;
    case "tp":
      return <TpForm value={state.tp} patch={(p) => patch("tp", p)} />;
    case "spawnpoint":
      return <SpawnpointForm value={state.spawnpoint} patch={(p) => patch("spawnpoint", p)} />;
    case "gamerule":
      return <GameruleForm value={state.gamerule} patch={(p) => patch("gamerule", p)} />;
  }
}