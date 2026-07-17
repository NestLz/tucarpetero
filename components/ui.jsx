import Link from "next/link";
import { conditionInfo } from "@/lib/data";

export function CardArt({ src, alt }) {
  if (typeof src === "string" && src.startsWith("http")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="h-full w-full object-contain p-1.5 drop-shadow-md" />;
  }
  return <>{src}</>;
}

export function Chip({ children, className = "" }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border border-line px-2.5 py-[3px] text-[11px] font-semibold text-mut ${className}`}
    >
      {children}
    </span>
  );
}

export function SolidChip({ children, color = "bg-vio" }) {
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-semibold text-white ${color}`}>
      {children}
    </span>
  );
}

export function ConditionChip({ cond }) {
  const info = conditionInfo(cond);
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[11px] font-semibold ${info.chipClass}`}
    >
      {cond}
      <Link
        href={`/condiciones#${info.id}`}
        onClick={(e) => e.stopPropagation()}
        className="opacity-70 transition hover:opacity-100"
        title="¿Qué significa esta condición?"
      >
        ⓘ
      </Link>
    </span>
  );
}

export function Verified() {
  return (
    <span className="holo inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10.5px] font-bold text-white">
      ✓ Verificado
    </span>
  );
}

export function Stars({ v }) {
  return (
    <span className="text-xs tracking-wider text-amber">
      {"★".repeat(Math.round(v))}
      <span className="ml-1.5 font-bold text-body">{v}</span>
    </span>
  );
}
