"use client";

import Link from "next/link";
import { useOrders } from "@/components/OrdersContext";
import { useFavorites } from "@/components/FavoritesContext";
import { useCart } from "@/components/CartContext";
import { CardArt } from "@/components/ui";
import { TCG_COLORS } from "@/lib/data";

const SETTINGS = [
  { icon: "📍", label: "Direcciones y puntos de entrega guardados" },
  { icon: "💳", label: "Métodos de pago guardados" },
  { icon: "🔔", label: "Notificaciones" },
  { icon: "🚪", label: "Cerrar sesión" },
];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Cuenta() {
  const { orders, hydrated } = useOrders();
  const { ids: favIds } = useFavorites();
  const { count: cartCount } = useCart();

  if (!hydrated) return null;

  return (
    <main>
      <h1 className="mb-1 font-display text-lg font-extrabold tracking-tight">
        Mi cuenta
      </h1>
      <p className="mb-5 text-xs text-mut">
        Sin inicio de sesión todavía — esta actividad se guarda en este
        navegador.
      </p>

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:gap-8">
        <div>
          <h2 className="mb-2.5 px-0.5 font-display text-sm font-bold">
            Mis pedidos {orders.length > 0 && <span className="text-mut">· {orders.length}</span>}
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white px-5 py-8 text-center">
              <p className="text-2xl">🧾</p>
              <p className="mt-2 text-[13px] font-semibold text-body">
                Todavía no tienes pedidos
              </p>
              <Link
                href="/"
                className="holo mt-3 inline-block rounded-xl px-4 py-2 text-[12.5px] font-extrabold text-white"
              >
                Buscar cartas
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o) => (
                <section
                  key={o.orderNumber}
                  className="rounded-2xl border border-line bg-white px-4 py-3.5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-extrabold">{o.orderNumber}</span>
                    <span className="rounded-full bg-teal/10 px-2.5 py-[3px] text-[10.5px] font-bold text-teal">
                      Confirmado
                    </span>
                  </div>
                  <p className="mb-2.5 text-[11px] text-mut">{fmtDate(o.date)}</p>

                  <div className="flex flex-col gap-1.5">
                    {o.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-2">
                        <div
                          className="flex h-9 w-7 shrink-0 items-center justify-center overflow-hidden rounded border border-line text-sm"
                          style={{
                            background: `linear-gradient(160deg, ${TCG_COLORS[it.tcg]}22, #F7F8FB)`,
                          }}
                        >
                          <CardArt src={it.cardImg} alt={it.cardName} />
                        </div>
                        <span className="min-w-0 flex-1 truncate text-[12px]">
                          {it.cardName} × {it.qty}
                        </span>
                        <span className="text-[12px] font-bold">S/ {it.price * it.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5 text-[12.5px]">
                    <span className="text-mut">Total</span>
                    <span className="font-extrabold">S/ {o.total}</span>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:mt-0">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/favoritos"
              className="rounded-2xl border border-line bg-white px-3.5 py-3.5 text-center transition hover:border-vio/40"
            >
              <div className="text-lg">♡</div>
              <div className="mt-1 text-[12px] font-bold">Favoritos</div>
              <div className="text-[11px] text-mut">{favIds.length}</div>
            </Link>
            <Link
              href="/carrito"
              className="rounded-2xl border border-line bg-white px-3.5 py-3.5 text-center transition hover:border-vio/40"
            >
              <div className="text-lg">🛒</div>
              <div className="mt-1 text-[12px] font-bold">Carrito</div>
              <div className="text-[11px] text-mut">{cartCount}</div>
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-white px-4 py-3.5">
            <h2 className="mb-2 font-display text-[13px] font-bold">Ajustes</h2>
            <div className="flex flex-col gap-0.5">
              {SETTINGS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[12.5px] text-mut opacity-60"
                >
                  <span>{s.icon}</span>
                  <span className="flex-1">{s.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    Pronto
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="px-1 text-[11px] leading-relaxed text-mut">
            ¿Eres carpetero y quieres vender?{" "}
            <Link href="/contacto" className="font-semibold text-vio underline underline-offset-2">
              Escríbenos
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
