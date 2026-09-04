import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/generator", label: "Editor" },
  { to: "/seeds", label: "Seed Lab" },
];

export function SiteNav() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-[15px] font-bold tracking-tight text-foreground"
        >
          <span className="text-emerald-700">▚</span> MC Command Pro
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-md px-2.5 py-1.5 font-mono text-[12px] transition-colors",
                pathname.startsWith(link.to)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/auth"
            className="ml-2 rounded-md border border-border px-2.5 py-1.5 font-mono text-[12px] text-foreground transition-colors hover:bg-accent"
          >
            sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}