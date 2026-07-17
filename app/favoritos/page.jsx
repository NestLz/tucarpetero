"use client";

import Link from "next/link";
import { CARDS, TCG_COLORS, marketPriceOf } from "@/lib/data";
import { CardArt } from "@/components/ui";
import { useFavorites } from "@/components/FavoritesContext";

export default function Favoritos() {
  const { ids, toggleFavorite, hydrated } = useFavorites();
  const favCards = ids.map((id) => CARDS.find((c) => c.id === id)).filter(Boolean);

  if (!hydrated) return null;

  return (
    <main>
      <h1 className="mb-4 font-display text-lg font-extrabold tracking-tight">
        Mis favoritos {favCards.length > 0 && <span className="text-mut">· {favCards.length}</span>}
      </h1>

      {favCards.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-5 py-10 text-center">
          <p className="text-3xl">♡</p>
          <p className="mt-3 text-sm font-semibold text-body">Todavía no tienes favoritos</p>
          <p className="mt-1 text-xs text-mut">
            Toca el corazón en cualquier carta para guardarla acá y seguir su precio.
          </p>
          <Link
            href="/"
            className="holo mt-4 inline-block rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white"
          >
            Buscar cartas
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5">
          {favCards.map((c) => (
            <Link
              key={c.id}
              href={`/carta/${c.id}`}
              className="overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="relative flex h-24 items-center justify-center border-b border-line text-4xl md:h-32 md:text-5xl"
                style={{
                  background: `linear-gradient(160deg, ${TCG_COLORS[c.tcg]}22, #F7F8FB)`,
                }}
              >
                <CardArt src={c.img} alt={c.name} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(c.id);
                  }}
                  aria-label="Quitar de favoritos"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-sm text-red-500 backdrop-blur"
                >
                  ♥
                </button>
              </div>
              <div className="p-3">
                <div
                  className="text-[10.5px] font-bold uppercase tracking-wide"
                  style={{ color: TCG_COLORS[c.tcg] }}
                >
                  {c.tcg}
                </div>
                <div className="my-0.5 truncate text-[13.5px] font-bold">{c.name}</div>
                <div className="truncate text-[11px] text-mut">
                  {c.set} · {c.rarity} · {c.num}
                </div>
                <div className="mt-2">
                  <div className="text-[9.5px] font-semibold uppercase tracking-wide text-mut">
                    Precio de mercado
                  </div>
                  <div className="text-sm font-extrabold">S/ {marketPriceOf(c)}</div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
