"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

const BASE_ITEMS = [
  { href: "/", label: "Buscar", icon: "🔍" },
  { href: "/subastas", label: "Subastas", icon: "🔨" },
  { href: "/chat", label: "Chat", icon: "💬", badge: 2 },
  { href: "/favoritos", label: "Favoritos", icon: "♡" },
  { href: "/carrito", label: "Carrito", icon: "🛒" },
  { href: "/perfil/KensoTCG", label: "Perfil", icon: "👤" },
];

function isActive(it, path) {
  if (it.href === "/") return path === "/" || path.startsWith("/carta");
  if (it.href === "/carrito") return path.startsWith("/carrito") || path.startsWith("/checkout");
  return path.startsWith(it.href.split("/").slice(0, 2).join("/"));
}

export default function Nav() {
  const path = usePathname();
  const { count } = useCart();
  const ITEMS = BASE_ITEMS.map((it) =>
    it.href === "/carrito" ? { ...it, badge: count > 0 ? count : null } : it
  );

  return (
    <>
      {/* mobile: barra inferior */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/90 backdrop-blur-md md:hidden">
        <div className="mx-auto flex w-full max-w-[480px]">
          {ITEMS.map((it) => {
            const active = isActive(it, path);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`relative flex flex-1 flex-col items-center gap-0.5 pb-3 pt-2.5 text-[11px] ${
                  active ? "font-extrabold text-vio" : "font-semibold text-mut"
                }`}
              >
                <span className="relative text-lg">
                  {it.icon}
                  {it.badge ? (
                    <span className="holo absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-extrabold text-white">
                      {it.badge}
                    </span>
                  ) : null}
                </span>
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* desktop: header superior */}
      <nav className="fixed inset-x-0 top-0 z-50 hidden h-16 border-b border-line bg-white/85 backdrop-blur-md md:flex">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-10">
          <Link href="/" className="shrink-0">
            <span className="font-display text-[17px] font-extrabold tracking-tight">
              Tu<span className="holo-text">Carpetero</span>.com
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {ITEMS.map((it) => {
              const active = isActive(it, path);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13.5px] transition ${
                    active ? "bg-vio/10 font-extrabold text-vio" : "font-semibold text-mut hover:bg-line/60 hover:text-body"
                  }`}
                >
                  <span className="relative text-base">
                    {it.icon}
                    {it.badge ? (
                      <span className="holo absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-extrabold text-white">
                        {it.badge}
                      </span>
                    ) : null}
                  </span>
                  {it.label}
                </Link>
              );
            })}
          </div>

          <span className="hidden shrink-0 rounded-full border border-line px-2.5 py-[3px] text-[11px] font-semibold text-mut lg:inline-block">
            Lima · beta
          </span>
        </div>
      </nav>
    </>
  );
}
