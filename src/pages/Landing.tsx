import { SiteNav } from "@/components/SiteNav";
import { highlightCommand } from "@/components/generator/CommandText";
import { EFFECTS } from "@/data/mc/effects";
import { ENTITIES } from "@/data/mc/entities";
import { ITEMS } from "@/data/mc/items";
import { ENCHANTMENTS } from "@/data/mc/enchantments";
import { CATEGORIES, GENERATORS } from "@/components/generator/registry";
import { motion } from "framer-motion";
import { ArrowRight, Copy, TerminalSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function useTypewriter(text: string, speed = 12, startDelay = 500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
    };
  }, [text, speed, startDelay]);
  return text.slice(0, count);
}

const HERO_COMMAND =
  '/give @p minecraft:diamond_sword{Enchantments:[{id:"minecraft:sharpness",lvl:5s}],Unbreakable:1b,display:{Name:\'{"text":"Blade of the Terminal"}\'}} 1';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function Landing() {
  const typed = useTypewriter(HERO_COMMAND);
  const done = typed.length >= HERO_COMMAND.length;
  const [teaserSeed, setTeaserSeed] = useState<bigint | null>(null);

  useEffect(() => {
    const buf = new Uint32Array(2);
    crypto.getRandomValues(buf);
    const v = ((BigInt(buf[0]) << 32n) | BigInt(buf[1])) & ((1n << 63n) - 1n);
    setTeaserSeed(v);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Status strip */}
      <div className="border-b border-border bg-secondary/50">
        <p className="mx-auto max-w-[1200px] px-4 py-1.5 text-center font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          <span className="text-amber-700">//</span> mcgen v1.0 — minecraft command generator · mc 1.8 → 1.21 · no mods required
        </p>
      </div>

      <SiteNav />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="term-grid relative overflow-hidden border-b border-border">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <p className="mb-4 font-mono text-[12px] tracking-[0.14em] text-emerald-700 uppercase">
                $ craft commands, not syntax
              </p>
              <h1 className="font-mono text-4xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-5xl">
                GENERATE THE
                <br />
                PERFECT COMMAND<span className="text-emerald-700">.</span>
              </h1>
              <p className="mt-5 max-w-md font-mono text-[13px] leading-6 text-muted-foreground">
                A point-and-click command builder for Minecraft — the way
                MCStacker does it. Pick a generator, tweak the options, and the
                command rewrites itself live. For every version from 1.8 to
                1.21.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/generator"
                  className="group inline-flex h-10 items-center gap-2 rounded-md bg-emerald-800 px-5 font-mono text-[13px] font-semibold text-emerald-50 transition-colors hover:bg-emerald-900"
                >
                  $ launch generator
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/seeds"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-amber-700/40 bg-amber-700/5 px-5 font-mono text-[13px] text-amber-800 transition-colors hover:bg-amber-700/15"
                >
                  $ open seed lab
                </Link>
              </div>
              <p className="mt-6 font-mono text-[11px] text-muted-foreground">
                <span className="text-emerald-700">✓</span> free · runs entirely in your browser
              </p>
            </motion.div>

            {/* Terminal window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="panel relative shadow-[0_24px_60px_-24px_oklch(0.3_0.03_80/0.35)]"
            >
              <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="size-2 rounded-full bg-[oklch(0.7_0.1_30)]" />
                    <span className="size-2 rounded-full bg-[oklch(0.65_0.1_85)]" />
                    <span className="size-2 rounded-full bg-[oklch(0.55_0.1_150)]" />
                  </span>
                  <span className="tick-label ml-1">mcgen — give</span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium text-emerald-700">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-600" />
                  LIVE
                </span>
              </div>
              <div className="min-h-[190px] px-4 py-4">
                <p className="font-mono text-[12px] text-muted-foreground">
                  <span className="text-emerald-700">$</span> target <span className="text-amber-700">@p</span> · item{" "}
                  <span className="text-amber-700">diamond_sword</span> · sharpness <span className="text-amber-700">V</span> ·
                  unbreakable <span className="text-amber-700">✓</span>
                </p>
                <pre className="mt-3 font-mono text-[12.5px] leading-6 whitespace-pre-wrap break-all text-foreground">
                  {highlightCommand(HERO_COMMAND.slice(0, typed.length))}
                  <span className="cursor-blink text-emerald-700">▊</span>
                </pre>
                <div className="mt-4 h-6">
                  {done && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-[11px] text-emerald-700"
                    >
                      ✓ command ready — paste into your world
                    </motion.p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-3 py-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  len {typed.length} / {HERO_COMMAND.length} · mc 1.21
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Copy className="size-3" /> ctrl+c
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 divide-x divide-border px-4 sm:grid-cols-4">
            {[
              { value: `${GENERATORS.length}`, label: "generators" },
              { value: "1.8–1.21", label: "versions supported" },
              { value: `${ITEMS.length}+`, label: "items" },
              { value: `${ENTITIES.length}+`, label: "entities" },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-5 text-center sm:py-6">
                <p className="font-mono text-xl font-bold text-foreground sm:text-2xl">{stat.value}</p>
                <p className="tick-label mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Generator catalog ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1200px] px-4 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="tick-label mb-2">
                <span className="text-emerald-700">//</span> 01 · catalog
              </p>
              <h2 className="font-mono text-2xl font-bold tracking-tight text-foreground">
                EVERY GENERATOR, ALL AT ONCE
              </h2>
            </div>
            <Link
              to="/generator"
              className="hidden items-center gap-1.5 font-mono text-[12px] text-emerald-700 hover:underline sm:flex"
            >
              open the full tool <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const gens = GENERATORS.filter((g) => g.category === cat.id);
              return (
                <div key={cat.id} className="panel flex flex-col p-4">
                  <p className="tick-label mb-3 border-b border-dashed border-border pb-2">
                    {cat.label}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {gens.map((g) => (
                      <li key={g.id}>
                        <Link
                          to={`/generator?g=${g.id}`}
                          className="group flex items-center gap-2 rounded px-1.5 py-1 font-mono text-[13px] text-foreground transition-colors hover:bg-emerald-700/10"
                        >
                          <span className="text-[10px] text-muted-foreground/60 transition-colors group-hover:text-emerald-700">
                            ▸
                          </span>
                          /{g.label.toLowerCase()}
                          <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground/70 group-hover:text-emerald-700 sm:inline">
                            {g.description.split("—")[0].trim()}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────── */}
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-[1200px] px-4 py-16">
            <p className="tick-label mb-2">
              <span className="text-emerald-700">//</span> 02 · features
            </p>
            <h2 className="mb-10 font-mono text-2xl font-bold tracking-tight text-foreground">
              BUILT LIKE A TERMINAL —<br className="sm:hidden" /> THINKING LIKE A BUILDER
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Live edit */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="panel p-5"
              >
                <p className="flex items-center gap-2 font-mono text-[12px] font-semibold text-emerald-700">
                  <TerminalSquare className="size-4" /> LIVE EDIT
                </p>
                <p className="mt-3 font-mono text-[12px] leading-6 text-muted-foreground">
                  Every checkbox and keystroke rewrites the command instantly.
                  Enchantments, display names, NBT — no “generate” button, ever.
                </p>
                <div className="mt-4 rounded-md border border-border bg-card p-3 font-mono text-[11px] leading-5">
                  <p className="text-muted-foreground">
                    <span className="text-emerald-700">$</span> +sharpness →{" "}
                    <span className="text-foreground">Enchantments:[&#123;id:"minecraft:sharpness"…&#125;]</span>
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    <span className="text-emerald-700">$</span> +name →{" "}
                    <span className="text-foreground">display:&#123;Name:'&#123;"text":"…"&#125;'&#125;</span>
                  </p>
                </div>
              </motion.div>

              {/* Version switch */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ delay: 0.08 }}
                className="panel p-5"
              >
                <p className="flex items-center gap-2 font-mono text-[12px] font-semibold text-emerald-700">
                  <TerminalSquare className="size-4" /> VERSION SWITCH
                </p>
                <p className="mt-3 font-mono text-[12px] leading-6 text-muted-foreground">
                  Flip between modern (1.13+) and legacy (1.12-) syntax. Item
                  ids, data values, NBT formats and command structure adapt
                  automatically.
                </p>
                <div className="mt-4 rounded-md border border-border bg-card p-3 font-mono text-[11px] leading-5">
                  <p className="text-muted-foreground">
                    MC 1.21 → <span className="text-foreground">minecraft:red_wool</span>
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    MC 1.12 → <span className="text-foreground">minecraft:wool 14</span>
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    MC 1.8 → <span className="text-foreground">/give @p minecraft:wool 1 14</span>
                  </p>
                </div>
              </motion.div>

              {/* Item database */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ delay: 0.16 }}
                className="panel p-5"
              >
                <p className="flex items-center gap-2 font-mono text-[12px] font-semibold text-emerald-700">
                  <TerminalSquare className="size-4" /> FULL ITEM INDEX
                </p>
                <p className="mt-3 font-mono text-[12px] leading-6 text-muted-foreground">
                  {ITEMS.length} items, {ENTITIES.length} entities, {EFFECTS.length} effects
                  and {ENCHANTMENTS.length} enchantments — every one searchable
                  by name or id.
                </p>
                <div className="mt-4 rounded-md border border-border bg-card p-3 font-mono text-[11px] leading-5">
                  <p className="text-muted-foreground">
                    <span className="text-emerald-700">▸</span> <span className="text-foreground">netherite_pickaxe</span> — Netherite Pickaxe
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    <span className="text-emerald-700">▸</span> <span className="text-foreground">warden</span> — Warden
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    <span className="text-emerald-700">▸</span> <span className="text-foreground">swift_sneak</span> — Swift Sneak
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Seed lab teaser ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1200px] px-4 py-16">
          <div className="panel overflow-hidden border-amber-700/30">
            <div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
              <div>
                <p className="tick-label mb-2">
                  <span className="text-amber-700">//</span> 03 · seed lab
                </p>
                <h2 className="font-mono text-2xl font-bold tracking-tight text-foreground">
                  NEED A WORLD? GENERATE A SEED.
                </h2>
                <p className="mt-2 max-w-lg font-mono text-[13px] leading-6 text-muted-foreground">
                  Cryptographic random 63-bit Java seeds — the kind Minecraft
                  actually accepts. Hit generate, copy, paste.
                </p>
                <Link
                  to="/seeds"
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-amber-700/40 bg-amber-700/5 px-5 font-mono text-[13px] text-amber-800 transition-colors hover:bg-amber-700/15"
                >
                  $ open seed lab <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="min-w-[260px]">
                <div className="rounded-md border border-amber-700/40 bg-amber-700/5 p-4">
                  <p className="tick-label mb-2">// freshly generated</p>
                  <p className="font-mono text-[15px] font-semibold break-all text-foreground">
                    {teaserSeed?.toString() ?? "…"}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {teaserSeed ? `hex 0x${teaserSeed.toString(16)}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1200px] px-4 py-16">
            <p className="tick-label mb-2">
              <span className="text-emerald-700">//</span> 04 · usage
            </p>
            <h2 className="mb-10 font-mono text-2xl font-bold tracking-tight text-foreground">
              THREE COMMANDS AND YOU&apos;RE DONE
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { step: "01", title: "pick a generator", body: "Give, summon, fill, execute — everything from the sidebar." },
                { step: "02", title: "set the options", body: "Search items, stack enchantments, type coordinates. Watch the output update live." },
                { step: "03", title: "copy & paste", body: "One click copies the exact command for your version. Paste into chat or a command block." },
              ].map((s) => (
                <div key={s.step} className="panel p-5">
                  <p className="font-mono text-[11px] font-bold text-emerald-700">[{s.step}]</p>
                  <p className="mt-2 font-mono text-[14px] font-semibold text-foreground">{s.title}</p>
                  <p className="mt-2 font-mono text-[12px] leading-6 text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="term-grid border-t border-border">
          <div className="mx-auto max-w-[1200px] px-4 py-20 text-center">
            <p className="mb-3 font-mono text-[12px] tracking-[0.14em] text-muted-foreground uppercase">
              <span className="text-emerald-700">$</span> ready when you are
            </p>
            <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              TYPE. PASTE. BUILD<span className="text-emerald-700">.</span>
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/generator"
                className="group inline-flex h-11 items-center gap-2 rounded-md bg-emerald-800 px-6 font-mono text-[14px] font-semibold text-emerald-50 transition-colors hover:bg-emerald-900"
              >
                $ launch generator
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/seeds"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-amber-700/40 bg-amber-700/5 px-6 font-mono text-[14px] text-amber-800 transition-colors hover:bg-amber-700/15"
              >
                $ seed lab
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-4 py-6 font-mono text-[11px] text-muted-foreground sm:flex-row">
          <p>
            <span className="text-emerald-700">▚</span> mcgen — minecraft command generator
          </p>
          <p className="flex items-center gap-3">
            <Link to="/generator" className="hover:text-foreground">generator</Link>
            <Link to="/seeds" className="hover:text-foreground">seed lab</Link>
            <Link to="/auth" className="hover:text-foreground">sign in</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}