"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Basic info we need for each equipment item put in the rental cart
export interface RentalCartItem {
  id: string; // equipment _id
  name: string;
  price: number; // per day price
  image: string;
  days: number; // number of days selected
  availabilityStartDate?: string; // ISO string, rental available from
  availabilityEndDate?: string;   // ISO string, rental available until
}

interface RentalCartContextType {
  items: RentalCartItem[];
  itemCount: number; // number of distinct equipment items
  addItem: (item: RentalCartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const RentalCartContext = createContext<RentalCartContextType | undefined>(undefined);

export function RentalCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RentalCartItem[]>([]);

  // Persist to localStorage so refresh keeps state (not critical but nice UX)
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("rentalCart") : null;
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rentalCart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: RentalCartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        // overwrite days if already present
        return prev.map((i) => (i.id === item.id ? { ...i, days: item.days } : i));
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const itemCount = items.length;

  return (
    <RentalCartContext.Provider value={{ items, itemCount, addItem, removeItem, clearCart }}>
      {children}
    </RentalCartContext.Provider>
  );
}

export function useRentalCart() {
  const ctx = useContext(RentalCartContext);
  if (ctx === undefined) {
    throw new Error("useRentalCart must be used within a RentalCartProvider");
  }
  return ctx;
}
