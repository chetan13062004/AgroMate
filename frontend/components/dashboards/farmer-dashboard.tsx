"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  Sprout,
  Calendar,
  AlertCircle,
  Eye,
  Plus,
  Warehouse,
  MessageCircle,
  Camera,
} from "lucide-react"

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const farmStats = {
    totalSales: 45231,
    activeProducts: 12,
    totalOrders: 89,
    rating: 4.8,
    totalReviews: 156,
    monthlyGrowth: 20.1,
    lowStockItems: 3,
    pendingOrders: 5,
  }

  const recentOrders = [
    {
      id: "#001",
      customer: "Amit Sharma",
      product: "Organic Tomatoes",
      amount: 240,
      status: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "#002",
      customer: "Priya Patel",
      product: "Fresh Mangoes",
      amount: 360,
      status: "Processing",
      date: "2024-01-14",
    },
    { id: "#003", customer: "Raj Kumar", product: "Basmati Rice", amount: 450, status: "Shipped", date: "2024-01-13" },
    {
      id: "#004",
      customer: "Sunita Devi",
      product: "Organic Spinach",
      amount: 180,
      status: "Pending",
      date: "2024-01-12",
    },
  ]

  const topProducts = [
    { name: "Organic Tomatoes", sales: 45, revenue: 12500, stock: 25, trend: "up" },
    { name: "Fresh Mangoes", sales: 32, revenue: 9600, stock: 8, trend: "up" },
    { name: "Basmati Rice", sales: 28, revenue: 8400, stock: 50, trend: "down" },
    { name: "Organic Spinach", sales: 22, revenue: 4400, stock: 2, trend: "up" },
  ]

  const upcomingTasks = [
    { task: "Harvest tomatoes", date: "2024-01-20", priority: "high", type: "harvest" },
    { task: "Plant winter crops", date: "2024-01-22", priority: "medium", type: "planting" },
    { task: "Fertilize mango trees", date: "2024-01-25", priority: "low", type: "maintenance" },
    { task: "Market visit", date: "2024-01-18", priority: "medium", type: "business" },
  ]

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900">Farm Dashboard</h1>
          <p className="text-green-700">Manage your farm operations and track your success</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Farm Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales & Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="planning">Farm Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-green-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{farmStats.totalSales.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+{farmStats.monthlyGrowth}% from last month</p>
                  <Progress value={farmStats.monthlyGrowth * 4} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{farmStats.activeProducts}</div>
                  <p className="text-xs text-blue-600">+2 new this week</p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{farmStats.totalOrders}</div>
                  <p className="text-xs text-orange-600">+12% from last week</p>
                  <Badge variant="secondary" className="mt-2">
                    {farmStats.pendingOrders} pending
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{farmStats.rating}</div>
                  <p className="text-xs text-yellow-600">Based on {farmStats.totalReviews} reviews</p>
                  <div className="flex mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= farmStats.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
                <Plus className="h-6 w-6 mb-1" />
                Add New Product
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Camera className="h-6 w-6 mb-1" />
                AI Crop Diagnosis
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <MessageCircle className="h-6 w-6 mb-1" />
                Customer Messages
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Calendar className="h-6 w-6 mb-1" />
                Seasonal Calendar
              </Button>
            </div>

            {/* Farm Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Farm Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-green-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <p className="text-sm text-gray-600">{task.date}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            {/* Sales Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">₹2,340</div>
                  <p className="text-sm text-gray-600">+15% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">₹18,450</div>
                  <p className="text-sm text-gray-600">+8% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">₹45,231</div>
                  <p className="text-sm text-gray-600">+20% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">
                          {order.id} - {order.customer}
                        </p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.amount}</p>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Shipped"
                                ? "secondary"
                                : order.status === "Processing"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Warehouse className="h-5 w-5" />
                    <span>Total Products</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farmStats.activeProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>Low Stock</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{farmStats.lowStockItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Best Seller</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Organic Tomatoes</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    <span>Most Viewed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Fresh Mangoes</div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${product.stock < 10 ? "bg-red-500" : "bg-green-500"}`} />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.stock < 10 ? "destructive" : "default"}>Stock: {product.stock}</Badge>
                          {product.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            {/* Seasonal Planning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sprout className="h-5 w-5" />
                    <span>Current Season</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Winter</div>
                  <p className="text-sm text-gray-600">Best time for: Wheat, Mustard, Peas</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">View Seasonal Guide</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Next Harvest</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">15 Days</div>
                  <p className="text-sm text-gray-600">Tomatoes ready for harvest</p>
                  <Button variant="outline" className="mt-4">
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Weather & Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Weather Alert</h4>
                    <p className="text-sm text-blue-700">
                      Light rain expected in 3 days. Good time for planting winter crops.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Market Opportunity</h4>
                    <p className="text-sm text-green-700">
                      High demand for organic vegetables this week. Consider increasing prices by 10%.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Crop Care</h4>
                    <p className="text-sm text-yellow-700">
                      Your mango trees need fertilization. Schedule it for next week.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
