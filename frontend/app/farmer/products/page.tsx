"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Package,
  Search,
  Plus,
  Edit,
  Eye,
  Trash,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Camera,
  Upload,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import productService from "@/lib/api/productService"
import Swal from "sweetalert2"

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  image?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  totalSold?: number;
  revenue?: number;
  views?: number;
  featured?: boolean;
  lowStockThreshold: number;
  farmer?: string;
  expiryDate?: string;
  totalValue?: number;
  isOrganic?: boolean;
}

interface NewProduct {
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  lowStockThreshold: number;
  description: string;
  status: string;
  expiryDate?: string;
  image?: File | null;
  isOrganic: boolean;
}

function FarmerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    category: "Vegetables",
    price: 0,
    unit: "kg",
    stock: 0,
    lowStockThreshold: 10,
    description: "",
    status: "draft",
    image: null,
    isOrganic: true
  });

  // Diagnosis description from localStorage
  const [diagnosisDesc, setDiagnosisDesc] = useState<string | null>(null);
  useEffect(() => {
    if (isAddDialogOpen) {
      const desc = localStorage.getItem('diagnosisDescription');
      setDiagnosisDesc(desc);
    }
  }, [isAddDialogOpen]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getFarmerProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Product statistics calculation
  const productStats = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        lowStock: 0,
        outOfStock: 0,
        totalRevenue: 0,
      };
    }

    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      inactive: products.filter((p) => p.status === "inactive").length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      totalRevenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
    };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" ? product.status === "active" : product.status !== "active");
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setNewProduct(prev => ({ ...prev, image: file }));
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId: string) => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to delete this product?');
      if (!confirmed) return;
    }
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Handle stock update
  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const updatedProduct = await productService.updateStock(productId, newStock);
      setProducts(prev =>
        prev.map(p => p._id === productId ? { ...p, stock: newStock } : p)
      );
      toast.success('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  // Toggle product featured status
  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      await productService.toggleFeatured(productId, !currentStatus);
      setProducts(prev =>
        prev.map(p => p._id === productId ? { ...p, featured: !currentStatus } : p)
      );
      toast.success(`Product ${!currentStatus ? 'marked as featured' : 'removed from featured'}`);
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  // Handle selecting a product for editing
const handleEditClick = (product: Product) => {
  setSelectedProduct(product);
  setIsEditing(true);
  setIsAddDialogOpen(true);
  // Prefill form fields with existing product data
  setNewProduct({
    name: product.name,
    category: product.category,
    price: product.price,
    unit: product.unit,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    description: product.description,
    expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : '',
    status: product.status,
    image: null,
    isOrganic: product.isOrganic || false
  });
  setImagePreview(product.imageUrl || null);
  setSelectedImage(null);
};

// Handle updating an existing product
const handleUpdateProduct = async () => {
  if (!selectedProduct) return;
  if (!newProduct.name || !newProduct.category || newProduct.price <= 0 || newProduct.lowStockThreshold < 1) {
    toast.error('Please fill in all required fields (threshold must be at least 1)');
    return;
  }

  try {
    setIsSubmitting(true);
    const productData: any = { ...newProduct, status: 'inactive' };
    if (selectedImage) {
      productData.image = selectedImage;
    }
    const updated = await productService.updateProduct(selectedProduct._id, productData);
    setProducts(prev => prev.map(p => (p._id === updated._id ? updated : p)));
    toast.success('Product updated successfully!');
    // Reset state and close dialog
    setIsAddDialogOpen(false);
    setIsEditing(false);
    setSelectedProduct(null);
    setNewProduct({
      name: '',
      category: 'Vegetables',
      price: 0,
      unit: 'kg',
      stock: 0,
      lowStockThreshold: 10,
      description: '',
      expiryDate: '',
      status: 'draft',
      image: null,
      isOrganic: false, // Add this line
    });
    setSelectedImage(null);
    setImagePreview(null);
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product');
  } finally {
    setIsSubmitting(false);
  }
};

// Handle adding a new product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.description || newProduct.price <= 0 || newProduct.lowStockThreshold < 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all required fields: name, category, description, and price. The low stock threshold must be at least 1.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('price', newProduct.price.toString());
      formData.append('unit', newProduct.unit);
      formData.append('stock', newProduct.stock.toString());
      // always create product as inactive; admin will verify
      formData.append('status', 'inactive');
      if (newProduct.expiryDate) {
        formData.append('expiryDate', newProduct.expiryDate);
      }
      formData.append('lowStockThreshold', newProduct.lowStockThreshold.toString());
      formData.append('description', newProduct.description);
      formData.append('isOrganic', newProduct.isOrganic.toString());

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log('Creating product with form data...');
      
      const createdProduct = await productService.createProduct(formData);
      
      // Update the products list with the new product
      setProducts(prev => [...prev, createdProduct]);

      // Reset form
      setNewProduct({
        name: "",
        category: "Vegetables",
        price: 0,
        unit: "kg",
        stock: 0,
        lowStockThreshold: 10,
        description: "",
        expiryDate: "",
        status: "draft",
        image: null,
        isOrganic: true
      });
      setImagePreview(null);
      setSelectedImage(null);
      setIsAddDialogOpen(false);

      toast.success('Product added successfully!');
    } catch (error: any) {
      console.error('Error adding product:', error);
      let errorMessage = 'Failed to add product. Please try again.';
      
      if (error.response) {
        // Server responded with an error status code
        errorMessage = error.response.data?.message || errorMessage;
        
        // Handle validation errors
        if (error.response.status === 400 && error.response.data?.errors) {
          const validationErrors = error.response.data.errors
            .map((err: any) => err.msg || err.message || 'Invalid field')
            .join('\n');
          errorMessage = `Validation failed:\n${validationErrors}`;
        }
      } else if (error.request) {
        // Request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        // Something happened in setting up the request
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-green-800">Loading products...</p>
        </div>
      </div>
    );
  }

  // Returns a badge only when stock warrants attention
  const getStockBadge = (stock: number, threshold: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    }
    if (stock <= threshold) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    }
    return null;
  };

  // Always returns a badge representing the product status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-800">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900 flex items-center">
              <Package className="h-8 w-8 mr-3" />
              My Products
            </h1>
            <p className="text-green-700">Manage your product listings and inventory</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
              <DialogHeader className="px-6 pt-6 pb-4 border-b">
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Fill in the details for your new farm product.</DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto px-6 py-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g., Organic Tomatoes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Fruits">Fruits</SelectItem>
                        <SelectItem value="Grains">Grains</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Meat">Meat</SelectItem>
                        <SelectItem value="Poultry">Poultry</SelectItem>
                        <SelectItem value="Seafood">Seafood</SelectItem>
                        <SelectItem value="Herbs">Herbs</SelectItem>
                        <SelectItem value="Leafy Greens">Leafy Greens</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Unit (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      min={0}
                       onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newProduct.unit}
                      onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                    >
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
                    <Label htmlFor="stock">Current Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      min={0}
                       onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="isOrganic">Product Type</Label>
                    <Select
                      value={newProduct.isOrganic ? "organic" : "non-organic"}
                      onValueChange={(value) => setNewProduct({ ...newProduct, isOrganic: value === "organic" })}
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
                    <Label htmlFor="threshold">Low Stock Threshold</Label>
                    <Input
                       id="threshold"
                       type="number"
                       min={1}
                       value={newProduct.lowStockThreshold}
                       onChange={(e) => {
                         const val = Math.max(1, Number(e.target.value));
                         setNewProduct({ ...newProduct, lowStockThreshold: val });
                       }}
                     />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                {diagnosisDesc && (
                  <Button
                    type="button"
                    size="sm"
                    className="mb-2 bg-green-100 text-green-800"
                    onClick={() => {
                      setNewProduct(prev => ({ ...prev, description: diagnosisDesc }));
                      localStorage.removeItem('diagnosisDescription');
                      localStorage.removeItem('diagnosisDisease');
                      localStorage.removeItem('diagnosisConfidence');
                      localStorage.removeItem('diagnosisSeverity');
                      localStorage.removeItem('diagnosisTreatment');
                      localStorage.removeItem('diagnosisPrevention');
                      setDiagnosisDesc(null);
                    }}
                  >
                    Use AI Diagnosis as Description
                  </Button>
                )}
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  placeholder="Describe your product, its quality, and any special features..."
                  className="mb-2"
                />  </div>
                  <div className="col-span-2">
                    <Label>Product Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="mb-4">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="mx-auto max-h-48 object-contain rounded-lg"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-red-600 hover:text-red-700"
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                              setSelectedImage(null);
                              setImagePreview(null);
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600">Click to upload product image</p>
                        </>
                      )}
                      <input
                        type="file"
                        id="product-image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <Label
                        htmlFor="product-image"
                        className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedImage ? 'Change Image' : 'Upload Image'}
                      </Label>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, or WEBP (Max 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="px-6 py-4 border-t">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={isEditing ? handleUpdateProduct : handleAddProduct} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    isEditing ? 'Save Changes' : 'Add Product'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{productStats.total}</p>
                </div>
                <Package className="h-7 w-7 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{productStats.active}</p>
                </div>
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">{productStats.inactive}</p>
                </div>
                <Package className="h-7 w-7 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{productStats.lowStock}</p>
                </div>
                <AlertTriangle className="h-7 w-7 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{productStats.outOfStock}</p>
                </div>
                <Package className="h-7 w-7 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">₹{productStats.totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-7 w-7 text-purple-600" />
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
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Grains">Grains</SelectItem>
                    <SelectItem value="Leafy Greens">Leafy Greens</SelectItem>
                    <SelectItem value="Herbs">Herbs</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Poultry">Poultry</SelectItem>
                    <SelectItem value="Seafood">Seafood</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
                  <SelectTrigger className="w-full md:w-36">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isInactive = product.status !== 'active';
            return (
              <Card 
                key={product._id} 
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border ${isInactive ? 'border-gray-200 bg-gray-50' : 'border-gray-100 hover:border-green-100'} relative`}
              >
              {isInactive && (
                <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none" />
              )}
              <div className="relative h-56 bg-gray-50 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img
                  src={product.imageUrl || product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full w-9 h-9 bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm ${product.featured ? 'text-yellow-500' : 'text-gray-600'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFeatured(product._id, !!product.featured);
                    }}
                  >
                    <Star className={`h-4 w-4 ${product.featured ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                {product.featured && (
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Featured</span>
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-white">
                        {product.category}
                      </Badge>
                      <Badge 
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          product.isOrganic 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                      >
                        {product.isOrganic ? (
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                            Organic
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                            Non-Organic
                          </span>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-xl text-gray-900">₹{product.price}</p>
                    <p className="text-xs text-gray-500 font-medium">per {product.unit}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {getStatusBadge(product.status)}
                  {getStockBadge(product.stock, product.lowStockThreshold)}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 font-medium">Stock</p>
                      <p className="text-sm font-semibold text-gray-900">{product.stock} {product.unit}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 font-medium">Sold</p>
                      <p className="text-sm font-semibold text-gray-900">{product.totalSold || 0} {product.unit}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 font-medium">Threshold</p>
                      <p className="text-sm font-semibold text-gray-900">{product.lowStockThreshold}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Product Details</DialogTitle>
                        </DialogHeader>
                        {selectedProduct && (
                          <div className="space-y-4 py-4">
                            <div className="flex items-start space-x-4">
                              <div className="relative w-28 h-28 flex-shrink-0">
                                <Image
                                  src={selectedProduct.imageUrl || selectedProduct.image || "/placeholder.svg"}
                                  alt={selectedProduct.name}
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                                <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline">{selectedProduct.category}</Badge>
                                  {selectedProduct.featured && (
                                    <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-500">Pricing & Stock</Label>
                                <div className="space-y-2 mt-1 p-3 bg-gray-50 rounded-lg border">
                                  <p className="text-sm flex justify-between">
                                    <span>Price:</span>
                                    <b>₹{selectedProduct.price} / {selectedProduct.unit}</b>
                                  </p>
                                  <p className="text-sm flex justify-between">
                                    <span>Current Stock:</span>
                                    <b>{selectedProduct.stock} {selectedProduct.unit}</b>
                                  </p>
                                  <p className="text-sm flex justify-between">
                                    <span>Low Stock Alert:</span>
                                    <b>{selectedProduct.lowStockThreshold}</b>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-500">Performance</Label>
                                <div className="space-y-2 mt-1 p-3 bg-gray-50 rounded-lg border">
                                  <p className="text-sm flex justify-between"><span>Total Sold:</span> <b>{selectedProduct.totalSold || 0}</b></p>
                                  <p className="text-sm flex justify-between"><span>Revenue:</span> <b>₹{(selectedProduct.revenue || 0).toLocaleString()}</b></p>
                                  <p className="text-sm flex justify-between"><span>Views:</span> <b>{selectedProduct.views || 0}</b></p>
                                  <p className="text-sm flex justify-between">
                                    <span>Rating:</span> 
                                    <b>{selectedProduct.rating || 'N/A'} ({selectedProduct.reviews || 0} reviews)</b>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(product)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteProduct(product._id)}>
                      <Trash className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "You haven't added any products yet. Get started now!"}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default FarmerProductsPage;