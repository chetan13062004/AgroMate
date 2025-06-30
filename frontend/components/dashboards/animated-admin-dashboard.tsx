"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnimatedCounter from "@/components/ui/animated-counter"
import AnimatedCard from "@/components/ui/animated-card"
import ProgressBar from "@/components/ui/progress-bar"
import { staggerContainer, staggerItem } from "@/lib/animations"
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  UserCheck,
  UserX,
  PackageCheck,
  PackageX,
} from "lucide-react"

export default function AnimatedAdminDashboard() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Monitor and manage the entire marketplace ecosystem</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                User Management
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Product Control
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                System Health
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="overview" className="space-y-6">
            {/* Animated Key Metrics */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={staggerItem}>
                <AnimatedCard
                  delay={0.1}
                  className="border-l-4 border-l-blue-500 hover:border-l-blue-600 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <Users className="h-4 w-4 text-blue-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter to={stats.totalUsers} />
                    </div>
                    <p className="text-xs text-muted-foreground">+180 new this month</p>
                    <ProgressBar value={75} className="mt-2" color="bg-blue-500" />
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  delay={0.2}
                  className="border-l-4 border-l-green-500 hover:border-l-green-600 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                      <DollarSign className="h-4 w-4 text-green-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹<AnimatedCounter to={Math.floor(stats.totalRevenue / 100000)} suffix="L" />
                    </div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                    <ProgressBar value={85} className="mt-2" color="bg-green-500" />
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  delay={0.3}
                  className="border-l-4 border-l-orange-500 hover:border-l-orange-600 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Package className="h-4 w-4 text-orange-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter to={stats.activeProducts} />
                    </div>
                    <p className="text-xs text-muted-foreground">+23 new this week</p>
                    <ProgressBar value={60} className="mt-2" color="bg-orange-500" />
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  delay={0.4}
                  className="border-l-4 border-l-red-500 hover:border-l-red-600 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter to={stats.pendingApprovals} />
                    </div>
                    <p className="text-xs text-muted-foreground">Requires attention</p>
                    <ProgressBar value={30} className="mt-2" color="bg-red-500" />
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            </motion.div>

            {/* Animated Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Activity className="h-5 w-5" />
                    </motion.div>
                    <span>Recent Platform Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        variants={staggerItem}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors duration-200"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className={`w-3 h-3 rounded-full ${
                              activity.status === "completed"
                                ? "bg-green-500"
                                : activity.status === "pending"
                                  ? "bg-yellow-500"
                                  : activity.status === "warning"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                            }`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
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
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      <span>Active Farmers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      <AnimatedCounter to={stats.totalFarmers} />
                    </div>
                    <p className="text-sm text-gray-600">+23 new this week</p>
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Active Buyers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      <AnimatedCounter to={stats.totalBuyers} />
                    </div>
                    <p className="text-sm text-gray-600">+157 new this week</p>
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserX className="h-5 w-5 text-red-600" />
                      <span>Suspended Users</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      <AnimatedCounter to={12} />
                    </div>
                    <p className="text-sm text-gray-600">-3 from last week</p>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PackageCheck className="h-5 w-5 text-green-600" />
                      <span>Approved</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      <AnimatedCounter to={1234} />
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-yellow-600" />
                      <span>Pending</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      <AnimatedCounter to={23} />
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PackageX className="h-5 w-5 text-red-600" />
                      <span>Rejected</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      <AnimatedCounter to={45} />
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Top Selling</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      <AnimatedCounter to={156} />
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Server Performance</span>
                        <span>98%</span>
                      </div>
                      <ProgressBar value={98} color="bg-green-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Database Health</span>
                        <span>95%</span>
                      </div>
                      <ProgressBar value={95} color="bg-blue-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>API Response Time</span>
                        <span>92%</span>
                      </div>
                      <ProgressBar value={92} color="bg-yellow-500" />
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <motion.div className="flex items-center space-x-2 p-2 bg-red-50 rounded" whileHover={{ x: 5 }}>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">High server load detected</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center space-x-2 p-2 bg-yellow-50 rounded"
                        whileHover={{ x: 5 }}
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Database backup pending</span>
                      </motion.div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
