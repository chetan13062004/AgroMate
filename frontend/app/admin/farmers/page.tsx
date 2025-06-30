"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  MapPin,
  TrendingUp,
  Award,
  Leaf,
  Download,
  Package,
  IndianRupee,
  Trash,
} from "lucide-react"

// Real farmers will be fetched from backend
// Data will be loaded from backend
const mockFarmers: any[] = [];/*
/*
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    farmName: "Green Valley Organic Farm",
    location: "Punjab, India",
    avatar: "/placeholder.svg?height=60&width=60",
    status: "active",
    verified: true,
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    farmSize: "25 acres",
    experience: "15+ years",
    specialization: "Organic Vegetables",
    certifications: ["Organic Certified", "Fair Trade", "Good Agricultural Practices"],
    stats: {
      totalProducts: 45,
      activeProducts: 38,
      totalSales: 125000,
      totalOrders: 234,
      rating: 4.8,
      reviews: 156,
      responseRate: 98,
    },
    performance: {
      salesGrowth: 15.2,
      customerSatisfaction: 96,
      onTimeDelivery: 94,
      qualityScore: 92,
    },
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    farmName: "Sunrise Organic Farm",
    location: "Maharashtra, India",
    avatar: "/placeholder.svg?height=60&width=60",
    status: "active",
    verified: true,
    joinDate: "2024-01-10",
    lastActive: "2024-01-19",
    farmSize: "18 acres",
    experience: "12 years",
    specialization: "Seasonal Fruits",
    certifications: ["Organic Certified", "Export Quality"],
    stats: {
      totalProducts: 32,
      activeProducts: 28,
      totalSales: 98000,
      totalOrders: 187,
      rating: 4.7,
      reviews: 123,
      responseRate: 95,
    },
    performance: {
      salesGrowth: 22.8,
      customerSatisfaction: 94,
      onTimeDelivery: 96,
      qualityScore: 89,
    },
  },
  {
    id: "3",
    name: "Suresh Patel",
    email: "suresh@example.com",
    phone: "+91 76543 21098",
    farmName: "Golden Harvest Farm",
    location: "Gujarat, India",
    avatar: "/placeholder.svg?height=60&width=60",
    status: "pending",
    verified: false,
    joinDate: "2024-01-18",
    lastActive: "2024-01-19",
    farmSize: "30 acres",
    experience: "20 years",
    specialization: "Grains & Pulses",
    certifications: ["Pending Verification"],
    stats: {
      totalProducts: 0,
      activeProducts: 0,
      totalSales: 0,
      totalOrders: 0,
      rating: 0,
      reviews: 0,
      responseRate: 0,
    },
    performance: {
      salesGrowth: 0,
      customerSatisfaction: 0,
      onTimeDelivery: 0,
      qualityScore: 0,
    },
  },
]*/

