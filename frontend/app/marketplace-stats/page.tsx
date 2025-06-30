"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Package, MapPin, Star, Leaf } from "lucide-react"

// Mock data for marketplace statistics
const categoryData = [
  { name: "Vegetables", value: 45, color: "#22c55e" },
  { name: "Fruits", value: 30, color: "#f59e0b" },
  { name: "Grains", value: 15, color: "#3b82f6" },
  { name: "Herbs", value: 10, color: "#8b5cf6" },
]

const regionData = [
  { region: "Maharashtra", farmers: 156, orders: 2340 },
  { region: "Gujarat", farmers: 134, orders: 1890 },
  { region: "Punjab", farmers: 98, orders: 1560 },
  { region: "Karnataka", farmers: 87, orders: 1230 },
  { region: "Tamil Nadu", farmers: 76, orders: 980 },
]

const monthlyGrowth = [
  { month: "Jan", farmers: 320, customers: 1200, orders: 890 },
  { month: "Feb", farmers: 345, customers: 1350, orders: 1020 },
  { month: "Mar", farmers: 378, customers: 1480, orders: 1180 },
  { month: "Apr", farmers: 412, customers: 1620, orders: 1340 },
  { month: "May", farmers: 456, customers: 1780, orders: 1520 },
  { month: "Jun", farmers: 489, customers: 1920, orders: 1680 },
]

const topFarmers = [
  { name: "Rajesh Kumar", location: "Pune", rating: 4.9, orders: 234, revenue: 89000 },
  { name: "Priya Sharma", location: "Nashik", rating: 4.8, orders: 198, revenue: 76000 },
  { name: "Suresh Patel", location: "Ahmedabad", rating: 4.7, orders: 167, revenue: 65000 },
  { name: "Meera Singh", location: "Ludhiana", rating: 4.8, orders: 145, revenue: 58000 },
  { name: "Arjun Reddy", location: "Bangalore", rating: 4.6, orders: 132, revenue: 52000 },
]

export default function MarketplaceStatsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace Statistics</h1>
        <p className="text-gray-600">Comprehensive insights into our farming community</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Farmers</p>
                <p className="text-3xl font-bold text-gray-900">489</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-3xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% this month
                </p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">1,920</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% this month
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-3xl font-bold text-gray-900">4.7</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Based on 2,456 reviews
                </p>
              </div>
              <Star className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="farmers" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Regional Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="farmers" fill="#22c55e" name="Farmers" />
              <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Farmers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Top Performing Farmers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFarmers.map((farmer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{farmer.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {farmer.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{farmer.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Orders</p>
                      <p className="font-medium">{farmer.orders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-medium">₹{farmer.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Organic Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Organic Certified</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-gray-600">840 out of 1,234 products</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Satisfaction Rate</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-gray-600">Based on recent surveys</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">On-time Delivery</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
              <p className="text-xs text-gray-600">Within promised timeframe</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
