"use client";

import { useState } from "react";
import { AUCTIONS, CARDS, TCG_COLORS, fmtMin } from "@/lib/data";
import { CardArt } from "@/components/ui";

export default function Subastas() {
  const feat = AUCTIONS[0];
  const featCard = CARDS.find((c) => c.id === feat.cardId);
  const [bid, setBid] = useState(feat.current + feat.minInc);

  return (
    <main>
      <h1 className="mb-4 font-display text-lg font-extrabold tracking-tight">
        Subastas
      </h1>

      {/* subasta destacada */}
      <section className="relative mb-4 overflow-hidden rounded-2xl bg-ink p-4.5 pb-4 md:mb-8 lg:p-8">
        <div
          className="holo absolute inset-0 opacity-[0.16]"
          style={{
            maskImage:
              "radial-gradient(90% 130% at 85% 100%, #000 0%, transparent 60%)",
            WebkitMaskImage:
              "radial-gradient(90% 130% at 85% 100%, #000 0%, transparent 60%)",
          }}
        />
        <div className="relative lg:flex lg:items-start lg:gap-8">
          <div className="lg:flex-1">
            <div className="mb-3 flex items-center justify-between">
              <span className="holo rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-white">
                🔴 Subasta en vivo
              </span>
              <span className="text-xs font-extrabold tabular-nums text-[#FFD166]">
                ⏱ termina en {fmtMin(feat.endsInMin)}
              </span>
            </div>

            <div className="flex gap-3.5">
              <div
                className="flex h-[108px] w-[78px] shrink-0 items-center justify-center rounded-lg border border-white/15 text-4xl lg:h-[150px] lg:w-[108px] lg:text-6xl"
                style={{
                  background: `linear-gradient(160deg, ${TCG_COLORS[featCard.tcg]}44, #1C2438)`,
                }}
              >
                <CardArt src={featCard.img} alt={featCard.name} />
              </div>
              <div className="flex-1">
                <div
                  className="text-[10.5px] font-bold uppercase tracking-wide"
                  style={{ color: TCG_COLORS[featCard.tcg] }}
                >
                  {featCard.tcg}
                </div>
                <h2 className="my-0.5 font-display text-[16.5px] font-extrabold leading-tight text-white lg:text-[21px]">
                  {featCard.name}
                </h2>
                <p className="text-[11.5px] text-white/65">
                  {feat.cond} · {feat.lang} · por {feat.seller}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[11px] text-white/60">Puja actual</span>
                  <span className="font-display text-[23px] font-extrabold text-white">
                    S/ {feat.current}
                  </span>
                  <span className="text-[11px] font-bold text-teal">
                    {feat.bids} pujas
                  </span>
                </div>
              </div>
            </div>

            {/* últimas pujas */}
            <div className="mt-3 border-t border-white/10 pt-2.5">
              {feat.lastBids.map((b, i) => (
                <div
                  key={i}
                  className={`flex justify-between py-[3px] text-[11.5px] ${
                    i === 0 ? "text-white" : "text-white/55"
                  }`}
                >
                  <span>
                    {i === 0 ? "👑 " : ""}
                    {b.who}
                  </span>
                  <span className="tabular-nums">
                    S/ {b.amt} · {b.ago}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-64 lg:shrink-0">
            {/* pujar */}
            <div className="mt-3 flex gap-2 lg:mt-0">
              <div className="flex items-center overflow-hidden rounded-xl border border-white/20 bg-white/10">
                <button
                  onClick={() =>
                    setBid((b) => Math.max(feat.current + feat.minInc, b - feat.minInc))
                  }
                  className="h-[42px] px-3 text-base text-white"
                  aria-label="Bajar puja"
                >
                  −
                </button>
                <span className="min-w-[54px] text-center text-sm font-extrabold tabular-nums text-white">
                  S/ {bid}
                </span>
                <button
                  onClick={() => setBid((b) => b + feat.minInc)}
                  className="h-[42px] px-3 text-base text-white"
                  aria-label="Subir puja"
                >
                  +
                </button>
              </div>
              <button className="holo flex-1 rounded-xl text-[13.5px] font-extrabold text-white">
                Pujar S/ {bid}
              </button>
            </div>
            {feat.buyNow && (
              <button className="mt-2 w-full rounded-xl border border-white/30 py-2.5 text-[12.5px] font-bold text-white">
                ⚡ Compra ya · S/ {feat.buyNow}
              </button>
            )}

            <p className="mt-2.5 text-[10.5px] leading-relaxed text-white/50">
              🛡 Pujas con método de pago registrado · si pujan en los últimos
              3 min, el cierre se extiende 3 min (anti-sniping)
            </p>
          </div>
        </div>
      </section>

      {/* otras subastas */}
      <h2 className="mb-2.5 px-0.5 font-display text-sm font-bold md:mb-3">
        Terminan pronto
      </h2>
      <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 xl:grid-cols-3">
        {AUCTIONS.slice(1).map((a) => {
          const c = CARDS.find((x) => x.id === a.cardId);
          return (
            <article
              key={a.id}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3"
            >
              <div
                className="flex h-[60px] w-11 shrink-0 items-center justify-center rounded-lg border border-line text-[22px]"
                style={{
                  background: `linear-gradient(160deg, ${TCG_COLORS[c.tcg]}22, #F7F8FB)`,
                }}
              >
                <CardArt src={c.img} alt={c.name} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-bold">{c.name}</div>
                <div className="mb-0.5 text-[11px] text-mut">
                  {a.cond} · {a.seller} {a.verified ? "✓" : ""}
                </div>
                <div className="text-[11px] font-bold text-amber">
                  ⏱ {fmtMin(a.endsInMin)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-extrabold">S/ {a.current}</div>
                <div className="text-[10.5px] font-bold text-teal">
                  {a.bids} pujas
                </div>
                {a.buyNow && (
                  <div className="text-[10.5px] text-mut">⚡ S/ {a.buyNow}</div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