export default function AdminFarmersPage() {
  // Delete farmer
  const handleFarmerDelete = async (farmerId: string) => {
    // Optimistic UI update – remove farmer immediately
    setFarmers((prev) => prev.filter((farmer) => farmer.id !== farmerId))

    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
    const endpoint = `${backendBase}/api/farmers/${farmerId}`

    try {
      await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      })
    } catch (err) {
      console.error("Failed to delete farmer", err)
    }
  }
  // Fetch farmers and their products from backend on component mount
  useEffect(() => {
    const fetchFarmersAndProducts = async () => {
      try {
        // First, fetch all farmers
        const farmersRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/farmers`, {
          credentials: "include",
        });
        
        if (!farmersRes.ok) {
          throw new Error("Failed to load farmers");
        }
        
        const farmersData = await farmersRes.json();
        const rawFarmers = Array.isArray(farmersData?.data?.farmers) ? farmersData.data.farmers : [];
        
        // Then, fetch all products to get categories
        const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/products/all`, {
          credentials: "include",
        });
        
        let productsByFarmer: Record<string, any[]> = {};
        
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const products = Array.isArray(productsData?.data?.products) ? productsData.data.products : [];
          
          // Group products by farmer
          productsByFarmer = products.reduce((acc: Record<string, any[]>, product: any) => {
            const farmerId = product.farmer?._id || product.farmer;
            if (farmerId) {
              if (!acc[farmerId]) {
                acc[farmerId] = [];
              }
              acc[farmerId].push(product);
            }
            return acc;
          }, {});
        }
        
        // Process farmers data with product categories
        const safeFarmers = rawFarmers.map((f: any) => {
          const isApproved = Boolean(f.isApproved);
          let status = 'pending';
          if (isApproved) status = 'active';
          else if (typeof f.isApproved !== 'undefined' && f.isApproved === false && f.createdAt) status = 'pending';
          else status = 'inactive';
          
          // Get unique categories from farmer's products
          const farmerProducts = productsByFarmer[f._id] || [];
          const categories = [...new Set(farmerProducts
            .map((p: any) => p.category)
            .filter(Boolean)
          )];
          
          return {
            ...f,
            id: f._id,
            isApproved,
            status,
            categories,
            certifications: Array.isArray(f.certifications) ? f.certifications : [],
            location: typeof f.location === "object" && f.location !== null
              ? f.location.address ?? ""
              : (f.location ?? ""),
            stats: {
              totalProducts: farmerProducts.length,
              activeProducts: farmerProducts.filter((p: any) => p.status === 'active').length,
              // Calculate total sales by summing (price * totalSold) of each product
          totalSales: farmerProducts.reduce((sum: number, p: any) => sum + (p.price * (p.totalSold ?? 0)), 0),
              // Estimate total orders as the sum of totalSold across products (each sale counts as one order item here – update if you have a better metric)
          totalOrders: farmerProducts.reduce((sum: number, p: any) => sum + (p.totalSold ?? 0), 0),
              rating: 0,
              reviews: 0,
              responseRate: 0,
              ...(f.stats ?? {}),
            },
          };
        });
        
        setFarmers(safeFarmers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFarmersAndProducts();
  }, []);

  const [farmers, setFarmers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null)

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || farmer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleFarmerAction = async (
    farmerId: string,
    action: "approve" | "reject",  // existing actions
  ) => {
    // Optimistic UI update – reflect change immediately
    setFarmers((prev) =>
      prev.map((farmer) =>
        farmer.id === farmerId ? { ...farmer, isApproved: action === "approve" } : farmer,
      ),
    )

    // Hit the dedicated endpoints so the backend can trigger the appropriate
    // email (approve ➜ /approve, reject ➜ /reject)
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
    const endpoint =
      action === "approve"
        ? `${backendBase}/api/farmers/${farmerId}/approve`
        : `${backendBase}/api/farmers/${farmerId}/reject`

    try {
      await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        // You can pass an optional reason when rejecting
        body: action === "reject" ? JSON.stringify({ reason: "Rejected by admin" }) : undefined,
      })
    } catch (err) {
      console.error("Failed to update farmer status", err)
    }
  }

  const exportFarmers = () => {
    const csvContent = [
      ["Name", "Farm Name", "Location", "Status", "Total Sales", "Products", "Rating", "Join Date"],
      ...filteredFarmers.map((farmer) => [
        farmer.name,
        farmer.farmName,
        farmer.location,
        farmer.status,
        farmer.stats.totalSales,
        farmer.stats.totalProducts,
        farmer.stats.rating,
        farmer.joinDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "farmers-export.csv"
    a.click()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Users className="h-8 w-8 mr-3" />
              Farmer Management
            </h1>
            <p className="text-slate-600">Manage farmer profiles, verification, and performance</p>
          </div>
          <Button onClick={exportFarmers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Farmers
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Farmers</p>
                  <p className="text-3xl font-bold">{farmers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Farmers</p>
                  <p className="text-3xl font-bold text-green-600">
                    {farmers.filter((f) => f.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {farmers.filter((f) => f.status === "pending").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{farmers.reduce((sum, f) => sum + f.stats.totalSales, 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search farmers by name, farm, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Farmers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFarmers.map((farmer) => (
            <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header with name and status */}
                  <div className="flex items-center justify-between">
  <h3 className="text-lg font-semibold flex items-center gap-2">{farmer.name}
    {farmer.status === 'active' ? (
  <Badge className="bg-green-100 text-green-800 ml-2">Active</Badge>
) : farmer.status === 'pending' ? (
  <Badge className="bg-yellow-100 text-yellow-800 ml-2">Pending</Badge>
) : (
  <Badge className="bg-gray-200 text-gray-800 ml-2">Inactive</Badge>
)}
  </h3>
  <div className="flex items-center space-x-2">
    {farmer.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
    {getStatusBadge(farmer.status)}
  </div>
</div>
                  
                  {/* Email */}
                  <p className="text-sm text-gray-500">{farmer.email}</p>
                  
                  {/* Categories */}
                  <div className="pt-2 border-t">
                    {(farmer.categories && farmer.categories.length > 0) && (
                      <div className="flex flex-wrap gap-1">
                        {farmer.categories.map((category: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 mb-1">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      {farmer.stats.totalProducts}</p>
                    <p className="text-xs text-gray-600">Products</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 mb-1">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                      </div>
                      ₹{farmer.stats.totalSales.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Sales</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                      <p className="text-lg font-bold">{farmer.stats.rating}</p>
                    </div>
                    <p className="text-xs text-gray-600">{farmer.stats.reviews} reviews</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{farmer.stats.responseRate}%</p>
                    <p className="text-xs text-gray-600">Response Rate</p>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {farmer.certifications.map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Leaf className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedFarmer(farmer)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Farmer Profile - {selectedFarmer?.name}</DialogTitle>
                        </DialogHeader>
                        {selectedFarmer && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label className="text-sm font-medium">Basic Information</Label>
                                <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-lg">
                                  <p className="font-medium">{selectedFarmer.name}</p>
                                  <p className="text-sm">🏪 {selectedFarmer.farmName}</p>
                                  <p className="text-sm">📧 {selectedFarmer.email}</p>
                                  <p className="text-sm">📱 {selectedFarmer.phone}</p>
                                  <p className="text-sm">📍 {selectedFarmer.location}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Farm Details</Label>
                                <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm">Size: {selectedFarmer.farmSize}</p>
                                  <p className="text-sm">Experience: {selectedFarmer.experience}</p>
                                  <p className="text-sm">Specialization: {selectedFarmer.specialization}</p>
                                  <p className="text-sm">Joined: {selectedFarmer.joinDate}</p>
                                  <p className="text-sm">Last Active: {selectedFarmer.lastActive}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">Performance Metrics</Label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                <div className="text-center p-3 border rounded-lg">
                                  <p className="text-lg font-bold">
                                    {selectedFarmer.performance?.salesGrowth ?? 0}%
                                  </p>
                                  <p className="text-xs text-gray-600">Sales Growth</p>
                                  <Progress 
                                    value={selectedFarmer.performance?.salesGrowth ?? 0} 
                                    className="mt-1"
                                  />
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                  <p className="text-lg font-bold">
                                    {selectedFarmer.performance?.customerSatisfaction ?? 0}%
                                  </p>
                                  <p className="text-xs text-gray-600">Satisfaction</p>
                                  <Progress 
                                    value={selectedFarmer.performance?.customerSatisfaction ?? 0} 
                                    className="mt-1"
                                  />
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                  <p className="text-lg font-bold">
                                    {selectedFarmer.performance?.orderFulfillment ?? 0}%
                                  </p>
                                  <p className="text-xs text-gray-600">Order Fulfillment</p>
                                  <Progress 
                                    value={selectedFarmer.performance?.orderFulfillment ?? 0} 
                                    className="mt-1"
                                  />
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                  <p className="text-lg font-bold">
                                    {selectedFarmer.performance?.inventoryTurnover ?? 0}x
                                  </p>
                                  <p className="text-xs text-gray-600">Inventory Turnover</p>
                                  <Progress 
                                    value={(selectedFarmer.performance?.inventoryTurnover ?? 0) * 10} 
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <Label className="text-sm font-medium">Certifications & Awards</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {(selectedFarmer.certifications || []).map((cert: string, index: number) => (
                                    <Badge key={index} className="bg-green-100 text-green-800">
                                      <Award className="h-3 w-3 mr-1" />
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex space-x-2">
                    {/* Delete button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleFarmerDelete(farmer.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>

                    {/* Approve / Reject toggle */}
                    {!farmer.isApproved ? (
                      <Button
                        size="sm"
                        onClick={() => handleFarmerAction(farmer.id, "approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleFarmerAction(farmer.id, "reject")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
