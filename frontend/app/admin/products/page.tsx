"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Package,
  Search,
  CheckCircle,

  Star,
  MapPin,
  Download,
  AlertTriangle,
  TrendingUp,
  Plus
} from "lucide-react"
import Image from "next/image"

// TODO: Remove mock data once backend integration is confirmed
// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Organic Tomatoes",
    farmer: "Rajesh Kumar",
    farmerId: "1",
    category: "Vegetables",
    price: 45,
    unit: "kg",
    stock: 150,
    status: "active",
    rating: 4.8,
    reviews: 23,
    image: "/placeholder.svg?height=80&width=80",
    description: "Fresh organic tomatoes grown without pesticides",
    location: "Punjab, India",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    totalSold: 450,
    revenue: 20250,
    featured: true,
    certifications: ["Organic", "Pesticide-Free"],
  },
  {
    id: "2",
    name: "Fresh Spinach",
    farmer: "Priya Sharma",
    farmerId: "2",
    category: "Leafy Greens",
    price: 25,
    unit: "bunch",
    stock: 80,
    status: "active",
    rating: 4.6,
    reviews: 15,
    image: "/placeholder.svg?height=80&width=80",
    description: "Nutrient-rich fresh spinach leaves",
    location: "Maharashtra, India",
    createdAt: "2024-01-12",
    lastUpdated: "2024-01-19",
    totalSold: 320,
    revenue: 8000,
    featured: false,
    certifications: ["Fresh", "Local"],
  },
  {
    id: "3",
    name: "Basmati Rice",
    farmer: "Suresh Patel",
    farmerId: "3",
    category: "Grains",
    price: 120,
    unit: "kg",
    stock: 0,
    status: "pending",
    rating: 0,
    reviews: 0,
    image: "/placeholder.svg?height=80&width=80",
    description: "Premium quality basmati rice",
    location: "Gujarat, India",
    createdAt: "2024-01-18",
    lastUpdated: "2024-01-18",
    totalSold: 0,
    revenue: 0,
    featured: false,
    certifications: ["Premium", "Export Quality"],
  },
  {
    id: "4",
    name: "Mixed Vegetables",
    farmer: "Amit Singh",
    farmerId: "4",
    category: "Vegetables",
    price: 35,
    unit: "kg",
    stock: 25,
    status: "rejected",
    rating: 3.2,
    reviews: 8,
    image: "/placeholder.svg?height=80&width=80",
    description: "Seasonal mixed vegetables",
    location: "Delhi, India",
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-16",
    totalSold: 120,
    revenue: 4200,
    featured: false,
    certifications: [],
    rejectionReason: "Quality standards not met",
  },
]

