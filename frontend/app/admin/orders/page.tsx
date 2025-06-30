"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Search,
  Download,
  Phone,
  Calendar,
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Type definitions
type Customer = { name: string; phone?: string };
type Farmer = { name: string; farmName?: string };
type Order = {
  id: string;
  _id: string;
  customer: Customer;
  farmer?: Farmer;
  total: number;
  status: string;
  paymentStatus?: string;
  orderDate: string;
};

export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all orders once on component mount
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/orders`, { withCredentials: true })
        const data = res.data?.data?.orders ?? []
        
        const mapped: Order[] = data.map((o: any) => ({
          id: o.orderNumber ?? o._id,
          _id: o._id,
          customer: { name: o.user?.name ?? "N/A", phone: o.user?.phone ?? "N/A" },
          farmer: (() => {
            const farmerObj = o.items?.[0]?.product?.farmer;
            return farmerObj ? { name: farmerObj.name, farmName: farmerObj.farmName } : { name: "N/A" };
          })(),
          total: o.total,
          status: o.status,
          paymentStatus: o.paymentStatus ?? "paid",
          orderDate: o.createdAt,
        }))
        setAllOrders(mapped);
      } catch (err) {
        console.error("Failed to fetch orders", err)
      }
    }

    fetchAllOrders()
  }, [])


  // Filter orders based on the search term. This is re-calculated only when dependencies change.
  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return allOrders;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return allOrders.filter(order =>
      order.id.toLowerCase().includes(lowercasedTerm) ||
      order.customer.name.toLowerCase().includes(lowercasedTerm) ||
      (order.farmer?.name ?? "").toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, allOrders]);


  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      processing: { text: "Processing", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { text: "Confirmed", className: "bg-blue-100 text-blue-800" },
      in_transit: { text: "In Transit", className: "bg-purple-100 text-purple-800" },
      delivered: { text: "Delivered", className: "bg-green-100 text-green-800" },
      cancelled: { text: "Cancelled", className: "bg-red-100 text-red-800" },
    };
    const { text, className } = statusMap[status] || { text: status, className: "" };
    return <Badge className={className}>{text}</Badge>;
  };

  const getPaymentBadge = (status?: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending": return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default: return <Badge variant="outline">{status ?? "N/A"}</Badge>;
    }
  };

  const exportOrders = () => {
    const csvContent = [
        ["Order ID", "Customer", "Farmer", "Total", "Status", "Payment", "Order Date"],
        ...filteredOrders.map(o => [o.id, o.customer.name, o.farmer?.name ?? "N/A", o.total, o.status, o.paymentStatus, new Date(o.orderDate).toLocaleDateString()])
      ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "orders-export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <ShoppingCart className="h-8 w-8 mr-3" />
              Order Management
            </h1>
            <p className="text-slate-600">Monitor and manage all marketplace orders</p>
          </div>
          <Button onClick={exportOrders} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold">{allOrders.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- FILTER MODIFIED: TEXT FIELD ONLY --- */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Order ID, Customer Name, or Farmer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <div className="flex gap-2">
                        {getStatusBadge(order.status)}
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.customer.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Farmer</p>
                        <p className="font-medium">{order.farmer?.name ?? "N/A"}</p>
                        <p className="text-gray-500">{order.farmer?.farmName ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Order Total</p>
                        <p className="font-medium">₹{order.total.toFixed(2)}</p>
                        <p className="text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No orders found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}