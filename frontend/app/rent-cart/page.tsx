"use client";

import { useRentalCart } from "@/contexts/rental-cart-context";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RentCartPage() {
  const { items, removeItem, clearCart } = useRentalCart() as any;

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.days, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Your rental cart is empty</h1>
        <Button asChild>
          <Link href="/rentals">Browse Equipment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Rent Cart</h1>
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center border rounded p-4 shadow-sm">
            <div className="relative w-24 h-24 mr-4">
              <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} / day</p>
              <p className="text-sm">Days: {item.days}</p>
            </div>
            <p className="font-semibold mr-4">₹{(item.price * item.days).toLocaleString()}</p>
            <Button variant="destructive" onClick={() => removeItem(item.id)}>Remove</Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <div>
          <h3 className="text-xl font-bold">Total: ₹{total.toLocaleString()}</h3>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
          <Button asChild>
            <Link href="/rent-checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
