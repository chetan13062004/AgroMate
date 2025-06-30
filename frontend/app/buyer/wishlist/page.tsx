"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, MapPin, Search, Trash2, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Mock wishlist data
const mockWishlistItems = [
  {
    id: "1",
    productId: "1",
    name: "Organic Tomatoes",
    price: 80,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    farmer: "Rajesh Kumar",
    location: "Pune, Maharashtra",
    rating: 4.8,
    isOrganic: true,
    inStock: true,
    addedDate: "2024-01-10",
  },
  {
    id: "2",
    productId: "2",
    name: "Fresh Mangoes",
    price: 120,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    farmer: "Priya Sharma",
    location: "Nashik, Maharashtra",
    rating: 4.9,
    isOrganic: false,
    inStock: true,
    addedDate: "2024-01-08",
  },
  {
    id: "3",
    productId: "3",
    name: "Basmati Rice",
    price: 150,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    farmer: "Suresh Patel",
    location: "Ahmedabad, Gujarat",
    rating: 4.7,
    isOrganic: true,
    inStock: false,
    addedDate: "2024-01-05",
  },
]

export default function WishlistPage() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== itemId))
  }

  const addToCart = (item: any) => {
    // Cart context only requires productId and optional quantity.
    // Backend will derive the rest of the information.
    addItem(item.productId, 1)
  }

  const filteredItems = wishlistItems
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "organic" && item.isOrganic) ||
        (filterBy === "instock" && item.inStock) ||
        (filterBy === "outofstock" && !item.inStock)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        case "recent":
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      }
    })

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your wishlist</h2>
        <p className="text-gray-600 mb-8">Save your favorite products for later</p>
        <Link href="/auth/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">Your saved products ({filteredItems.length} items)</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="organic">Organic Only</SelectItem>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {item.isOrganic && <Badge className="absolute top-2 left-2 bg-green-600">Organic</Badge>}
                    {!item.inStock && <Badge className="absolute top-2 right-2 bg-red-600">Out of Stock</Badge>}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => removeFromWishlist(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">{item.name}</h3>
                    </Link>

                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ₹{item.price}/{item.unit}
                    </p>

                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">By {item.farmer}</p>
                    <p className="text-sm text-gray-500 flex items-center mb-4">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </p>

                    <div className="flex space-x-2">
                      <Button onClick={() => addToCart(item)} disabled={!item.inStock} className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removeFromWishlist(item.id)}>
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Added on {new Date(item.addedDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterBy !== "all" ? "No items found" : "Your wishlist is empty"}
          </h3>
          <p className="text-gray-600 mb-8">
            {searchTerm || filterBy !== "all"
              ? "Try adjusting your search or filters"
              : "Start adding products to your wishlist"}
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
