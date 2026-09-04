import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { Vec3 } from "@/lib/mc/commands";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label className="tick-label text-[11px]">{label}</Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function TextInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("font-mono text-[13px] shadow-none", className)}
      {...props}
    />
  );
}

export function NumberInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      type="number"
      className={cn("font-mono text-[13px] shadow-none", className)}
      {...props}
    />
  );
}

export function SelectField({
  label,
  value,
  onValueChange,
  placeholder,
  options,
  hint,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full font-mono text-[13px] shadow-none">
          <SelectValue placeholder={placeholder ?? "Select…"} />
        </SelectTrigger>
        <SelectContent className="font-mono text-[13px]">
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function CheckField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Label className="flex cursor-pointer items-center gap-2 text-[13px] font-normal">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
      />
      {label}
    </Label>
  );
}

export function CoordRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Vec3;
  onChange: (v: Vec3) => void;
}) {
  const axes: (keyof Vec3)[] = ["x", "y", "z"];
  return (
    <Field label={label}>
      <div className="grid grid-cols-3 gap-1.5">
        {axes.map((axis) => (
          <div key={axis} className="relative">
            <span className="tick-label pointer-events-none absolute top-2 left-2 text-[10px] text-muted-foreground">
              {axis}
            </span>
            <TextInput
              value={value[axis]}
              onChange={(e) => onChange({ ...value, [axis]: e.target.value })}
              className="h-9 pl-7"
              aria-label={`${label} ${axis}`}
            />
          </div>
        ))}
      </div>
    </Field>
  );
}

const TARGET_PRESETS = ["@p", "@a", "@r", "@e", "@s"];

export function TargetField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field
      label="Target"
      hint="or type a selector like @e[type=zombie]"
    >
      <div className="flex gap-1.5">
        {TARGET_PRESETS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
              "h-9 min-w-9 rounded-md border px-2 font-mono text-[12px] transition-colors",
              value === t
                ? "border-emerald-700/50 bg-emerald-700/10 text-emerald-800"
                : "border-border bg-card text-foreground hover:bg-accent",
            )}
          >
            {t}
          </button>
        ))}
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="@p"
        />
      </div>
    </Field>
  );
}