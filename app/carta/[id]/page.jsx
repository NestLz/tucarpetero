"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  CARDS,
  OFFERS,
  DEFAULT_OFFERS,
  PRICE_HISTORY,
  TCG_COLORS,
} from "@/lib/data";
import { Chip, SolidChip, Verified, Stars } from "@/components/ui";

export default function Carta({ params }) {
  const { id } = use(params);
  const card = CARDS.find((c) => c.id === id) ?? CARDS[0];
  const base = OFFERS[card.id] ?? DEFAULT_OFFERS;

  const [sort, setSort] = useState("precio");
  const offers = useMemo(() => {
    const o = [...base];
    if (sort === "precio") o.sort((a, b) => a.price - b.price);
    if (sort === "reputación") o.sort((a, b) => b.rep - a.rep);
    return o;
  }, [base, sort]);

  const min = Math.min(...PRICE_HISTORY);
  const max = Math.max(...PRICE_HISTORY);

  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver a búsqueda
      </Link>

      {/* cabecera de carta */}
      <section className="mb-4 flex gap-3.5">
        <div
          className="flex h-[132px] w-24 shrink-0 items-center justify-center rounded-xl border border-line text-[44px] shadow-lg shadow-ink/10"
          style={{
            background: `linear-gradient(160deg, ${TCG_COLORS[card.tcg]}33, #F7F8FB)`,
          }}
        >
          {card.img}
        </div>
        <div className="flex-1">
          <div
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: TCG_COLORS[card.tcg] }}
          >
            {card.tcg}
          </div>
          <h1 className="my-1 font-display text-[19px] font-extrabold leading-tight">
            {card.name}
          </h1>
          <p className="mb-2 text-xs text-mut">
            {card.set} · {card.num} · {card.rarity}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <SolidChip>Ref. int. ${card.refUsd.toFixed(2)}</SolidChip>
            <Chip>{offers.length} vendedores</Chip>
          </div>
        </div>
      </section>

      {/* historial de precios */}
      <section className="mb-4 rounded-2xl border border-line bg-white px-3.5 py-3">
        <div className="mb-2 flex justify-between">
          <span className="text-xs font-bold">Últimas ventas en la plataforma</span>
          <span className="text-xs font-bold text-teal">S/ 92 prom.</span>
        </div>
        <div className="flex h-11 items-end gap-1">
          {PRICE_HISTORY.map((v, i) => (
            <div
              key={i}
              className={`flex-1 rounded-[3px] ${
                i === PRICE_HISTORY.length - 1 ? "bg-vio" : "bg-vio/20"
              }`}
              style={{ height: `${20 + ((v - min) / (max - min)) * 80}%` }}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[10.5px] text-mut">12 ventas · últimos 60 días</p>
      </section>

      {/* ofertas */}
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <h2 className="font-display text-sm font-bold">Ofertas de carpeteros</h2>
        <div className="flex gap-1">
          {["precio", "reputación"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                sort === s
                  ? "border-vio bg-vio/10 text-vio"
                  : "border-line text-mut"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-2">
        {offers.map((o, i) => (
          <article
            key={o.seller}
            className={`rounded-2xl border bg-white px-3.5 py-3 ${
              i === 0 && sort === "precio" ? "border-teal" : "border-line"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`/perfil/${o.seller}`}
                    className="text-[13.5px] font-extrabold underline decoration-vio/35 underline-offset-4"
                  >
                    {o.seller}
                  </Link>
                  {o.verified && <Verified />}
                  {i === 0 && sort === "precio" && (
                    <SolidChip color="bg-teal">Mejor precio</SolidChip>
                  )}
                </div>
                <div className="mt-1">
                  <Stars v={o.rep} />{" "}
                  <span className="text-[11px] text-mut">· {o.sales} ventas</span>
                </div>
              </div>
              <span className="text-[17px] font-extrabold">S/ {o.price}</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Chip>{o.cond}</Chip>
              <Chip>{o.lang}</Chip>
              {o.delivery.includes("tienda") && (
                <SolidChip color="bg-teal">🏪 Entrega en tienda</SolidChip>
              )}
              {o.delivery.includes("coordinar") && <Chip>🤝 Coordinar</Chip>}
              <Link
                href="/chat"
                className="ml-auto rounded-full bg-ink px-3 py-[3px] text-[11px] font-bold text-white"
              >
                💬 Chatear
              </Link>
            </div>
          </article>
        ))}
      </section>

      <aside className="mt-3.5 rounded-2xl border border-teal/30 bg-teal/5 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-mut">
        🏪 <b className="text-body">Entrega en tienda</b>: la carta se fotografía y
        sella con código único en un Punto Verificado, y tu pago queda protegido
        hasta que confirmes recepción. <b className="text-body">Coordinar</b> es
        acuerdo directo bajo responsabilidad de ambos.
      </aside>
    </main>
  );
}
