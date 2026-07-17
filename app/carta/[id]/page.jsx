"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  CARDS,
  TCG_COLORS,
  priceHistoryFor,
  marketPriceOf,
  lastSaleOf,
  offersFor,
} from "@/lib/data";
import { Chip, SolidChip, Verified, Stars, CardArt, ConditionChip } from "@/components/ui";
import { useCart } from "@/components/CartContext";
import { useFavorites } from "@/components/FavoritesContext";

export default function Carta({ params }) {
  const { id } = use(params);
  const card = CARDS.find((c) => c.id === id) ?? CARDS[0];
  const { addItem, items: cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [sort, setSort] = useState("precio");
  const [expanded, setExpanded] = useState(null);
  const offers = useMemo(() => {
    const o = offersFor(card);
    if (sort === "precio") o.sort((a, b) => a.price - b.price);
    if (sort === "reputación") o.sort((a, b) => b.rep - a.rep);
    return o;
  }, [card, sort]);

  const history = useMemo(() => priceHistoryFor(card), [card]);
  const min = Math.min(...history);
  const max = Math.max(...history);
  const marketPrice = marketPriceOf(card);
  const lastSale = lastSaleOf(card);
  const lowestListing = Math.min(...offers.map((o) => o.price));
  const totalAvailable = offers.reduce((sum, o) => sum + o.qty, 0);

  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver a búsqueda
      </Link>

      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-8">
        <div className="lg:sticky lg:top-20 lg:flex lg:flex-col lg:gap-4">
          {/* cabecera de carta */}
          <section className="mb-4 flex gap-3.5 lg:mb-0 lg:flex-col lg:gap-3">
            <div
              className="flex h-[132px] w-24 shrink-0 items-center justify-center rounded-xl border border-line text-[44px] shadow-lg shadow-ink/10 lg:h-64 lg:w-full lg:text-[88px]"
              style={{
                background: `linear-gradient(160deg, ${TCG_COLORS[card.tcg]}33, #F7F8FB)`,
              }}
            >
              <CardArt src={card.img} alt={card.name} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div
                  className="text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: TCG_COLORS[card.tcg] }}
                >
                  {card.tcg}
                </div>
                <button
                  onClick={() => toggleFavorite(card.id)}
                  aria-label={isFavorite(card.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  className={`shrink-0 text-xl leading-none transition ${
                    isFavorite(card.id) ? "text-red-500" : "text-line hover:text-red-300"
                  }`}
                >
                  {isFavorite(card.id) ? "♥" : "♡"}
                </button>
              </div>
              <h1 className="my-1 font-display text-[19px] font-extrabold leading-tight lg:text-[23px]">
                {card.name}
              </h1>
              <p className="mb-2 text-xs text-mut">
                {card.set} · {card.num} · {card.rarity}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <SolidChip>Mercado: S/ {marketPrice}</SolidChip>
                <Chip>{offers.length} vendedores</Chip>
              </div>
            </div>
          </section>

          {/* historial y precios estilo TCGplayer */}
          <section className="mb-4 rounded-2xl border border-line bg-white px-3.5 py-3 lg:mb-0">
            <div className="mb-2 flex justify-between">
              <span className="text-xs font-bold">Historial de ventas en la plataforma</span>
              <span className="text-xs font-bold text-teal">S/ {marketPrice} prom.</span>
            </div>
            <div className="flex h-11 items-end gap-1">
              {history.map((v, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-[3px] ${
                    i === history.length - 1 ? "bg-vio" : "bg-vio/20"
                  }`}
                  style={{ height: `${20 + ((v - min) / (max - min || 1)) * 80}%` }}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[10.5px] text-mut">{history.length} ventas · últimos 60 días</p>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
              <div>
                <div className="text-[9.5px] font-semibold uppercase tracking-wide text-mut">
                  Mercado
                </div>
                <div className="text-[15px] font-extrabold">S/ {marketPrice}</div>
              </div>
              <div>
                <div className="text-[9.5px] font-semibold uppercase tracking-wide text-mut">
                  Más bajo
                </div>
                <div className="text-[15px] font-extrabold text-teal">S/ {lowestListing}</div>
              </div>
              <div>
                <div className="text-[9.5px] font-semibold uppercase tracking-wide text-mut">
                  Última venta
                </div>
                <div className="text-[15px] font-extrabold">S/ {lastSale}</div>
              </div>
            </div>

            <div className="mt-3 flex justify-between border-t border-line pt-3 text-[11px] text-mut">
              <span>
                <b className="text-body">{totalAvailable}</b> unidades disponibles
              </span>
              <span>
                <b className="text-body">{offers.length}</b> carpeteros vendiendo
              </span>
            </div>
          </section>

          <aside className="hidden rounded-2xl border border-teal/30 bg-teal/5 px-3.5 py-3 text-[11.5px] leading-relaxed text-mut lg:block">
            🏪 <b className="text-body">Entrega en tienda</b>: la carta se
            fotografía y sella con código único en un Punto Verificado, y tu
            pago queda protegido hasta que confirmes recepción.{" "}
            <b className="text-body">Coordinar</b> es acuerdo directo bajo
            responsabilidad de ambos.
          </aside>
        </div>

        <div>
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
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <ConditionChip cond={o.cond} />
                  <Chip>{o.lang}</Chip>
                  {o.delivery.includes("tienda") && (
                    <SolidChip color="bg-teal">🏪 Entrega en tienda</SolidChip>
                  )}
                  {o.delivery.includes("coordinar") && <Chip>🤝 Coordinar</Chip>}
                  {o.hasPhotos && <SolidChip color="bg-vio">📷 Con fotos reales</SolidChip>}
                  <button
                    onClick={() => setExpanded((cur) => (cur === o.seller ? null : o.seller))}
                    className="text-[11px] font-semibold text-mut underline decoration-line underline-offset-2 hover:text-vio"
                  >
                    {expanded === o.seller ? "Ocultar detalle ⌃" : "Ver detalle ⌄"}
                  </button>
                  <div className="ml-auto flex gap-1.5">
                    {(() => {
                      const offerId = `${card.id}-${o.seller}`;
                      const inCart = cartItems.find((it) => it.id === offerId);
                      return (
                        <button
                          onClick={() =>
                            addItem({
                              id: offerId,
                              cardId: card.id,
                              cardName: card.name,
                              cardImg: card.img,
                              tcg: card.tcg,
                              seller: o.seller,
                              price: o.price,
                              cond: o.cond,
                              lang: o.lang,
                              delivery: o.delivery,
                              verified: o.verified,
                              qty: 1,
                              maxQty: o.qty,
                            })
                          }
                          className={`rounded-full px-3 py-[3px] text-[11px] font-bold transition ${
                            inCart
                              ? "bg-teal text-white"
                              : "border border-line text-body hover:border-vio hover:text-vio"
                          }`}
                        >
                          {inCart ? `✓ En carrito (${inCart.qty})` : "🛒 Agregar"}
                        </button>
                      );
                    })()}
                    <Link
                      href="/chat"
                      className="rounded-full bg-ink px-3 py-[3px] text-[11px] font-bold text-white"
                    >
                      💬 Chatear
                    </Link>
                  </div>
                </div>

                {expanded === o.seller && (
                  <div className="mt-3 border-t border-line pt-3">
                    <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide text-mut">
                      {o.hasPhotos ? "Fotos del vendedor" : "Sin fotos propias todavía"}
                    </div>
                    {o.hasPhotos ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        {[0, 1, 2].map((n) => (
                          <div
                            key={n}
                            className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border border-line"
                            style={{
                              background: `linear-gradient(155deg, ${TCG_COLORS[card.tcg]}33, #E3E7EF)`,
                            }}
                          >
                            <span className="text-lg opacity-40">📷</span>
                            <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-mut/70">
                              {n + 1}/3
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11.5px] text-mut">
                        Este vendedor todavía usa el arte de referencia de la carta. Pídele
                        fotos propias por chat antes de comprar si te genera dudas.
                      </p>
                    )}

                    <div className="mt-3 text-[10.5px] font-bold uppercase tracking-wide text-mut">
                      Nota del vendedor
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-mut">“{o.notes}”</p>

                    <div className="mt-3 text-[10.5px] font-bold uppercase tracking-wide text-mut">
                      Política de entrega
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-mut">
                      {o.delivery.includes("tienda") && (
                        <>
                          🏪 <b className="text-body">Entrega en tienda</b>: la carta se
                          fotografía y sella con código único en un Punto Verificado antes de
                          dártela; tu pago queda protegido hasta que confirmes recepción.
                          {o.delivery.includes("coordinar") && " "}
                        </>
                      )}
                      {o.delivery.includes("coordinar") && (
                        <>
                          🤝 <b className="text-body">Coordinar directo</b>: acuerdan punto y
                          hora entre ambos — TuCarpetero no certifica esta entrega, así que
                          revisa la carta antes de confirmar el pago.
                        </>
                      )}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </section>

          <aside className="mt-3.5 rounded-2xl border border-teal/30 bg-teal/5 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-mut lg:hidden">
            🏪 <b className="text-body">Entrega en tienda</b>: la carta se fotografía y
            sella con código único en un Punto Verificado, y tu pago queda protegido
            hasta que confirmes recepción. <b className="text-body">Coordinar</b> es
            acuerdo directo bajo responsabilidad de ambos.
          </aside>
        </div>
      </div>
    </main>
  );
}
