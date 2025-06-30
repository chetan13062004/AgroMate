"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRentalCart } from "@/contexts/rental-cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function RentCheckoutPage() {
  const { items, clearCart } = useRentalCart() as any;
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  // Only Cash on Delivery is supported now
  const paymentMethod = "cod" as const;
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const [details, setDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    fromDate: "", // rental start
    toDate: "",   // rental end
    notes: "",
  });

  // String for today's date (YYYY-MM-DD) for use in min attribute & validation
  const todayStr = new Date().toISOString().split("T")[0];

  const handleChange = (field: string, value: string) =>
    setDetails((prev) => ({ ...prev, [field]: value }));

  const validateDetails = () => {
    const e: { [k: string]: string } = {};
    if (!details.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(details.phone)) e.phone = "Enter valid 10-digit phone";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(details.email)) e.email = "Invalid email";
    if (details.address.trim().length < 10) e.address = "Address too short";
    if (!details.fromDate) e.fromDate = "Start date required";
    else if (new Date(details.fromDate) < new Date(todayStr)) e.fromDate = "Start date cannot be in the past";
    if (!details.toDate) e.toDate = "End date required";
    else if (new Date(details.toDate) < new Date(todayStr)) e.toDate = "End date cannot be in the past";
    if (details.fromDate && details.toDate && new Date(details.toDate) < new Date(details.fromDate)) {
      e.toDate = "End date must be after start date";
    }

    // Availability range validation for every item in the cart
    if (details.fromDate && details.toDate) {
      items.forEach((item: any) => {
        if (item.availabilityStartDate && new Date(details.fromDate) < new Date(item.availabilityStartDate)) {
          e.fromDate = `Start date must be on/after ${new Date(item.availabilityStartDate).toLocaleDateString()}`;
        }
        if (item.availabilityEndDate && new Date(details.toDate) > new Date(item.availabilityEndDate)) {
          e.toDate = `End date must be on/before ${new Date(item.availabilityEndDate).toLocaleDateString()}`;
        }
      });
    }

    return e;
  };

  const basicValid = details.name && details.phone && details.email && details.address && details.fromDate && details.toDate;

  // Determine rental duration (inclusive of both start and end date)
    // Determine rental duration (inclusive of both start and end date)
  const rentalDays =
    details.fromDate && details.toDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(details.toDate).getTime() - new Date(details.fromDate).getTime()) / 86400000
          ) + 1
        )
      : 0;

  // Calculate total price across all items based on selected duration (fallback to previous days)
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * (rentalDays || item.days),
    0
  );
  const taxes = Math.round(subtotal * 0.05); // 5% GST approximation
  const total = subtotal + taxes;

  // Overall availability window across all items in cart
  const availabilityWindow = useMemo(() => {
    if (items.length === 0) return null;
    const latestStart = new Date(
      Math.max(...items.map((i: any) => new Date(i.availabilityStartDate).getTime()))
    );
    const earliestEnd = new Date(
      Math.min(...items.map((i: any) => new Date(i.availabilityEndDate).getTime()))
    );
    if (latestStart > earliestEnd) return null; // no common window
    return { latestStart, earliestEnd } as const;
  }, [items]);

  useEffect(() => {
    // Redirect back to cart if it becomes empty
    if (items.length === 0 && !processing) {
      router.replace("/rent-cart");
    }
  }, [items, processing, router]);

  

  const handlePayment = async (): Promise<boolean> => {
  // Always true since only COD
  return true;
};
      
      
      
      
      
        
        
        

      
        

      
        
          
  




  const placeOrder = async () => {
    const errs = validateDetails();
    setErrors(errs);
    if (Object.keys(errs).length) {
      await Swal.fire("Invalid details", "Please correct form errors and try again.", "error");
      return;
    }
    setProcessing(true);

    const paid = await handlePayment();
    if (!paid) { setProcessing(false); return; }

    const id = `rent-${Date.now()}`;
    const order = {
      id,
      items,
      subtotal,
      taxes,
      total,
      renter: details,
      placedAt: new Date().toISOString()
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(`order-${id}`, JSON.stringify(order));
      const list = JSON.parse(localStorage.getItem("rentalOrderIds") || "[]");
      if (!list.includes(id)) {
        localStorage.setItem("rentalOrderIds", JSON.stringify([...list, id]));
      }
    }

    clearCart();

    Swal.fire({
      title: "Order Confirmed!",
      text: "Your rental order has been successfully placed.",
      icon: "success",
      confirmButtonText: "View My Rentals",
    }).then(() => {
      router.push("/rent-history");
    });
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Rental Checkout</h1>
      {availabilityWindow && (
        <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Available to rent between <b>{availabilityWindow.latestStart.toLocaleDateString()}</b> and <b>{availabilityWindow.earliestEnd.toLocaleDateString()}</b>.
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Renter Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="Full name"
                    value={details.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone {errors.phone && <span className="text-red-600 text-xs">– {errors.phone}</span>}</Label>
                  <Input
                    placeholder="10-digit mobile number"
                    value={details.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>Email {errors.email && <span className="text-red-600 text-xs">– {errors.email}</span>}</Label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={details.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>Address {errors.address && <span className="text-red-600 text-xs">– {errors.address}</span>}</Label>
                  <Textarea
                    rows={3}
                    placeholder="Delivery / pickup address"
                    value={details.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <Label>From Date {errors.fromDate && <span className="text-red-600 text-xs">– {errors.fromDate}</span>}</Label>
                  <Input
                    type="date"
                    min={todayStr}
                    value={details.fromDate}
                    onChange={(e) => handleChange("fromDate", e.target.value)}
                    className={errors.fromDate ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>To Date {errors.toDate && <span className="text-red-600 text-xs">– {errors.toDate}</span>}</Label>
                  <Input
                    type="date"
                    min={todayStr}
                    value={details.toDate}
                    onChange={(e) => handleChange("toDate", e.target.value)}
                    className={errors.toDate ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    rows={3}
                    placeholder="Any special instructions..."
                    value={details.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="flex space-x-4 p-4 items-center">
                <div className="relative w-24 h-24">
                  <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} / day</p>
                  <p className="text-sm">Days: {rentalDays || item.days}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.days).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Price Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span>₹{taxes.toLocaleString()}</span>
            </div>
            {/* Payment method */}
            <div className="mt-4">
              <Label className="mb-2 inline-block">Payment Method</Label>
              <div className="flex gap-4 mt-1">
                <span className="font-medium">Cash on Pickup/Delivery</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <Button className="w-full mt-4" disabled={processing || !basicValid} onClick={placeOrder}>
              {processing ? "Placing order..." : "Place Order"}
            </Button>
            <Link href="/rent-cart">
              <Button className="w-full mt-2" variant="outline" disabled={processing}>
                Back to Cart
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
