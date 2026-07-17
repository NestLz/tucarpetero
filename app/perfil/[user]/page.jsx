"use client";

import { use } from "react";
import Link from "next/link";
import { SELLERS, TCG_COLORS } from "@/lib/data";
import { Verified, Stars } from "@/components/ui";

export default function Perfil({ params }) {
  const { user } = use(params);
  const s = SELLERS[user] ?? SELLERS.KensoTCG;

  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver
      </Link>

      <section className="relative mb-4 overflow-hidden rounded-2xl bg-ink p-5 md:mb-8 lg:p-8">
        <div
          className="holo absolute inset-0 opacity-[0.16]"
          style={{
            maskImage:
              "radial-gradient(90% 130% at 15% 0%, #000 0%, transparent 60%)",
            WebkitMaskImage:
              "radial-gradient(90% 130% at 15% 0%, #000 0%, transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-3.5 lg:gap-5">
          <span className="holo flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full font-display text-2xl font-extrabold text-white lg:h-20 lg:w-20 lg:text-3xl">
            {s.name[0]}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-extrabold text-white lg:text-2xl">
                {s.name}
              </h1>
              {s.verified && <Verified />}
            </div>
            <p className="mt-0.5 text-xs text-white/75 lg:text-sm">
              {s.zone} · carpetero desde {s.since}
            </p>
            <div className="mt-1">
              <Stars v={s.rep} />{" "}
              <span className="text-[11.5px] text-white/70">
                · {s.sales} ventas
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="lg:grid lg:grid-cols-[340px_1fr] lg:items-start lg:gap-8">
        <div>
          <div className="mb-4 flex gap-2">
            <Link
              href="/chat"
              className="holo flex-1 rounded-xl py-2.5 text-center text-[13px] font-extrabold text-white"
            >
              💬 Chatear
            </Link>
            <button className="flex-1 rounded-xl border border-line bg-white py-2.5 text-[13px] font-bold">
              Seguir
            </button>
          </div>

          <h2 className="mb-2.5 px-0.5 font-display text-sm font-bold">
            Sus carpetas
          </h2>
          <section className="mb-5 grid grid-cols-3 gap-2.5 lg:mb-0">
            {s.binders.map((b) => (
              <div
                key={b.tcg}
                className="rounded-2xl border border-line bg-white px-2.5 py-3.5 text-center"
              >
                <div
                  className="mx-auto mb-2 h-[46px] w-[34px] rounded-md shadow-[2px_3px_0_rgba(19,26,42,.12)]"
                  style={{
                    background: `linear-gradient(160deg, ${TCG_COLORS[b.tcg]}, ${TCG_COLORS[b.tcg]}66)`,
                  }}
                />
                <div className="text-[11.5px] font-bold">{b.tcg}</div>
                <div className="text-[11px] text-mut">{b.count} cartas</div>
              </div>
            ))}
          </section>
        </div>

        <div>
          <h2 className="mb-2.5 px-0.5 font-display text-sm font-bold">Reseñas</h2>
          <section className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
            {s.reviews.map((r) => (
              <article
                key={r.who}
                className="rounded-2xl border border-line bg-white px-3.5 py-3"
              >
                <div className="mb-1 flex justify-between">
                  <span className="text-[12.5px] font-bold">{r.who}</span>
                  <span className="text-[11px] text-amber">
                    {"★".repeat(r.stars)}
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-mut">{r.txt}</p>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
