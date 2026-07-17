"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CARDS, TCG_COLORS, DEFAULT_OFFERS, soles } from "@/lib/data";

const TCGS = ["Todos", "Pokémon", "Yu-Gi-Oh", "Magic"];

export default function Buscar() {
  const [q, setQ] = useState("");
  const [tcg, setTcg] = useState("Todos");

  const list = useMemo(
    () =>
      CARDS.filter(
        (c) =>
          (tcg === "Todos" || c.tcg === tcg) &&
          c.name.toLowerCase().includes(q.toLowerCase())
      ),
    [q, tcg]
  );

  return (
    <main>
      <header className="mb-4 flex items-center justify-between">
        <span className="font-display text-lg font-extrabold tracking-tight">
          Tu<span className="holo-text">Carpetero</span>.com
        </span>
        <span className="rounded-full border border-line px-2.5 py-[3px] text-[11px] font-semibold text-mut">
          Lima · beta
        </span>
      </header>

      {/* hero */}
      <section className="relative mb-5 overflow-hidden rounded-2xl bg-ink p-5">
        <div
          className="holo absolute inset-0 opacity-[0.18]"
          style={{
            maskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <h1 className="font-display text-[21px] font-extrabold leading-tight text-white">
            Busca la carta.
            <br />
            <span className="holo-text">Compara carpeteros.</span>
          </h1>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Charizard, Sol Ring, Blue-Eyes…"
            className="mt-3.5 w-full rounded-xl bg-white px-3.5 py-3 text-sm outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {TCGS.map((t) => (
              <button
                key={t}
                onClick={() => setTcg(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  tcg === t
                    ? "bg-white text-ink"
                    : "border border-white/25 text-white/85"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <p className="mb-2.5 px-0.5 text-xs font-semibold text-mut">
        {list.length} cartas · precios de referencia según mercado internacional
      </p>

      <section className="grid grid-cols-2 gap-3">
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/carta/${c.id}`}
            className="overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className="flex h-24 items-center justify-center border-b border-line text-4xl"
              style={{
                background: `linear-gradient(160deg, ${TCG_COLORS[c.tcg]}22, #F7F8FB)`,
              }}
            >
              {c.img}
            </div>
            <div className="p-3">
              <div
                className="text-[10.5px] font-bold uppercase tracking-wide"
                style={{ color: TCG_COLORS[c.tcg] }}
              >
                {c.tcg}
              </div>
              <div className="my-0.5 text-[13.5px] font-bold">{c.name}</div>
              <div className="text-[11px] text-mut">
                {c.set} · {c.num}
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-sm font-extrabold">
                  desde {soles(c.refUsd * 0.8)}
                </span>
                <span className="text-[11px] font-bold text-teal">
                  {DEFAULT_OFFERS.length} ofertas
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
