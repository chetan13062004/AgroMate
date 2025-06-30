"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FarmerDashboard from "@/components/dashboards/farmer-dashboard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, CheckCircle, X, Eye, Download } from "lucide-react"

// Mock data for admin dashboard
const pendingFarmers = [
  {
    id: "1",
    name: "Suresh Patel",
    farmName: "Green Valley Farm",
    location: "Gujarat",
    appliedDate: "2024-01-15",
    status: "pending",
    farmSize: "10 acres",
    specialization: "Organic Vegetables",
  },
  {
    id: "2",
    name: "Meera Singh",
    farmName: "Sunrise Organic Farm",
    location: "Punjab",
    appliedDate: "2024-01-14",
    status: "pending",
    farmSize: "15 acres",
    specialization: "Grains & Pulses",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Amit Sharma",
    farmer: "Rajesh Kumar",
    amount: 450,
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Priya Patel",
    farmer: "Suresh Patel",
    amount: 320,
    status: "in_transit",
    date: "2024-01-15",
  },
]

const reportedIssues = [
  {
    id: "ISS-001",
    type: "Quality Issue",
    customer: "John Doe",
    order: "ORD-003",
    description: "Received damaged tomatoes",
    status: "open",
    priority: "high",
  },
  {
    id: "ISS-002",
    type: "Delivery Delay",
    customer: "Jane Smith",
    order: "ORD-004",
    description: "Order delivered 2 days late",
    status: "resolved",
    priority: "medium",
  },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const handleApprove = (farmerId: string) => {
    // Handle farmer approval
    alert(`Farmer ${farmerId} approved!`)
  }

  const handleReject = (farmerId: string) => {
    // Handle farmer rejection
    alert(`Farmer ${farmerId} rejected!`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "open":
        return "bg-red-100 text-red-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your marketplace operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">+180 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">+23 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,67,890</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="farmers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="farmers">Farmer Applications</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="issues">Support Issues</TabsTrigger>
          <TabsTrigger value="content">Content Moderation</TabsTrigger>
          <TabsTrigger value="farmerdash">Farmer Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="farmers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pending Farmer Applications</span>
                <Badge variant="outline">{pendingFarmers.length} pending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingFarmers.map((farmer) => (
                  <div key={farmer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{farmer.name}</h3>
                        <p className="text-sm text-gray-600">{farmer.farmName}</p>
                        <p className="text-xs text-gray-500">
                          {farmer.location} • {farmer.farmSize} • {farmer.specialization}
                        </p>
                        <p className="text-xs text-gray-500">Applied: {farmer.appliedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(farmer.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(farmer.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Orders</span>
                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        {order.customer} → {order.farmer}
                      </p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.amount}</p>
                      <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Support Issues</span>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  {reportedIssues.filter((i) => i.status === "open").length} open
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(issue.priority)}`}></div>
                      <div>
                        <h3 className="font-medium">{issue.type}</h3>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                        <p className="text-xs text-gray-500">
                          Customer: {issue.customer} • Order: {issue.order}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Flagged Products</h3>
                  <p className="text-2xl font-bold mb-2">3</p>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Pending Reviews</h3>
                  <p className="text-2xl font-bold mb-2">12</p>
                  <Button variant="outline" size="sm">
                    Moderate
                  </Button>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">User Reports</h3>
                  <p className="text-2xl font-bold mb-2">5</p>
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farmer Dashboard Tab */}
        <TabsContent value="farmerdash" className="mt-6">
          <FarmerDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
