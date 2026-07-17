"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Buscar", icon: "🔍" },
  { href: "/subastas", label: "Subastas", icon: "🔨" },
  { href: "/chat", label: "Chat", icon: "💬", badge: 2 },
  { href: "/perfil/KensoTCG", label: "Perfil", icon: "👤" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[480px]">
        {ITEMS.map((it) => {
          const active =
            it.href === "/" ? path === "/" || path.startsWith("/carta") : path.startsWith(it.href.split("/").slice(0, 2).join("/"));
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
  );
}
