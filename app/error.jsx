"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-white px-6 py-12 text-center">
        <p className="text-4xl">⚠️</p>
        <h1 className="mt-3 font-display text-lg font-extrabold">
          Algo salió mal
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-mut">
          Tuvimos un problema al cargar esta página. Puedes intentar de nuevo o
          volver al inicio.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-xl border border-line px-4 py-2.5 text-[13px] font-bold"
          >
            Reintentar
          </button>
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
