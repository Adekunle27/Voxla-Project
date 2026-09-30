import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";
import { CartItem, OrderResult } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clear: () => void;
  total: number;
  checkout: (delivery: { address: string; city: string; phone: string; preferredDate?: string }) => Promise<OrderResult>;
}

const CartContext = createContext<CartState | undefined>(undefined);

const STORAGE_KEY = "voxla_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.materialId === item.materialId && i.supplierId === item.supplierId);
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, item];
    });
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function checkout(delivery: { address: string; city: string; phone: string; preferredDate?: string }): Promise<OrderResult> {
    const res = await api.post("/orders", {
      items: items.map((i) => ({ materialId: i.materialId, supplierId: i.supplierId, qty: i.qty })),
      delivery,
    });
    clear();
    return res.data.order;
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
