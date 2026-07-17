import Link from "next/link";
import { CONDITIONS } from "@/lib/data";

const ILLUSTRATION_COLOR = ["#0FB5A0", "#7C5CFF", "#E8A13C", "#F97316", "#EF4444"];

// Tarjeta de muestra dibujada solo con CSS: esquinas, brillo, rayones y
// manchas escalan según el nivel de desgaste (0 = Near Mint, 4 = Dañada).
function ConditionCardArt({ level, color }) {
  const cut = 3 + level * 4;
  return (
    <div
      className="relative h-28 w-20 shrink-0 overflow-hidden bg-white shadow-sm sm:h-32 sm:w-24"
      style={{
        border: `${1 + Math.floor(level / 2)}px ${level >= 3 ? "dashed" : "solid"} ${color}`,
        clipPath: `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, ${cut}px 100%, 0 calc(100% - ${cut}px), 0 ${cut}px)`,
      }}
    >
      <div
        className="absolute inset-2 rounded-sm"
        style={{ background: `linear-gradient(155deg, ${color}55, #F7F8FB)` }}
      />
      {level <= 1 && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.75) 48%, transparent 62%)",
          }}
        />
      )}
      {level >= 2 && (
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(112deg, transparent 0 6px, rgba(90,90,90,${
              0.1 + level * 0.05
            }) 6px 7px, transparent 7px 14px)`,
          }}
        />
      )}
      {level >= 3 && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 28% 72%, rgba(120,90,50,0.28) 0%, transparent 32%), radial-gradient(circle at 78% 25%, rgba(120,90,50,0.2) 0%, transparent 28%)",
          }}
        />
      )}
      {level === 4 && (
        <div className="absolute left-[-10%] top-1/2 h-[3px] w-[120%] -rotate-[10deg] bg-red-500/60" />
      )}
    </div>
  );
}

export default function Condiciones() {
  return (
    <main>
      <header className="mb-4 flex items-center justify-between md:hidden">
        <span className="font-display text-lg font-extrabold tracking-tight">
          Tu<span className="holo-text">Carpetero</span>.com
        </span>
      </header>

      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver
      </Link>

      <section className="relative mb-6 overflow-hidden rounded-2xl bg-ink p-5 md:p-10">
        <div
          className="holo absolute inset-0 opacity-[0.18]"
          style={{
            maskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
          }}
        />
        <div className="relative md:max-w-xl">
          <h1 className="font-display text-[21px] font-extrabold leading-tight text-white md:text-[32px]">
            Guía de <span className="holo-text">condiciones</span>
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70 md:text-[15px]">
            Así clasificamos el desgaste de cada carta en TuCarpetero, para que
            sepas exactamente qué esperar antes de comprar.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CONDITIONS.map((c) => (
          <section
            key={c.id}
            id={c.id}
            className="scroll-mt-24 rounded-2xl border border-line bg-white p-4"
          >
            <div className="flex gap-4">
              <ConditionCardArt level={c.level} color={ILLUSTRATION_COLOR[c.level]} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-[2px] text-[10px] font-extrabold ${c.chipClass}`}
                  >
                    {c.code}
                  </span>
                  <h2 className="font-display text-[15px] font-extrabold">{c.label}</h2>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-mut">{c.resumen}</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-line pt-3.5 text-[12px]">
              <div>
                <dt className="font-bold text-body">Esquinas</dt>
                <dd className="mt-0.5 text-mut">{c.esquinas}</dd>
              </div>
              <div>
                <dt className="font-bold text-body">Bordes</dt>
                <dd className="mt-0.5 text-mut">{c.bordes}</dd>
              </div>
              <div>
                <dt className="font-bold text-body">Superficie</dt>
                <dd className="mt-0.5 text-mut">{c.superficie}</dd>
              </div>
              <div>
                <dt className="font-bold text-body">Rayones y marcas</dt>
                <dd className="mt-0.5 text-mut">{c.rayones}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
