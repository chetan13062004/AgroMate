"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Package, Trash } from "lucide-react";
import Swal from "sweetalert2";

interface RentalOrder {
  id: string;
  items: any[];
  subtotal: number;
  taxes: number;
  total: number;
  renter: any;
  placedAt: string;
}

export default function RentHistoryPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const deleteOrder = (id: string) => {
    Swal.fire({
      title: "Delete this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (!result.isConfirmed) return;
      if (typeof window !== "undefined") {
        localStorage.removeItem(`order-${id}`);
        const list = JSON.parse(localStorage.getItem("rentalOrderIds") || "[]").filter((x: string) => x !== id);
        localStorage.setItem("rentalOrderIds", JSON.stringify(list));
      }
      setOrders((prev) => prev.filter((o) => o.id !== id));
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = JSON.parse(localStorage.getItem("rentalOrderIds") || "[]");
    const loaded: RentalOrder[] = ids
      .map((id: string) => {
        const data = localStorage.getItem(`order-${id}`);
        return data ? JSON.parse(data) : null;
      })
      .filter(Boolean);
    setOrders(loaded.reverse());
  }, []);

  const filtered = orders.filter((order) => {
    // date filter
    const dateOk = (() => {
      if (!from && !to) return true;
      const d = new Date(order.placedAt).setHours(0, 0, 0, 0);
      if (from && d < new Date(from).setHours(0, 0, 0, 0)) return false;
      if (to && d > new Date(to).setHours(0, 0, 0, 0)) return false;
      return true;
    })();
    // product name filter
    const nameOk = search
      ? order.items.some((it) => it.name.toLowerCase().includes(search.toLowerCase()))
      : true;
    return dateOk && nameOk;
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold">My Rental Orders</h1>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Label>Search by product</Label>
            <Input placeholder="Type product name" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <Label>From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label>To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <Package className="h-12 w-12 mx-auto mb-4" />
          No rental orders yet.
          <div className="mt-4">
            <Button asChild>
              <Link href="/rentals">Browse Equipment</Link>
            </Button>
          </div>
        </div>
      ) : (
        filtered.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order.id}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.placedAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="icon" onClick={() => deleteOrder(order.id)}>
                  <Trash className="h-4 w-4 text-red-600" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.price.toLocaleString()} × {item.days} days
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.price * item.days).toLocaleString()}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-end font-semibold">
                Total Paid: ₹{order.total.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
