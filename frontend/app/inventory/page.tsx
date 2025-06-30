"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
} from "lucide-react"

// Mock inventory data
const mockInventory = [
  {
    id: "INV-001",
    name: "Organic Tomatoes",
    category: "Vegetables",
    currentStock: 45,
    unit: "kg",
    pricePerUnit: 60,
    lowStockThreshold: 10,
    expiryDate: "2024-01-20",
    harvestDate: "2024-01-10",
    status: "in_stock",
    description: "Fresh organic tomatoes from our greenhouse",
    image: "/placeholder.svg?height=100&width=100",
    totalValue: 2700,
    lastUpdated: "2024-01-15",
  },
  {
    id: "INV-002",
    name: "Fresh Spinach",
    category: "Leafy Greens",
    currentStock: 8,
    unit: "kg",
    pricePerUnit: 80,
    lowStockThreshold: 15,
    expiryDate: "2024-01-18",
    harvestDate: "2024-01-12",
    status: "low_stock",
    description: "Nutrient-rich fresh spinach leaves",
    image: "/placeholder.svg?height=100&width=100",
    totalValue: 640,
    lastUpdated: "2024-01-14",
  },
  {
    id: "INV-003",
    name: "Organic Carrots",
    category: "Root Vegetables",
    currentStock: 0,
    unit: "kg",
    pricePerUnit: 50,
    lowStockThreshold: 20,
    expiryDate: "2024-01-25",
    harvestDate: "2024-01-08",
    status: "out_of_stock",
    description: "Sweet and crunchy organic carrots",
    image: "/placeholder.svg?height=100&width=100",
    totalValue: 0,
    lastUpdated: "2024-01-13",
  },
  {
    id: "INV-004",
    name: "Basmati Rice",
    category: "Grains",
    currentStock: 150,
    unit: "kg",
    pricePerUnit: 80,
    lowStockThreshold: 50,
    expiryDate: "2024-06-15",
    harvestDate: "2023-11-20",
    status: "in_stock",
    description: "Premium quality basmati rice",
    image: "/placeholder.svg?height=100&width=100",
    totalValue: 12000,
    lastUpdated: "2024-01-10",
  },
]

export default function InventoryPage() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState(mockInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: 0,
    unit: "kg",
    pricePerUnit: 0,
    lowStockThreshold: 10,
    expiryDate: "",
    harvestDate: "",
    description: "",
    isOrganic: false,
    image: "/placeholder.svg?height=100&width=100",
  })

  if (user?.role !== "farmer") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">Access denied. Farmer account required.</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Package className="h-4 w-4" />
      case "low_stock":
        return <AlertTriangle className="h-4 w-4" />
      case "out_of_stock":
        return <Trash2 className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const inventoryStats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
    lowStockItems: inventory.filter((item) => item.status === "low_stock").length,
    outOfStockItems: inventory.filter((item) => item.status === "out_of_stock").length,
  }

  const categories = [...new Set(inventory.map((item) => item.category))]

  const handleAddItem = () => {
    const id = `INV-${String(inventory.length + 1).padStart(3, "0")}`
    const status =
      newItem.currentStock === 0
        ? "out_of_stock"
        : newItem.currentStock <= newItem.lowStockThreshold
          ? "low_stock"
          : "in_stock"

    const item = {
      ...newItem,
      id,
      status,
      totalValue: newItem.currentStock * newItem.pricePerUnit,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    setInventory([...inventory, item])
    setNewItem({
      name: "",
      category: "",
      currentStock: 0,
      unit: "kg",
      pricePerUnit: 0,
      lowStockThreshold: 10,
      expiryDate: "",
      harvestDate: "",
      description: "",
      image: "/placeholder.svg?height=100&width=100",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const handleUpdateStock = (id: string, newStock: number) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          const status = newStock === 0 ? "out_of_stock" : newStock <= item.lowStockThreshold ? "low_stock" : "in_stock"
          return {
            ...item,
            currentStock: newStock,
            status,
            totalValue: newStock * item.pricePerUnit,
            lastUpdated: new Date().toISOString().split("T")[0],
          }
        }
        return item
      }),
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600">Track and manage your farm produce inventory</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Organic Tomatoes"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Grains">Grains</SelectItem>
                      <SelectItem value="Leafy Greens">Leafy Greens</SelectItem>
                      <SelectItem value="Root Vegetables">Root Vegetables</SelectItem>
                      <SelectItem value="Herbs">Herbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="organic">Product Type</Label>
                  <Select
                    value={newItem.isOrganic ? "organic" : "non-organic"}
                    onValueChange={(value) => setNewItem({ ...newItem, isOrganic: value === "organic" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="non-organic">Non-Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="bunch">Bunch</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price per Unit (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newItem.pricePerUnit}
                    onChange={(e) => setNewItem({ ...newItem, pricePerUnit: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={newItem.lowStockThreshold}
                    onChange={(e) => setNewItem({ ...newItem, lowStockThreshold: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="harvest">Harvest Date</Label>
                  <Input
                    id="harvest"
                    type="date"
                    value={newItem.harvestDate}
                    onChange={(e) => setNewItem({ ...newItem, harvestDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Describe your product..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{inventoryStats.totalItems}</p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">₹{inventoryStats.totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{inventoryStats.outOfStockItems}</p>
              </div>
              <TrendingDown className="h-12 w-12 text-red-600" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(item.status)}
                    {item.status.replace("_", " ")}
                  </div>
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className="font-medium">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per {item.unit}:</span>
                  <span className="font-medium">₹{item.pricePerUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-bold text-green-600">₹{item.totalValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.expiryDate}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <Label htmlFor={`stock-${item.id}`} className="text-sm">
                    Update Stock:
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`stock-${item.id}`}
                      type="number"
                      value={item.currentStock}
                      onChange={(e) => handleUpdateStock(item.id, Number(e.target.value))}
                      className="w-20 h-8"
                      min="0"
                    />
                    <span className="text-sm text-gray-600">{item.unit}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {item.status === "low_stock" && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Stock is running low!</span>
                  </div>
                </div>
              )}

              {item.status === "out_of_stock" && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-800">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Out of stock - restock needed!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first product to inventory"}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
