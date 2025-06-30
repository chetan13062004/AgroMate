"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Package,
  Truck,
  Download,
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  Star,
  Share2,
  Home,
} from "lucide-react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Helper derived address object for display
  const address = order?.deliveryAddress || order?.renter || null;

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Load order data
    if (orderId) {
      const orderData = localStorage.getItem(`order-${orderId}`)
      if (orderData) {
        setOrder(JSON.parse(orderData))
      }
    }
    setLoading(false)
  }, [orderId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    )
  }

  const estimatedDelivery = new Date(Date.now() + 24 * 60 * 60 * 1000)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-600">Thank you for your order. We'll start preparing it right away.</p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
          <p className="text-green-800 font-medium">Order ID: {order.id}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                  </div>
                  <Badge className="bg-green-600">Completed</Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Preparing Order</p>
                    <p className="text-sm text-gray-600">Farmer is preparing your fresh produce</p>
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-gray-600">Your order will be delivered soon</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-gray-600">
                    {address?.name || "-"}
                    <br />
                    {address?.address || "-"}
                    <br />
                    {address?.city || ""} {address?.state ? `, ${address.state}` : ""}
                      {address?.pincode ? ` - ${address.pincode}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">
                    {estimatedDelivery.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    {order.deliverySlot === "express" ? "Within 2 hours" : "By 6:00 PM"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg?height=60&width=60"}
                      alt={item.name}
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit} × ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-500">From: {item.farmerName || "Local Farmer"}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/orders/${order.id}`}>
                <Button className="w-full" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </Link>

              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>

              <Button className="w-full" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with Farmer
              </Button>

              <Button className="w-full" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}</span>
              </div>
              {order.slotFee > 0 && (
                <div className="flex justify-between">
                  <span>Express Fee</span>
                  <span>₹{order.slotFee}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{order.taxes}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Paid</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="text-center mt-4">
                <Badge variant="outline" className="capitalize">
                  {order.paymentMethod} Payment
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Share & Continue Shopping */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Order
              </Button>

              <Link href="/products">
                <Button className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>

              <Link href="/">
                <Button className="w-full" variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Rate Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Rate Your Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">How was your ordering experience?</p>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 text-yellow-400 fill-current cursor-pointer hover:scale-110" />
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Submit Rating
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
