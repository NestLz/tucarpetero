import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-white px-6 py-12 text-center">
        <p className="text-4xl">🔍</p>
        <h1 className="mt-3 font-display text-lg font-extrabold">
          No encontramos esta página
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-mut">
          El link puede estar mal escrito, o la carta / perfil que buscas ya no
          existe en el catálogo.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/ayuda"
            className="rounded-xl border border-line px-4 py-2.5 text-[13px] font-bold"
          >
            Centro de ayuda
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
