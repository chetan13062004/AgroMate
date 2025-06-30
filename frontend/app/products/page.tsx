"use client"

import { useState, useEffect } from "react"
import { useWishlist } from '@/contexts/WishlistContext'
import { useToast } from '@/components/ui/use-toast'
import { Heart, Leaf } from 'lucide-react'
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Filter, X } from "lucide-react"

// Define product categories
const PRODUCT_CATEGORIES = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains",
  "Leafy Greens",
  "Herbs",
  "Dairy",
  "Meat",
  "Poultry",
  "Seafood",
  "Eggs",
  "Other"
];

interface Product {
  isOrganic?: boolean;
  lowStockThreshold?: number;
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  imageUrl: string;
  stock: number;
  status: string;
  farmer: string;
  featured: boolean;
  totalSold: number;
  revenue: number;
  views: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [organicOnly, setOrganicOnly] = useState(false)
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data) // Initialize filtered products
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]
    
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      )
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(product => 
        product.category === selectedCategory
      )
    }
    
    result = result.filter(product => 
      product.price >= priceRange[0] && 
      product.price <= priceRange[1]
    )
    
    if (organicOnly) {
      // A product can be marked organic either via the explicit boolean `isOrganic`
      // field or (for legacy data) by having the string "organic" in the `status`
      // field. We therefore accept either indicator to keep backwards compatibility.
      result = result.filter(product => 
        product.isOrganic === true || product.status?.toLowerCase() === 'organic'
      )
    }
    
    result = result.filter(product => product.stock > 0)
    
    setFilteredProducts(result)
  }, [searchTerm, selectedCategory, priceRange, organicOnly, products])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setPriceRange([0, 1000])
    setOrganicOnly(false)
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))]
  
  const maxPrice = Math.max(...products.map(p => p.price), 1000)

  const handleAddToCart = async (product: Product) => {
    await addItem(product._id)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading products: {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Products</h1>
        <p className="text-gray-600">Discover fresh produce directly from local farmers</p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="w-full md:flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
        
        <div className="w-full md:w-64">
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'More Filters'}
        </Button>
        
        {(selectedCategory !== 'All' || searchTerm || organicOnly || priceRange[0] > 0 || priceRange[1] < 1000) && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (₹{priceRange[0]} - ₹{priceRange[1]})
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹{maxPrice}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="organic-filter"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="organic-filter" className="text-sm text-gray-700">
                Organic Products Only
              </label>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-500 mb-4">
        Showing {filteredProducts.length} products
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found. Try adjusting your search or filters.</p>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="mt-4"
          >
            <X className="h-4 w-4 mr-2" />
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
           <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
           <div className="relative h-48 bg-gray-100">
             <img
               src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
               alt={product.name}
               className="w-full h-full object-cover"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
               }}
             />
             <div className="absolute top-2 right-2 flex flex-col gap-2">
               <button
                 onClick={async (e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   if (isInWishlist(product._id)) {
                     await removeFromWishlist(product._id);
                     toast({
                       title: "Removed from wishlist",
                       description: `${product.name} has been removed from your wishlist`,
                     });
                   } else {
                     await addToWishlist(product._id);
                     toast({
                       title: "Added to wishlist",
                       description: `${product.name} has been added to your wishlist`,
                     });
                   }
                 }}
                 className={`p-2 rounded-full shadow-md ring-1 ring-black/10 transition-colors
                   ${isInWishlist(product._id) 
                     ? 'bg-red-600 hover:bg-red-700' 
                     : 'bg-white/80 backdrop-blur hover:bg-gray-100'
                   }`}
               >
                 <Heart 
                   className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-white text-white' : 'text-gray-500'}`} 
                 />
               </button>
               {product.isOrganic && (
                 <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                   <Leaf className="h-3 w-3" />
                   <span>Organic</span>
                 </div>
               )}
             </div>
             <span className={`absolute top-2 left-2 text-xs font-medium px-2.5 py-1 rounded-full ${
               product.stock > (product.lowStockThreshold || 5) 
                 ? 'bg-green-100 text-green-800' 
                 : 'bg-amber-100 text-amber-800'
             }`}>
               {product.stock > (product.lowStockThreshold || 5) ? 'In Stock' : 'Low Stock'}
             </span>
           </div>
           <CardContent className="p-4 flex flex-col flex-grow">
             <div className="mb-2">
               <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
               <div className="flex items-center mt-1">
                 <span className="text-lg font-bold text-green-700">₹{product.price}</span>
                 <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
               </div>
             </div>
             
             <div className="mb-4">
               <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">
                 {product.category}
               </span>
             </div>
             
             <p className="text-sm text-gray-600 mb-4 line-clamp-2">
               {product.description || 'Fresh and organic product directly from farm'}
             </p>
             
             <div className="mt-auto">
               <Button 
                 className="w-full bg-green-600 hover:bg-green-700 text-white"
                 disabled={product.stock === 0}
                 onClick={() => handleAddToCart(product)}
               >
                 <ShoppingCart className="h-4 w-4 mr-2" />
                 Add to Cart
               </Button>
             </div>
           </CardContent>
         </Card>
          ))}
        </div>
      )}
    </div>
  )
}
