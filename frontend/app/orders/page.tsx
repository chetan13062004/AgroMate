"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Eye,
  MessageCircle,
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Trash,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react"

import Swal from "sweetalert2"

import { orderApi, Order } from "@/lib/api"

/*
Mock orders data (kept here for reference only)

// removed mock data
  {
    id: "ORD-2024-001",
    customer: "Amit Sharma",
    farmer: "Rajesh Kumar",
    items: [
      { name: "Organic Tomatoes", quantity: "2 kg", price: 120 },
      { name: "Fresh Spinach", quantity: "1 kg", price: 80 },
    ],
    total: 200,
    status: "delivered",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-16",
    deliveryAddress: "123 MG Road, Pune, Maharashtra 411001",
    paymentMethod: "UPI",
    customerPhone: "+91 98765 43210",
    farmerPhone: "+91 87654 32109",
  },
  {
    id: "ORD-2024-002",
    customer: "Priya Patel",
    farmer: "Suresh Patel",
    items: [
      { name: "Organic Carrots", quantity: "3 kg", price: 150 },
      { name: "Fresh Coriander", quantity: "500g", price: 40 },
    ],
    total: 190,
    status: "in_transit",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-15",
    deliveryAddress: "456 FC Road, Pune, Maharashtra 411005",
    paymentMethod: "Card",
    customerPhone: "+91 98765 43211",
    farmerPhone: "+91 87654 32108",
  },
  {
    id: "ORD-2024-003",
    customer: "Rohit Singh",
    farmer: "Meera Singh",
    items: [
      { name: "Basmati Rice", quantity: "5 kg", price: 400 },
      { name: "Organic Wheat", quantity: "10 kg", price: 350 },
    ],
    total: 750,
    status: "processing",
    orderDate: "2024-01-13",
    deliveryDate: "2024-01-16",
    deliveryAddress: "789 Baner Road, Pune, Maharashtra 411045",
    paymentMethod: "COD",
    customerPhone: "+91 98765 43212",
    farmerPhone: "+91 87654 32107",
  },
  {
    id: "ORD-2024-004",
    customer: "Sneha Reddy",
    farmer: "Arjun Reddy",
    items: [{ name: "Fresh Mangoes", quantity: "2 kg", price: 300 }],
    total: 300,
    status: "cancelled",

*/

export default function OrdersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
    const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;

    const res = await orderApi.deleteOrder(id);
    if (res.error && (res.error as any)?.statusCode !== 404) {
      // Show any error except 404
      await Swal.fire("Error", typeof res.error === "string" ? res.error : res.error.message, "error");
      return;
    }
    // Proceed even if backend returns 404 (not found) – treat as already deleted
    setOrders((prev) => prev.filter((o) => (o.id || o._id) !== id));
    await Swal.fire("Deleted", "Order has been deleted.", "success");
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const res = user?.role === "farmer" ? await orderApi.getFarmerOrders() : await orderApi.getMyOrders()
      if (res.error) {
        setError(typeof res.error === "string" ? res.error : res.error.message)
      } else {
        // @ts-ignore backend returns {data:{data:[orders]}} shape handled by apiRequest
        const data = res.data?.data || res.data
        setOrders(data as Order[])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [user])

  // Compute order statistics for quick overview cards
  const orderStats = useMemo(() => {
    const baseStats: Record<string, number> = {
      total: orders.length,
      processing: 0,
      confirmed: 0,
      in_transit: 0,
      delivered: 0,
      cancelled: 0,
    }

    orders.forEach((order) => {
      const statusKey = order.status as keyof typeof baseStats
      if (statusKey in baseStats) {
        baseStats[statusKey] += 1
      }
    })

    return baseStats
  }, [orders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase()
    const orderId = (order.id || order._id || '').toString().toLowerCase()
    const customerName = (order.customer || '').toLowerCase()
    const farmerName = (order.farmer || '').toLowerCase()
    const matchesSearch =
      orderId.includes(lowerSearch) ||
      customerName.includes(lowerSearch) ||
      farmerName.includes(lowerSearch)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
        <p className="text-gray-600">Track and manage all your orders</p>
      </div>

      {/* Order statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{orderStats.processing}</p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{orderStats.in_transit}</p>
              <p className="text-sm text-gray-600">In Transit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by ID, customer, or farmer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                      {(() => {
                        const firstItem = order.items[0] as any;
                        const img = firstItem?.product?.imageUrl || firstItem?.product?.images?.[0] || firstItem?.product?.image || firstItem?.image || "/placeholder-product.jpg";
                        return img ? (
                          <img
                            src={img}
                            alt={firstItem?.product?.name || "Product"}
                            className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover shadow"
                          />
                        ) : null;
                      })()}
                    <h3 className="text-lg font-semibold">
  {(() => {
    const dateStr = order.orderDate || order.createdAt;
    if (dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }
    return "Date N/A";
  })()}
</h3>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.replace("_", " ")}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">₹{order.subtotal}</p>
                      <p className="text-gray-600 mt-1">Delivery Fee: ₹{order.deliveryFee}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-gray-600 text-sm">Items:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {order.items.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {
                            (() => {
                              const prod = item.product as any;
                              const name = (prod && prod.name) || item.name || String(item.product);
                              const imgSrc = prod?.imageUrl || prod?.images?.[0] || prod?.image || item.image || "/placeholder-product.jpg";
                              return (
                                <span className="flex items-center gap-1">
                                  {imgSrc && (
                                    <img src={imgSrc} alt={name} className="h-4 w-4 object-cover rounded-full" />
                                  )}
                                  {name} (x{item.quantity})
                                </span>
                              );
                            })()
                          }
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{order.total}</p>
                    <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>

                    {order.status === "in_transit" && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    )}

                    <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id || order._id)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any orders yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