export default function AdminProductsPage() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Load products from backend (admin endpoint)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/api/products/all`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const { data } = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback to mock data if API fails
        setProducts(mockProducts);
      }
    };
    fetchProducts();
  }, []);

  // Fetch detailed product information
  const fetchProductDetails = async (productId: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/products/admin/${productId}`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch product details');
      const { data } = await res.json();
      return data.product;
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Return the existing product from the list if API fails
      return products.find(p => (p._id ?? p.id) === productId);
    }
  };

  // Handle product approval
  const handleApproveProduct = async (productId: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/products/${productId}/approve`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to approve product');
      
      // Update the product status in the local state
      setProducts(prev => prev.map(p => 
        (p._id ?? p.id) === productId ? { ...p, status: 'active' } : p
      ));
      
      // Show success message
      alert('Product approved successfully!');
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to approve product. Please try again.');
    }
  };

  // Handle product rejection
  const handleRejectProduct = async (productId: string) => {
    const reason = prompt('Please enter the reason for rejection:');
    if (!reason) return;

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/products/${productId}/reject`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) throw new Error('Failed to reject product');
      
      // Update the product status in the local state
      setProducts(prev => prev.map(p => 
        (p._id ?? p.id) === productId 
          ? { ...p, status: 'rejected', rejectionReason: reason } 
          : p
      ));
      
      // Show success message
      alert('Product rejected successfully!');
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('Failed to reject product. Please try again.');
    }
  };



  // Handle view product details
  const handleViewProduct = async (product: any) => {
    try {
      // Fetch detailed product information
      const productDetails = await fetchProductDetails(product._id ?? product.id);
      setSelectedProduct(productDetails || product);
    } catch (error) {
      console.error('Error viewing product:', error);
      // Use the basic product info if detailed fetch fails
      setSelectedProduct(product);
    }
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.farmer?.name || product.farmer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "out_of_stock":
        return <Badge className="bg-gray-100 text-gray-800">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Toggle product status (active/inactive)
  const handleToggleStatus = async (productId: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/products/${productId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to update product status');
      
      const { data } = await res.json();
      
      // Update the product status in the local state
      setProducts(prev => prev.map(p => 
        (p._id ?? p.id) === productId ? { ...p, status: data.product.status } : p
      ));
      
    } catch (error) {
      console.error('Error toggling product status:', error);
      alert('Failed to update product status. Please try again.');
    }
  };

  const exportProducts = () => {
    const csvContent = [
      ["Name", "Farmer", "Category", "Price", "Stock", "Status", "Rating", "Total Sold", "Revenue", "Created Date"],
      ...filteredProducts.map((product) => [
        product.name,
        (product.farmer?.name ?? product.farmer),
        product.category,
        product.price,
        product.stock,
        product.status,
        product.rating,
        product.totalSold,
        product.revenue,
        product.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 mx-28">
      <div className="container mx-auto py-8">
        {/* Product Details Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            {selectedProduct && (<>
                  <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                  </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={selectedProduct.imageUrl ?? selectedProduct.image ?? "/placeholder.svg"}
                      alt={selectedProduct.name}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                      <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {selectedProduct.category}
                        </Badge>
                        {getStatusBadge(selectedProduct.status)}
                        {selectedProduct.featured && (
                          <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Pricing & Stock</Label>
                      <div className="space-y-2 mt-2">
                        <p className="text-sm">
                          Price: ₹{selectedProduct.price} per {selectedProduct.unit}
                        </p>
                        <p className="text-sm">
                          Stock: {selectedProduct.stock} {selectedProduct.unit}
                        </p>
                        <p className="text-sm">
                          Type: <span className={selectedProduct.isOrganic ? 'text-green-600' : 'text-yellow-600'}>
                            {selectedProduct.isOrganic ? 'Organic' : 'Non-Organic'}
                          </span>
                        </p>
                        <p className="text-sm">Total Sold: {selectedProduct.totalSold || 0}</p>
                        <p className="text-sm">
                          Revenue: ₹{(selectedProduct.revenue || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Farmer Details</Label>
                      <div className="space-y-2 mt-2">
                        <p className="text-sm">Farmer: {selectedProduct.farmer?.name || 'N/A'}</p>
                        <p className="text-sm">Email: {selectedProduct.farmer?.email || 'N/A'}</p>
                        <p className="text-sm">Phone: {selectedProduct.farmer?.phone || 'N/A'}</p>
                        <p className="text-sm">
                          Location: {selectedProduct.farmer?.location || selectedProduct.location || 'N/A'}
                        </p>
                        <p className="text-sm">
                          Created: {new Date(selectedProduct.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Updated: {new Date(selectedProduct.updatedAt || selectedProduct.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedProduct.rating > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Customer Feedback</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviews?.length || 0} reviews)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Package className="h-8 w-8 mr-3" />
              Product Management
            </h1>
            <p className="text-slate-600">Manage product listings, approvals, and quality control</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={exportProducts} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-3xl font-bold text-green-600">
                    {products.filter((p) => p.status === "active").length}
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
                  <p className="text-sm font-medium text-gray-600">Rejected Products</p>
                  <p className="text-3xl font-bold text-red-600">
                    {products.filter((p) => p.status === "rejected").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Products</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {products.filter((p) => p.status === "inactive").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-600" />
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
                    placeholder="Search products by name, farmer, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Leafy Greens">Leafy Greens</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id ?? product.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                    <Image
                      src={product.imageUrl ?? product.image ?? "/placeholder.svg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 128px"
                      className="object-cover rounded-md"
                      unoptimized
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold flex items-center space-x-2">
                          <span>{product.name}</span>
                          {product.featured && (
                            <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
<p className="text-sm text-gray-500">Farmer: {(product.farmer?.name ?? product.farmer) || 'N/A'}</p>
                        {product.certifications?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.certifications.map((cert: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(product.status)}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Price</p>
                        <p className="font-medium">₹{product.price}/{product.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Stock</p>
                        <p className="font-medium">{product.stock}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Sold</p>
                        <p className="font-medium">{product.totalSold}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Revenue</p>
                        <p className="font-medium">₹{product.revenue?.toLocaleString() || '0'}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {product.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveProduct(product._id ?? product.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRejectProduct(product._id ?? product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleToggleStatus(product._id ?? product.id)}
                          className={product.status === "active" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                        >
                          {product.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
