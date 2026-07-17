"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { CardArt } from "@/components/ui";
import { TCG_COLORS } from "@/lib/data";

const STEPS = [
  { id: 1, label: "Entrega" },
  { id: 2, label: "Pago" },
  { id: 3, label: "Confirmación" },
];

const STORES = ["Tienda Vortex Miraflores", "Duelist Point Lince", "Arena TCG San Borja"];

const PAYMENT_METHODS = [
  { id: "yape", label: "Yape", icon: "💜" },
  { id: "plin", label: "Plin", icon: "💙" },
  { id: "tarjeta", label: "Tarjeta", icon: "💳" },
];

function StepIndicator({ step }) {
  return (
    <div className="mb-5 flex items-center">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-extrabold transition ${
                step > s.id
                  ? "bg-teal text-white"
                  : step === s.id
                    ? "holo text-white"
                    : "border border-line bg-white text-mut"
              }`}
            >
              {step > s.id ? "✓" : s.id}
            </span>
            <span
              className={`text-[10.5px] font-semibold ${
                step >= s.id ? "text-body" : "text-mut"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-2 h-[2px] flex-1 rounded-full transition ${
                step > s.id ? "bg-teal" : "bg-line"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Checkout() {
  const { items, total, clear } = useCart();
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState({}); // { [seller]: { method, store } }
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const groups = items.reduce((acc, it) => {
    (acc[it.seller] ??= []).push(it);
    return acc;
  }, {});
  const sellers = Object.keys(groups);

  const setSellerDelivery = (seller, patch) =>
    setDelivery((prev) => ({ ...prev, [seller]: { ...prev[seller], ...patch } }));

  const deliveryComplete = sellers.every((s) => {
    const d = delivery[s];
    if (!d?.method) return false;
    if (d.method === "tienda" && !d.store) return false;
    return true;
  });

  const confirmOrder = () => {
    const num = `TC-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(num);
    setConfirmed(true);
    clear();
  };

  if (confirmed) {
    return (
      <main>
        <div className="mx-auto max-w-md rounded-2xl border border-teal/30 bg-teal/5 px-5 py-8 text-center">
          <p className="text-4xl">🎉</p>
          <h1 className="mt-3 font-display text-lg font-extrabold">¡Pedido confirmado!</h1>
          <p className="mt-1 text-sm text-mut">
            Tu número de orden es <b className="text-body">{orderNumber}</b>
          </p>

          <div className="mt-5 rounded-xl border border-line bg-white px-4 py-3.5 text-left text-[12.5px] leading-relaxed text-mut">
            🛡 <b className="text-body">Tu pago está protegido (escrow)</b>: lo
            retenemos y se libera a cada carpetero recién cuando confirmes que
            recibiste la carta — ya sea porque la retiraste sellada en tienda
            certificada, o porque coordinaste directo y avisas que todo llegó
            bien. Si algo no coincide, puedes abrir una disputa antes de liberar
            el pago.
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/chat"
              className="rounded-xl border border-line px-4 py-2.5 text-[13px] font-bold"
            >
              Ver mis chats
            </Link>
            <Link
              href="/"
              className="holo rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main>
        <div className="rounded-2xl border border-line bg-white px-5 py-10 text-center">
          <p className="text-3xl">🧾</p>
          <p className="mt-3 text-sm font-semibold text-body">No tienes un pedido en curso</p>
          <Link
            href="/"
            className="holo mt-4 inline-block rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white"
          >
            Buscar cartas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Link href="/carrito" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver al carrito
      </Link>

      <div className="mx-auto max-w-xl">
        <StepIndicator step={step} />

        {/* paso 1: entrega por vendedor */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            {sellers.map((seller) => {
              const sellerItems = groups[seller];
              const canTienda = sellerItems.some((it) => it.delivery.includes("tienda"));
              const canCoordinar = sellerItems.some((it) => it.delivery.includes("coordinar"));
              const d = delivery[seller] ?? {};
              return (
                <section
                  key={seller}
                  className="rounded-2xl border border-line bg-white px-3.5 py-3.5"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[13px] font-extrabold">{seller}</span>
                    <span className="text-[11px] text-mut">
                      {sellerItems.length} carta{sellerItems.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {canTienda && (
                      <button
                        onClick={() => setSellerDelivery(seller, { method: "tienda" })}
                        className={`rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition ${
                          d.method === "tienda"
                            ? "border-teal bg-teal/5 text-body"
                            : "border-line text-mut"
                        }`}
                      >
                        🏪 Entrega en tienda certificada
                        <span className="block text-[11px] font-normal text-mut">
                          La carta se fotografía y sella con código único antes de entregarla.
                        </span>
                      </button>
                    )}
                    {d.method === "tienda" && (
                      <select
                        value={d.store ?? ""}
                        onChange={(e) => setSellerDelivery(seller, { store: e.target.value })}
                        className="rounded-lg border border-line px-2.5 py-2 text-[12.5px] outline-none focus:border-vio"
                      >
                        <option value="" disabled>
                          Elige el punto verificado…
                        </option>
                        {STORES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}

                    {canCoordinar && (
                      <button
                        onClick={() => setSellerDelivery(seller, { method: "coordinar", store: null })}
                        className={`rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition ${
                          d.method === "coordinar"
                            ? "border-vio bg-vio/5 text-body"
                            : "border-line text-mut"
                        }`}
                      >
                        🤝 Coordinar directo con {seller}
                        <span className="block text-[11px] font-normal text-mut">
                          Acuerdo directo bajo responsabilidad de ambas partes — TuCarpetero no
                          certifica esta entrega.
                        </span>
                      </button>
                    )}
                  </div>
                </section>
              );
            })}

            <button
              onClick={() => deliveryComplete && setStep(2)}
              disabled={!deliveryComplete}
              className="holo mt-1 rounded-xl py-3 text-center text-sm font-extrabold text-white disabled:opacity-40"
            >
              Siguiente: método de pago
            </button>
          </div>
        )}

        {/* paso 2: pago (mock) */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`rounded-xl border px-3 py-4 text-center transition ${
                    paymentMethod === m.id ? "border-vio bg-vio/5" : "border-line"
                  }`}
                >
                  <span className="block text-2xl">{m.icon}</span>
                  <span className="mt-1 block text-[12px] font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            {/* TODO: integrar Culqi como pasarela real de pago (Yape/Plin/tarjeta) */}
            {(paymentMethod === "yape" || paymentMethod === "plin") && (
              <div className="rounded-2xl border border-line bg-white px-3.5 py-3.5">
                <label className="mb-1 block text-[11px] font-bold text-mut">
                  Número de celular asociado a {paymentMethod === "yape" ? "Yape" : "Plin"}
                </label>
                <input
                  type="tel"
                  placeholder="9XX XXX XXX"
                  className="w-full rounded-lg border border-line px-2.5 py-2 text-[13px] outline-none focus:border-vio"
                />
                <p className="mt-2 text-[10.5px] text-mut">
                  Simulación de pago — todavía no procesamos cobros reales.
                </p>
              </div>
            )}
            {paymentMethod === "tarjeta" && (
              <div className="flex flex-col gap-2 rounded-2xl border border-line bg-white px-3.5 py-3.5">
                <input
                  placeholder="Número de tarjeta"
                  className="w-full rounded-lg border border-line px-2.5 py-2 text-[13px] outline-none focus:border-vio"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="MM/AA"
                    className="w-full rounded-lg border border-line px-2.5 py-2 text-[13px] outline-none focus:border-vio"
                  />
                  <input
                    placeholder="CVV"
                    className="w-full rounded-lg border border-line px-2.5 py-2 text-[13px] outline-none focus:border-vio"
                  />
                </div>
                <p className="text-[10.5px] text-mut">
                  Simulación de pago — todavía no procesamos cobros reales.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-line px-4 py-3 text-[13px] font-bold"
              >
                Atrás
              </button>
              <button
                onClick={() => paymentMethod && setStep(3)}
                disabled={!paymentMethod}
                className="holo flex-1 rounded-xl py-3 text-center text-sm font-extrabold text-white disabled:opacity-40"
              >
                Siguiente: confirmar
              </button>
            </div>
          </div>
        )}

        {/* paso 3: confirmación */}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <section className="rounded-2xl border border-line bg-white px-3.5 py-3.5">
              <h2 className="mb-2.5 text-[13px] font-extrabold">Resumen del pedido</h2>
              {sellers.map((seller) => (
                <div key={seller} className="mb-3 last:mb-0">
                  <div className="mb-1.5 flex items-center justify-between text-[12px]">
                    <span className="font-bold">{seller}</span>
                    <span className="text-mut">
                      {delivery[seller]?.method === "tienda"
                        ? `🏪 ${delivery[seller]?.store}`
                        : "🤝 Coordinar directo"}
                    </span>
                  </div>
                  {groups[seller].map((it) => (
                    <div key={it.id} className="flex items-center gap-2 py-1">
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
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2.5 text-sm">
                <span className="font-bold">Total</span>
                <span className="font-extrabold">S/ {total}</span>
              </div>
              <div className="mt-1.5 text-[11px] text-mut">
                Pago con{" "}
                <b className="text-body">
                  {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                </b>
              </div>
            </section>

            <div className="rounded-xl border border-teal/30 bg-teal/5 px-3.5 py-3 text-[11.5px] leading-relaxed text-mut">
              🛡 Tu pago se libera a cada carpetero cuando confirmes recepción —
              no antes. Así protegemos tu compra.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="rounded-xl border border-line px-4 py-3 text-[13px] font-bold"
              >
                Atrás
              </button>
              <button
                onClick={confirmOrder}
                className="holo flex-1 rounded-xl py-3 text-center text-sm font-extrabold text-white"
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
