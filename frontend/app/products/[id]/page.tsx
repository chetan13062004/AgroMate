"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, ShoppingCart, MessageCircle, Phone, Leaf, Calendar, Truck } from "lucide-react"

// Mock product data
const mockProduct = {
  id: "1",
  name: "Organic Tomatoes",
  description:
    "Fresh, juicy organic tomatoes grown without pesticides in fertile soil. Perfect for cooking, salads, and making sauces. These tomatoes are vine-ripened and harvested at peak freshness.",
  price: 80,
  unit: "kg",
  category: "Vegetables",
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  farmerId: "farmer1",
  farmerName: "Rajesh Kumar",
  farmerAvatar: "/placeholder.svg?height=100&width=100",
  location: { lat: 18.5204, lng: 73.8567, address: "Pune, Maharashtra" },
  isOrganic: true,
  rating: 4.8,
  reviewCount: 24,
  inStock: true,
  harvestDate: "2024-01-15",
  nutritionalInfo: {
    calories: "18 per 100g",
    vitamin_c: "28mg",
    fiber: "1.2g",
    potassium: "237mg",
  },
  certifications: ["Organic Certified", "Pesticide Free", "Non-GMO"],
}

const mockReviews = [
  {
    id: "1",
    customerName: "Amit Sharma",
    rating: 5,
    comment: "Excellent quality tomatoes! Very fresh and organic. Will definitely order again.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    customerName: "Priya Patel",
    rating: 4,
    comment: "Good quality produce, delivered on time. Tomatoes were fresh and tasty.",
    date: "2024-01-12",
    verified: true,
  },
  {
    id: "3",
    customerName: "Raj Kumar",
    rating: 5,
    comment: "Best organic tomatoes I've bought. Great taste and perfect for cooking.",
    date: "2024-01-10",
    verified: false,
  },
]

const relatedProducts = [
  {
    id: "2",
    name: "Fresh Spinach",
    price: 40,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    isOrganic: true,
  },
  {
    id: "3",
    name: "Organic Carrots",
    price: 60,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    isOrganic: true,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const product = mockProduct // In real app, fetch by params.id

  const handleAddToCart = async () => {
    await addItem(product.id, quantity)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={400}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded-lg overflow-hidden ${
                  selectedImage === index ? "border-green-600" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-2">
              {product.isOrganic && <Badge className="bg-green-600">Organic</Badge>}
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-4xl font-bold text-green-600 mb-2">
              ₹{product.price}/{product.unit}
            </p>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Farmer Info */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.farmerAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{product.farmerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{product.farmerName}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {product.location.address}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Section */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      +
                    </Button>
                    <span className="text-sm text-gray-600">{product.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">₹{(product.price * quantity).toFixed(2)}</span>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleAddToCart} className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Buy Now
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    Free delivery above ₹500
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Harvested: {product.harvestDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mb-8">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="farmer">About Farmer</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Product Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harvest Date:</span>
                      <span>{product.harvestDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span>{product.location.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Organic:</span>
                      <span>{product.isOrganic ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {product.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">
                        <Leaf className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Nutritional Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 capitalize">{key.replace("_", " ")}</p>
                    <p className="text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{review.customerName}</h4>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farmer">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={product.farmerAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{product.farmerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{product.farmerName}</h3>
                  <p className="text-gray-600 mb-4">
                    Experienced organic farmer with over 10 years in sustainable agriculture. Specializes in growing
                    pesticide-free vegetables using traditional and modern farming techniques.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Farm Size</p>
                      <p className="text-gray-600">5 acres</p>
                    </div>
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-gray-600">10+ years</p>
                    </div>
                    <div>
                      <p className="font-medium">Specialization</p>
                      <p className="text-gray-600">Organic Vegetables</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">More from this Farmer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={relatedProduct.image || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  width={200}
                  height={150}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                {relatedProduct.isOrganic && <Badge className="absolute top-2 left-2 bg-green-600">Organic</Badge>}
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${relatedProduct.id}`}>
                  <h3 className="font-semibold mb-2 hover:text-green-600 cursor-pointer">{relatedProduct.name}</h3>
                </Link>
                <p className="text-lg font-bold text-green-600 mb-2">
                  ₹{relatedProduct.price}/{relatedProduct.unit}
                </p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{relatedProduct.rating}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
