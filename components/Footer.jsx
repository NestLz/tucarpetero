import Link from "next/link";

const COLUMNS = [
  {
    title: "Comprar",
    links: [
      { href: "/", label: "Buscar cartas" },
      { href: "/subastas", label: "Subastas" },
      { href: "/favoritos", label: "Favoritos" },
      { href: "/condiciones", label: "Guía de condiciones" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/ayuda", label: "Centro de ayuda" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terminos", label: "Términos y condiciones" },
      { href: "/privacidad", label: "Privacidad" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-ink py-10 text-white/70">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-base font-extrabold tracking-tight text-white">
              Tu<span className="holo-text">Carpetero</span>.com
            </span>
            <p className="mt-2 text-[12px] leading-relaxed text-white/60">
              Marketplace de cartas TCG (Pokémon, Yu-Gi-Oh, Magic) entre
              carpeteros en Lima, Perú.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-bold uppercase tracking-wide text-white/40">
                {col.title}
              </div>
              <ul className="mt-2.5 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-white/70 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] text-white/45">
            © {new Date().getFullYear()} TuCarpetero.com · Hecho en Lima, Perú · Proyecto en beta
          </p>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-white/50">
            <span>Aceptamos</span>
            <span className="rounded-md border border-white/15 px-1.5 py-0.5">Yape</span>
            <span className="rounded-md border border-white/15 px-1.5 py-0.5">Plin</span>
            <span className="rounded-md border border-white/15 px-1.5 py-0.5">Tarjeta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
