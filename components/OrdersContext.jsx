"use client";

import { createContext, useContext, useEffect, useState } from "react";

const OrdersContext = createContext(null);
const STORAGE_KEY = "tucarpetero_orders";

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {
      // localStorage no disponible o datos corruptos — arrancar sin pedidos
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  // order: { orderNumber, date, items, total, paymentMethod, delivery }
  const addOrder = (order) => setOrders((prev) => [order, ...prev]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, hydrated }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de <OrdersProvider>");
  return ctx;
}
