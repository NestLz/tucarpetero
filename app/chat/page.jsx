"use client";

import { useState } from "react";
import { CHATS } from "@/lib/data";
import { Verified } from "@/components/ui";

export default function Chat() {
  const [open, setOpen] = useState(null); // id de conversación abierta
  const [chats, setChats] = useState(CHATS);
  const [draft, setDraft] = useState("");

  const active = chats.find((c) => c.id === open);

  const send = () => {
    if (!draft.trim() || !active) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  from: "me",
                  txt: draft.trim(),
                  at: new Date().toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            }
          : c
      )
    );
    setDraft("");
  };

  return (
    <main className="md:flex md:h-[calc(100vh-6.5rem)] md:items-stretch md:gap-6">
      {/* ── lista de conversaciones ── */}
      <section
        className={`${active ? "hidden md:flex" : "flex"} flex-col md:w-80 md:shrink-0 md:overflow-y-auto`}
      >
        <h1 className="mb-4 font-display text-lg font-extrabold tracking-tight">
          Chats
        </h1>
        <div className="flex flex-col gap-2">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => setOpen(c.id)}
              className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
                c.id === open
                  ? "border-vio/50 bg-vio/5"
                  : "border-line bg-white hover:border-vio/40"
              }`}
            >
              <span className="holo flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-extrabold text-white">
                {c.with[0]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13.5px] font-extrabold">{c.with}</span>
                  {c.verified && <Verified />}
                  <span className="ml-auto text-[10.5px] text-mut">{c.lastAt}</span>
                </div>
                <div className="truncate text-[11.5px] text-mut">
                  {c.cardImg} {c.about}
                </div>
                <div className="truncate text-[12px] text-body/80">
                  {c.messages[c.messages.length - 1].txt}
                </div>
              </div>
              {c.unread > 0 && (
                <span className="holo flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold text-white">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-4 px-1 text-center text-[11px] leading-relaxed text-mut">
          Los chats se abren desde una oferta o subasta, siempre ligados a una
          carta específica.
        </p>
      </section>

      {/* ── hilo ── */}
      <section
        className={`${
          active ? "flex min-h-[calc(100vh-6rem)] md:min-h-0" : "hidden md:flex"
        } flex-1 flex-col md:rounded-2xl md:border md:border-line md:bg-white md:p-5`}
      >
        {active ? (
          <>
            <header className="mb-3 flex items-center gap-3">
              <button
                onClick={() => setOpen(null)}
                className="text-xs font-semibold text-mut md:hidden"
              >
                ← Chats
              </button>
              <div className="flex items-center gap-2">
                <span className="holo flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-extrabold text-white">
                  {active.with[0]}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold">
                    {active.with} {active.verified && <Verified />}
                  </div>
                  <div className="text-[11px] text-mut">
                    {active.cardImg} {active.about}
                  </div>
                </div>
              </div>
            </header>

            {/* recordatorio de seguridad */}
            <div className="mb-3 rounded-xl border border-amber/40 bg-amber/10 px-3 py-2 text-[11px] leading-relaxed text-mut">
              🛡 Mantén la negociación y el pago dentro de la plataforma para
              que tu compra quede protegida. Nunca compartas datos bancarios
              por chat.
            </div>

            <section className="flex flex-1 flex-col gap-2 overflow-y-auto pb-3">
              {active.messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed md:max-w-[70%] ${
                    m.from === "me"
                      ? "self-end rounded-br-md bg-ink text-white"
                      : "self-start rounded-bl-md border border-line bg-white"
                  }`}
                >
                  {m.txt}
                  <span
                    className={`ml-2 align-bottom text-[9.5px] ${
                      m.from === "me" ? "text-white/50" : "text-mut/70"
                    }`}
                  >
                    {m.at}
                  </span>
                </div>
              ))}
            </section>

            <footer className="sticky bottom-20 flex gap-2 bg-paper pt-2 md:static md:bg-white">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Escribe un mensaje…"
                className="flex-1 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-vio"
              />
              <button
                onClick={send}
                className="holo rounded-xl px-4 text-sm font-extrabold text-white"
              >
                Enviar
              </button>
            </footer>
          </>
        ) : (
          <div className="hidden h-full flex-col items-center justify-center text-center text-mut md:flex">
            <span className="mb-2 text-3xl">💬</span>
            <p className="text-sm font-semibold text-body">Selecciona un chat</p>
            <p className="mt-1 text-xs">
              Elige una conversación de la lista para ver los mensajes.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
