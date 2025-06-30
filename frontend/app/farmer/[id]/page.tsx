"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  Leaf,
  MessageCircle,
  Heart,
  Share2,
  Package,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react"

// Mock farmer data
const mockFarmer = {
  id: "farmer-001",
  name: "Rajesh Kumar",
  farmName: "Green Valley Organic Farm",
  avatar: "/placeholder.svg?height=150&width=150",
  coverImage: "/placeholder.svg?height=300&width=800",
  location: "Pune, Maharashtra",
  joinedDate: "2022-03-15",
  verified: true,
  rating: 4.8,
  totalReviews: 156,
  totalOrders: 1234,
  responseRate: 98,
  bio: "Passionate organic farmer with over 15 years of experience. We specialize in growing premium quality vegetables and fruits using sustainable farming practices. Our farm is certified organic and we believe in providing the freshest produce directly to our customers.",
  specializations: ["Organic Vegetables", "Seasonal Fruits", "Herbs & Spices"],
  certifications: ["Organic Certified", "Fair Trade", "Good Agricultural Practices"],
  farmSize: "25 acres",
  experience: "15+ years",
  contact: {
    phone: "+91 98765 43210",
    email: "rajesh@greenvalley.com",
    website: "https://greenvalleyfarm.com",
  },
  stats: {
    totalProducts: 45,
    activeProducts: 38,
    totalSales: 2500000,
    repeatCustomers: 89,
  },
  products: [
    {
      id: "prod-001",
      name: "Organic Tomatoes",
      price: 60,
      unit: "kg",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      inStock: true,
      category: "Vegetables",
    },
    {
      id: "prod-002",
      name: "Fresh Spinach",
      price: 80,
      unit: "kg",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      inStock: true,
      category: "Leafy Greens",
    },
    {
      id: "prod-003",
      name: "Organic Carrots",
      price: 50,
      unit: "kg",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      inStock: false,
      category: "Root Vegetables",
    },
  ],
  recentReviews: [
    {
      id: "rev-001",
      customer: "Amit Sharma",
      rating: 5,
      comment: "Excellent quality tomatoes! Fresh and flavorful.",
      date: "2024-01-15",
      product: "Organic Tomatoes",
    },
    {
      id: "rev-002",
      customer: "Priya Patel",
      rating: 4,
      comment: "Good quality spinach, delivered on time.",
      date: "2024-01-14",
      product: "Fresh Spinach",
    },
  ],
}

export default function FarmerProfilePage() {
  const params = useParams()
  const [farmer] = useState(mockFarmer)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("products")

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cover Image and Profile Header */}
      <div className="relative mb-8">
        <div className="h-64 bg-gradient-to-r from-green-400 to-green-600 rounded-lg overflow-hidden">
          <img src={farmer.coverImage || "/placeholder.svg"} alt="Farm cover" className="w-full h-full object-cover" />
        </div>

        <div className="absolute -bottom-16 left-8">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={farmer.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">{farmer.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="outline" size="sm" className="bg-white/90">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            className={isFollowing ? "" : "bg-white/90"}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            <Heart className={`h-4 w-4 mr-1 ${isFollowing ? "fill-current" : ""}`} />
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 pt-16">
          <div className="flex items-center space-x-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{farmer.name}</h1>
            {farmer.verified && (
              <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          <h2 className="text-xl text-gray-600 mb-4">{farmer.farmName}</h2>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-1">
              {renderStars(farmer.rating)}
              <span className="font-medium">{farmer.rating}</span>
              <span className="text-gray-600">({farmer.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {farmer.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {farmer.joinedDate}
            </div>
          </div>

          <p className="text-gray-700 mb-6">{farmer.bio}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {farmer.specializations.map((spec, index) => (
              <Badge key={index} variant="outline" className="text-green-600 border-green-600">
                <Leaf className="h-3 w-3 mr-1" />
                {spec}
              </Badge>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Farmer
            </Button>
            <Button variant="outline" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              View Products
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Farm Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products</span>
                <span className="font-medium">{farmer.stats.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Products</span>
                <span className="font-medium">{farmer.stats.activeProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium">{farmer.totalOrders.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-medium">{farmer.responseRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Farm Size</span>
                <span className="font-medium">{farmer.farmSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{farmer.experience}</span>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {farmer.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-sm">{farmer.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-sm">{farmer.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <a href={farmer.contact.website} className="text-sm text-blue-600 hover:underline">
                  {farmer.contact.website}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="about">About Farm</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmer.products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                      <span className="text-gray-600">/{product.unit}</span>
                    </div>
                    <Button size="sm" disabled={!product.inStock}>
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {farmer.recentReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>{review.customer.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{review.customer}</span>
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-600">Product: {review.product}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="text-center">
              <Button variant="outline">View All Reviews</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Farm Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Green Valley Organic Farm was established in 2008 with a vision to provide fresh, healthy, and
                  sustainable produce to our community. We started with just 5 acres and have grown to 25 acres of
                  certified organic farmland.
                </p>
                <p className="text-gray-700">
                  Our farming practices focus on soil health, biodiversity, and environmental sustainability. We use
                  natural composting, crop rotation, and integrated pest management to ensure the highest quality
                  produce while protecting our ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farming Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Organic Certification</h4>
                      <p className="text-sm text-gray-600">
                        Certified organic since 2010, following strict organic standards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sustainable Methods</h4>
                      <p className="text-sm text-gray-600">
                        Water conservation, renewable energy, and minimal waste practices
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Community Focus</h4>
                      <p className="text-sm text-gray-600">
                        Supporting local community and providing fair wages to workers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
