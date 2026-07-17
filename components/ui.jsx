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
