"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  UserCheck,
  UserX,
  PackageCheck,
  PackageX,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    totalUsers: 2543,
    totalFarmers: 456,
    totalBuyers: 2087,
    totalRevenue: 1234567,
    totalOrders: 3456,
    activeProducts: 1234,
    pendingApprovals: 23,
    systemAlerts: 5,
  }

  const recentActivity = [
    {
      id: 1,
      type: "user",
      action: "New farmer registration",
      user: "Suresh Patel",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "product",
      action: "Product listing approved",
      user: "Rajesh Kumar",
      time: "4 hours ago",
      status: "approved",
    },
    {
      id: 3,
      type: "order",
      action: "High-value order completed",
      user: "Amit Sharma",
      time: "6 hours ago",
      status: "completed",
    },
    {
      id: 4,
      type: "alert",
      action: "System maintenance required",
      user: "System",
      time: "8 hours ago",
      status: "warning",
    },
    {
      id: 5,
      type: "user",
      action: "Buyer account suspended",
      user: "Priya Singh",
      time: "1 day ago",
      status: "suspended",
    },
  ]

  const pendingApprovals = [
    {
      id: 1,
      type: "farmer",
      name: "Mohan Reddy",
      item: "Farm Verification",
      submitted: "2024-01-15",
      priority: "high",
    },
    {
      id: 2,
      type: "product",
      name: "Organic Tomatoes",
      item: "Product Listing",
      submitted: "2024-01-14",
      priority: "medium",
    },
    {
      id: 3,
      type: "farmer",
      name: "Lakshmi Devi",
      item: "Certification Upload",
      submitted: "2024-01-13",
      priority: "low",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Monitor and manage the entire marketplace ecosystem</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="products">Product Control</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+180 new this month</p>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <Package className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeProducts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+23 new this week</p>
                  <Progress value={60} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                  <Progress value={30} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Platform Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.status === "completed"
                              ? "bg-green-500"
                              : activity.status === "pending"
                                ? "bg-yellow-500"
                                : activity.status === "warning"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "default"
                              : activity.status === "pending"
                                ? "secondary"
                                : activity.status === "warning"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Pending Approvals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{approval.name}</p>
                        <p className="text-sm text-gray-600">{approval.item}</p>
                        <p className="text-xs text-gray-500">Submitted: {approval.submitted}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            approval.priority === "high"
                              ? "destructive"
                              : approval.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {approval.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span>Active Farmers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.totalFarmers}</div>
                  <p className="text-sm text-gray-600">+23 new this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Active Buyers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalBuyers}</div>
                  <p className="text-sm text-gray-600">+157 new this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserX className="h-5 w-5 text-red-600" />
                    <span>Suspended Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">12</div>
                  <p className="text-sm text-gray-600">-3 from last week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PackageCheck className="h-5 w-5 text-green-600" />
                    <span>Approved</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">1,234</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-yellow-600" />
                    <span>Pending</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PackageX className="h-5 w-5 text-red-600" />
                    <span>Rejected</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">45</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Top Selling</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">156</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Server Performance</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Database Health</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>API Response Time</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="mt-1" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">High server load detected</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Database backup pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
