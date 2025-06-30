"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { orderApi, Order } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DeliveryTracking from "@/components/delivery-tracking"
import { Download, MessageCircle, Phone, RefreshCw } from "lucide-react"

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string

    // Component state
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getOrderById(orderId)
        if (res.error) {
          setError(typeof res.error === 'string' ? res.error : res.error.message)
        } else {
          // @ts-ignore backend returns order directly or under data.data
          const data = res.data?.data || res.data
          setOrder(data as Order)
        }
      } catch (err: any) {
        console.error('Error fetching order:', err)
        setError(err.message || 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 text-red-600">
        {error || 'Order not found'}
      </div>
    )
  }

  
/*

    

    






*/
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          <p className="text-gray-600">Order ID: {orderId}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="capitalize">{order.status.replace('_',' ')}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">₹{order.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Delivery:</span>
                <span>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : '—'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-medium">₹{item.quantity * item.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Farmer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.farmer && (
  <p className="font-medium">
    {(order.farmer as any)?.name ?? order.farmer}
  </p>
)}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Tracking */}
        <div className="lg:col-span-2">
          <DeliveryTracking orderId={orderId} />
        </div>
      </div>
    </div>
  )
}
