import React, { createContext, useContext, useEffect, useState } from "react";
import { Material } from "../types";

type FavoritesState = { items: Material[]; isSaved: (id: string) => boolean; toggle: (material: Material) => void };
const FavoritesContext = createContext<FavoritesState | undefined>(undefined);
const STORAGE_KEY = "voxla_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Material[]>(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
  const isSaved = (id: string) => items.some((item) => item.id === id);
  const toggle = (material: Material) => setItems((current) => isSaved(material.id) ? current.filter((item) => item.id !== material.id) : [...current, material]);
  return <FavoritesContext.Provider value={{ items, isSaved, toggle }}>{children}</FavoritesContext.Provider>;
}
export function useFavorites() { const context = useContext(FavoritesContext); if (!context) throw new Error("useFavorites must be used within FavoritesProvider"); return context; }
