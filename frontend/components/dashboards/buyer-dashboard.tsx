"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from '@/contexts/cart-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";

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
  _id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
  stock: number;
  status: string;
  description: string;
  imageUrl: string;
  lowStockThreshold: number;
  farmer: string;
  featured: boolean;
  totalSold: number;
  isOrganic?: boolean;
  revenue: number;
  views: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export default function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch products and apply filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initialize with all products
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters when category changes
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Only show in-stock products
    result = result.filter(product => product.stock > 0);
    
    setFilteredProducts(result);
  }, [selectedCategory, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }


  return (
    <div id="dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to FreshMarket</h1>
            <p className="text-gray-600">Discover fresh, local produce from trusted farmers</p>
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
        </div>
        
        {/* Results count */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredProducts.length} products
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      </div>

      {error ? (
        <div className="text-red-500 text-center p-4">
          Error loading products: {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found. Try adjusting your search or filters.</p>
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
                    onClick={async () => {
                      await addItem(product._id);
                      toast({
                        title: 'Added to Cart',
                        description: `${product.name} has been added to your cart`,
                      });
                    }}
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
  );
}