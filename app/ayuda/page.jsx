"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "¿Cómo sé que una carta es como se describe?",
    a: "Cada oferta muestra la condición (Near Mint a Dañada), idioma, y si el vendedor subió fotos reales de esa carta específica. Los carpeteros verificados pasaron una revisión adicional. Si te queda una duda, puedes chatear con el vendedor antes de comprar.",
  },
  {
    q: "¿Qué es la 'entrega en tienda certificada'?",
    a: "Es la forma más segura de recibir una carta: el carpetero la lleva a un Punto Verificado (por ahora Tienda Vortex Miraflores, Duelist Point Lince o Arena TCG San Borja), donde se fotografía y se sella con un código único antes de dártela.",
  },
  {
    q: "¿Y si prefiero 'coordinar directo' con el vendedor?",
    a: "Pueden acordar punto y hora de encuentro sin pasar por una tienda certificada. Es más flexible, pero TuCarpetero no certifica esa entrega — revisa bien la carta antes de confirmar que la recibiste.",
  },
  {
    q: "¿Cómo funciona el pago protegido (escrow)?",
    a: "Cuando pagas, el dinero queda retenido por la plataforma, no llega al carpetero de inmediato. Se libera recién cuando tú confirmas que recibiste la carta como se describió. Si algo no coincide, puedes abrir una disputa antes de liberar el pago.",
  },
  {
    q: "¿Puedo devolver una carta?",
    a: "Si la carta no llega en la condición descrita, puedes disputar la entrega antes de confirmar recepción y liberar el pago. Coméntalo primero por chat con el vendedor — la mayoría de casos se resuelven ahí mismo.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Yape, Plin y tarjeta de crédito/débito.",
  },
  {
    q: "¿Cómo me convierto en carpetero vendedor?",
    a: "Por ahora la publicación de ofertas está en fase de pruebas cerrada. Escríbenos desde la página de Contacto si quieres vender en TuCarpetero.",
  },
];

export default function Ayuda() {
  const [open, setOpen] = useState(0);

  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver
      </Link>

      <h1 className="mb-1 font-display text-lg font-extrabold tracking-tight">
        Centro de ayuda
      </h1>
      <p className="mb-5 text-sm text-mut">
        Preguntas frecuentes sobre compras, entregas y pagos.
      </p>

      <div className="mx-auto flex max-w-2xl flex-col gap-2">
        {FAQS.map((f, i) => (
          <div key={f.q} className="rounded-2xl border border-line bg-white px-4 py-3.5">
            <button
              onClick={() => setOpen((cur) => (cur === i ? null : i))}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="text-[13.5px] font-bold">{f.q}</span>
              <span
                className={`shrink-0 text-mut transition-transform duration-200 ${
                  open === i ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
            {open === i && (
              <p className="mt-2.5 text-[13px] leading-relaxed text-mut">{f.a}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-line bg-white px-4 py-4 text-center">
        <p className="text-[13px] text-mut">¿No encontraste lo que buscabas?</p>
        <Link
          href="/contacto"
          className="holo mt-2.5 inline-block rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white"
        >
          Contáctanos
        </Link>
      </div>
    </main>
  );
}
