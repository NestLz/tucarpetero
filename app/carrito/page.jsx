"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { CardArt, ConditionChip } from "@/components/ui";
import { TCG_COLORS } from "@/lib/data";

export default function Carrito() {
  const { items, updateQty, removeItem, total, hydrated } = useCart();

  // agrupar por vendedor: el checkout coordina la entrega por grupo
  const groups = items.reduce((acc, it) => {
    (acc[it.seller] ??= []).push(it);
    return acc;
  }, {});

  if (!hydrated) return null;

  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Seguir comprando
      </Link>

      <h1 className="mb-4 font-display text-lg font-extrabold tracking-tight">
        Tu carrito {items.length > 0 && <span className="text-mut">· {items.length} ítem(s)</span>}
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-5 py-10 text-center">
          <p className="text-3xl">🛒</p>
          <p className="mt-3 text-sm font-semibold text-body">Tu carrito está vacío</p>
          <p className="mt-1 text-xs text-mut">
            Agrega cartas desde una ficha para empezar tu pedido.
          </p>
          <Link
            href="/"
            className="holo mt-4 inline-block rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white"
          >
            Buscar cartas
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
          <div className="flex flex-col gap-4">
            {Object.entries(groups).map(([seller, sellerItems]) => (
              <section
                key={seller}
                className="rounded-2xl border border-line bg-white px-3.5 py-3"
              >
                <div className="mb-2.5 flex items-center justify-between">
                  <Link
                    href={`/perfil/${seller}`}
                    className="text-[13px] font-extrabold underline decoration-vio/35 underline-offset-4"
                  >
                    {seller}
                  </Link>
                  <span className="text-[11px] text-mut">
                    {sellerItems.length} carta{sellerItems.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {sellerItems.map((it) => (
                    <div key={it.id} className="flex items-center gap-3">
                      <div
                        className="flex h-14 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line text-xl"
                        style={{
                          background: `linear-gradient(160deg, ${TCG_COLORS[it.tcg]}22, #F7F8FB)`,
                        }}
                      >
                        <CardArt src={it.cardImg} alt={it.cardName} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] font-bold">{it.cardName}</div>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          <ConditionChip cond={it.cond} />
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-line">
                        <button
                          onClick={() => updateQty(it.id, it.qty - 1)}
                          className="px-2 py-1 text-sm text-mut"
                          aria-label="Restar"
                        >
                          −
                        </button>
                        <span className="min-w-[20px] text-center text-[12px] font-bold">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => updateQty(it.id, it.qty + 1)}
                          disabled={it.qty >= it.maxQty}
                          className="px-2 py-1 text-sm text-mut disabled:opacity-30"
                          aria-label="Sumar"
                        >
                          +
                        </button>
                      </div>
                      <span className="w-16 shrink-0 text-right text-[13px] font-extrabold">
                        S/ {it.price * it.qty}
                      </span>
                      <button
                        onClick={() => removeItem(it.id)}
                        className="shrink-0 text-mut hover:text-red-500"
                        aria-label="Quitar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="mt-4 rounded-2xl border border-line bg-white px-3.5 py-3.5 lg:sticky lg:top-20 lg:mt-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-mut">Subtotal</span>
              <span className="font-extrabold">S/ {total}</span>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-mut">
              El costo de entrega (si coordinas fuera de tienda) se acuerda directo
              con cada carpetero.
            </p>
            <Link
              href="/checkout"
              className="holo mt-3 block rounded-xl py-3 text-center text-sm font-extrabold text-white"
            >
              Continuar al pago
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
