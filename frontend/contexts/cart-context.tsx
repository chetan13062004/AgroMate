"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { CartItem } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
  addItem: (productId: string, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  checkout: () => Promise<any>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // determine current role
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [total, setTotal] = useState(0)

  // Fetch current cart from server
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const buildHeaders = (extra: Record<string, string> = {}): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return {
      ...extra,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        credentials: "include",
        headers: buildHeaders(),
      })
      if (res.status === 403) {
        // user not authorized (e.g., not a buyer) – just keep cart empty
        setItems([])
        setSubtotal(0)
        setDeliveryFee(0)
        setTotal(0)
        return
      }
      if (!res.ok) throw new Error("Failed to fetch cart")
      const data = await res.json()
      transformAndSet(data)
    } catch (err) {
      console.error(err)
    }
  }

  const transformAndSet = (cartData: any) => {
    const backendItems = cartData?.items || []
    const mapped: CartItem[] = backendItems.map((item: any) => {
      const p = item.product || {}
      return {
        id: p._id,
        productId: p._id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        image: p.imageUrl ?? "/placeholder.svg",
        quantity: item.quantity,
        farmerId: p.farmer,
      }
    })
    setItems(mapped)
    setSubtotal(cartData.subtotal || 0)
    setDeliveryFee(cartData.deliveryFee || 0)
    setTotal(cartData.total || 0)
  }

  // Initial load – only fetch cart if the logged-in user is a buyer
  useEffect(() => {
    if (user?.role === 'buyer') {
      fetchCart();
    } else {
      // Clear any previous cart data if role changed
      setItems([]);
      setSubtotal(0);
      setDeliveryFee(0);
      setTotal(0);
    }
  }, [user?.role])

  const addItem = async (productId: string, quantity = 1) => {
    await fetch(`${API_BASE}/api/cart`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      body: JSON.stringify({ productId, quantity }),
    })
    await fetchCart()
  }

  const removeItem = async (productId: string) => {
    await fetch(`${API_BASE}/api/cart/${productId}`, {
      headers: buildHeaders(),
      
      method: "DELETE",
      credentials: "include",
    })
    await fetchCart()
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId)
      return
    }
    // Determine current quantity then send delta
    const existing = items.find((i) => i.productId === productId)
    const delta = quantity - (existing?.quantity || 0)
    if (delta === 0) return
    await addItem(productId, delta)
  }

  const clearCart = async () => {
    // remove each item sequentially (could be optimized in backend)
    for (const item of items) {
      await removeItem(item.productId)
    }
  }

  const checkout = async () => {
    const res = await fetch(`${API_BASE}/api/orders/checkout`, {
      headers: buildHeaders(),
      
      method: "POST",
      credentials: "include",
    })
    if (!res.ok) {
      throw new Error("Checkout failed")
    }
    const order = await res.json()
    // Refresh cart (backend clears it after successful checkout)
    await fetchCart()
    return order
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
