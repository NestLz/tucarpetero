"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CHATS as SEED_CHATS } from "@/lib/data";

const ChatContext = createContext(null);
const STORAGE_KEY = "tucarpetero_chats";

function nowLabel() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(SEED_CHATS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChats(JSON.parse(raw));
    } catch {
      // localStorage no disponible o datos corruptos — arrancar con los chats de ejemplo
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats, hydrated]);

  const sendMessage = (chatId, text) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastAt: "ahora",
              messages: [...c.messages, { from: "me", txt: text, at: nowLabel() }],
            }
          : c
      )
    );
  };

  // abre el chat con ese vendedor sobre esa carta — si no existe, lo crea.
  // devuelve el id de forma síncrona para poder navegar de inmediato.
  const getOrCreateChat = ({ seller, verified, cardId, cardName, price }) => {
    const existing = chats.find((c) => c.with === seller && c.cardId === cardId);
    if (existing) return existing.id;

    const id = `c-${seller}-${cardId}-${Date.now()}`;
    const newChat = {
      id,
      with: seller,
      verified,
      cardId,
      cardImg: "🎴",
      about: price != null ? `${cardName} · S/ ${price}` : cardName,
      unread: 0,
      lastAt: "ahora",
      messages: [
        { from: "them", txt: "¡Hola! Sí, la carta sigue disponible 👍", at: nowLabel() },
      ],
    };
    setChats((prev) => [newChat, ...prev]);
    return id;
  };

  return (
    <ChatContext.Provider value={{ chats, sendMessage, getOrCreateChat, hydrated }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChats debe usarse dentro de <ChatProvider>");
  return ctx;
}
