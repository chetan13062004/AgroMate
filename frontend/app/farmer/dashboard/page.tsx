"use client"

import { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  Plus,
  Eye,
  MessageCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { orderApi, Order } from "@/lib/api"
import { productService } from "@/lib/api/productService"
import { equipmentService } from "@/lib/api/equipmentService"
// import { AuthContext } from "@/contexts/auth-context"

// Mock data
const salesData = [
  { month: "Jan", sales: 12000, orders: 45 },
  { month: "Feb", sales: 15000, orders: 52 },
  { month: "Mar", sales: 18000, orders: 61 },
  { month: "Apr", sales: 22000, orders: 73 },
  { month: "May", sales: 25000, orders: 84 },
  { month: "Jun", sales: 28000, orders: 92 },
]

// const recentOrders = [ ... ] // Removed mock data
// const topProducts = [ ... ] // Removed mock data

export default function FarmerDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const auth = useContext(AuthContext)

  // Derived stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = orders.length
  // Top products by sales count
  const productSalesMap: Record<string, { name: string; sales: number; revenue: number }> = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      const productName = typeof item.product === 'string' ? item.product : item.product?.name || 'Unknown'
      if (!productSalesMap[productName]) {
        productSalesMap[productName] = { name: productName, sales: 0, revenue: 0 }
      }
      productSalesMap[productName].sales += item.quantity
      productSalesMap[productName].revenue += item.price * item.quantity
    })
  })
  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3)
    .map((p, i) => ({ ...p, trend: i === 0 ? "up" : "down" }))

  // Simulate salesData for charts (could be improved)
  const salesData = [
    { month: "Jan", sales: totalRevenue, orders: totalOrders },
    { month: "Feb", sales: totalRevenue, orders: totalOrders },
    { month: "Mar", sales: totalRevenue, orders: totalOrders },
    { month: "Apr", sales: totalRevenue, orders: totalOrders },
    { month: "May", sales: totalRevenue, orders: totalOrders },
    { month: "Jun", sales: totalRevenue, orders: totalOrders },
  ]

  // Recent orders (latest 3)
  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order._id?.slice(-4) || order._id,
    customer:
      typeof order.user === 'string'
        ? order.user
        : ((order.user as any)?.name || (order.user as any)?.email || 'Unknown'),
    amount: order.total,
    status: order.status,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""
  }))

  // Stats for cards (fallbacks for demo)
  const stats = {
    totalRevenue: totalRevenue || 0,
    monthlyGrowth: 15.2, // Placeholder
    totalOrders: totalOrders || 0,
    activeProducts: topProducts.length,
    avgRating: 4.8, // Placeholder
    totalReviews: 156, // Placeholder
    responseRate: 98, // Placeholder
    lowStockItems: 3, // Placeholder
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      orderApi.getFarmerOrders(),
      productService.getFarmerProducts(),
      equipmentService.getMyEquipment()
    ])
      .then(([ordersRes, productsRes, equipRes]) => {
        if (ordersRes.error) {
          setError(typeof ordersRes.error === 'string' ? ordersRes.error : ordersRes.error.message)
          setOrders([])
        } else {
          setOrders(ordersRes.data || [])
        }
        setProducts(productsRes || [])
        setEquipment(equipRes || [])
      })
      .catch(e => {
        setError(e?.message || 'Failed to load data')
        setOrders([])
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}

        {/* Farmer's Products Card */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading products...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : products.length === 0 ? (
                <div>No products found. Add your first product!</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product._id || product.id} className="border rounded-lg p-4 flex flex-col">
                      <div className="font-semibold text-lg mb-1">{product.name}</div>
                      <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                      <div className="mb-2">₹{product.price} / {product.unit}</div>
                      {(product.imageUrl || product.image || (product.images && product.images[0])) ? (
                        <img
                          src={product.imageUrl || product.image || (product.images && product.images[0])}
                          alt={product.name}
                          className="h-24 w-full object-cover rounded mb-2"
                          onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                        />
                      ) : (
                        <div className="h-24 w-full bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-400">
                          No image
                        </div>
                      )}
                      <div className="flex-1" />
                      <div className="text-xs text-gray-400 mt-2">Stock: {product.stock}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Farm Dashboard</h1>
            <p className="text-green-700">Welcome back! Here's your farm performance overview</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{stats.monthlyGrowth}% this month</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
                  <p className="text-sm text-blue-600">+12% from last month</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.activeProducts}</p>
                  <p className="text-sm text-purple-600">+3 new this week</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.avgRating}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">({stats.totalReviews} reviews)</span>
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : error ? (
                  <div className="text-center text-red-500 py-8">{error}</div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No orders found.</div>
                ) : recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {order.id} - {order.customer}
                      </p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.amount}</p>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "shipped"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                View All Orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} units sold</p>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <div>
                        <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                      </div>
                      {product.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* My Products */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>My Products</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-sm text-gray-600">No products yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product._id || product.id} className="border rounded p-3 flex flex-col">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-32 w-full object-cover rounded mb-2" />
                      ) : (
                        <div className="h-32 w-full bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-400">No image</div>
                      )}
                      <h4 className="font-medium mb-1">{product.name}</h4>
                      <span className="text-sm text-gray-600 mb-1">₹{product.price}/{product.unit}</span>
                      <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="self-start mt-auto">
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Rental Equipment */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>My Rental Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              {equipment.length === 0 ? (
                <p className="text-sm text-gray-600">No equipment listed.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipment.map((eq) => (
                    <div key={eq._id || eq.id} className="border rounded p-3 flex flex-col">
                      {(eq.imageUrl || eq.images?.[0]) ? (
                        <img src={eq.imageUrl || eq.images?.[0]} alt={eq.name} className="h-40 w-full object-cover rounded mb-2" />
                      ) : (
                        <div className="h-32 w-full bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-400">No image</div>
                      )}
                      <h4 className="font-medium mb-1">{eq.name}</h4>
                      <span className="text-sm text-gray-600 mb-1">₹{eq.pricePerDay}/day · {eq.category}</span>
                      {eq.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-1">{eq.description}</p>
                      )}
                      {(eq.rating || eq.reviewCount) && (
                        <span className="text-xs text-gray-500 mb-1">⭐ {eq.rating?.toFixed(1) || '--'} ({eq.reviewCount || 0})</span>
                      )}
                      <Badge variant={eq.available ? 'default' : 'destructive'} className="self-start mt-auto">
                        {eq.available ? 'Available' : 'Rented'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Update Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Customer Messages
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Harvest
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Rate</span>
                  <span>{stats.responseRate}%</span>
                </div>
                <Progress value={stats.responseRate} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Satisfaction</span>
                  <span>96%</span>
                </div>
                <Progress value={96} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-time Delivery</span>
                  <span>94%</span>
                </div>
                <Progress value={94} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">{stats.lowStockItems} products low in stock</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm">3 new customer messages</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm">Harvest reminder: Tomatoes ready</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
