import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Leaf, Clock, TrendingUp } from "lucide-react"

// Mock data
const featuredProducts = [
  {
    id: "1",
    name: "Organic Tomatoes",
    price: 80,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    farmer: "Rajesh Kumar",
    location: "Pune, Maharashtra",
    rating: 4.8,
    isOrganic: true,
  },
  {
    id: "2",
    name: "Fresh Mangoes",
    price: 120,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    farmer: "Priya Sharma",
    location: "Nashik, Maharashtra",
    rating: 4.9,
    isOrganic: false,
  },
  {
    id: "3",
    name: "Basmati Rice",
    price: 150,
    unit: "kg",
    image: "/placeholder.svg?height=200&width=200",
    farmer: "Suresh Patel",
    location: "Ahmedabad, Gujarat",
    rating: 4.7,
    isOrganic: true,
  },
]

const rentalEquipment = [
  {
    id: "1",
    name: "Tractor - Mahindra 575",
    price: 2500,
    unit: "day",
    image: "/placeholder.svg?height=200&width=200",
    owner: "Farm Equipment Co.",
    location: "Mumbai, Maharashtra",
    rating: 4.6,
  },
  {
    id: "2",
    name: "Harvester Combine",
    price: 5000,
    unit: "day",
    image: "/placeholder.svg?height=200&width=200",
    owner: "AgriTech Rentals",
    location: "Pune, Maharashtra",
    rating: 4.8,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Fresh From Farm to Your Table</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect directly with local farmers. Buy fresh produce, rent equipment, and get AI-powered crop diagnosis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Shop Fresh Produce
                </Button>
              </Link>
              <Link href="/rentals">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  Rent Equipment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FarmMarket?</h2>
            <p className="text-lg text-gray-600">Connecting farmers and customers with technology</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>100% Fresh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Direct from farms, ensuring maximum freshness and quality</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Local Sourcing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Support local farmers and reduce carbon footprint</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Quick Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fast delivery within 24 hours of harvest</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>AI Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Smart crop diagnosis and farming insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.isOrganic && <Badge className="absolute top-2 left-2 bg-green-600">Organic</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    ₹{product.price}/{product.unit}
                  </p>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">By {product.farmer}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {product.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Equipment */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Equipment Rentals</h2>
            <Link href="/rentals">
              <Button variant="outline">View All Equipment</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rentalEquipment.map((equipment) => (
              <Card key={equipment.id} className="hover:shadow-lg transition-shadow">
                <div className="flex">
                  <Image
                    src={equipment.image || "/placeholder.svg"}
                    alt={equipment.name}
                    width={200}
                    height={150}
                    className="w-48 h-36 object-cover rounded-l-lg"
                  />
                  <CardContent className="flex-1 p-4">
                    <h3 className="font-semibold text-lg mb-2">{equipment.name}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ₹{equipment.price}/{equipment.unit}
                    </p>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{equipment.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">By {equipment.owner}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {equipment.location}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of farmers and customers already using FarmMarket</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=farmer">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Join as Farmer
              </Button>
            </Link>
            <Link href="/auth/register?role=buyer">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
