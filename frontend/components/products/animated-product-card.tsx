"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AnimatedButton from "@/components/ui/animated-button"
import { Star, MapPin, ShoppingCart, Eye, Share2, Heart, Leaf } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  images: string[]
  imageUrl?: string
  farmerId: string
  farmerName: string
  location: { lat: number; lng: number; address: string }
  isOrganic: boolean
  rating: number
  reviewCount: number
  inStock: boolean
  harvestDate: string
}

interface AnimatedProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onToggleWishlist?: (productId: string) => void
  isInWishlist?: boolean
  delay?: number
}

export default function AnimatedProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  delay = 0,
}: AnimatedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3, delay }}
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images?.[0] || product.imageUrl || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-300 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
            )}

            {/* Top-right action buttons */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
              {/* Wishlist Button */}
              {onToggleWishlist && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart 
                    className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                  />
                </button>
              )}

              {/* Organic Badge */}
              {product.isOrganic && (
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  <span>Organic</span>
                </div>
              )}
            </div>

            {/* Stock Status Badge */}
            <div className="absolute top-2 left-2 z-10">
              <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-xs">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </motion.button>
                  <Link href={`/products/${product.id}`} passHref>
                    <motion.a
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.a>
                  </Link>
                  <motion.button
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

            <motion.div className="text-2xl font-bold text-green-600 mb-2" whileHover={{ scale: 1.05 }}>
              ₹{product.price}/{product.unit}
            </motion.div>

            <div className="flex items-center mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: delay + 0.4 + i * 0.1 }}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">({product.reviewCount} reviews)</span>
            </div>

            <p className="text-sm text-gray-600 mb-1">By {product.farmerName}</p>
            <p className="text-sm text-gray-500 flex items-center mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              {product.location.address}
            </p>

            <AnimatedButton onClick={() => onAddToCart(product)} disabled={!product.inStock} className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </AnimatedButton>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
