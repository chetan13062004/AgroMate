"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Search, MessageCircle, ThumbsUp, Flag, Calendar, Package } from "lucide-react"

// Mock reviews data
const mockReviews = [
  {
    id: "REV-001",
    customer: "Amit Sharma",
    farmer: "Rajesh Kumar",
    product: "Organic Tomatoes",
    rating: 5,
    title: "Excellent quality tomatoes!",
    comment:
      "The tomatoes were incredibly fresh and flavorful. Perfect for making salads and cooking. Will definitely order again!",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
    orderValue: 240,
    images: ["/placeholder.svg?height=100&width=100"],
    response: {
      farmer: "Rajesh Kumar",
      message: "Thank you so much for your kind words! We're glad you enjoyed our tomatoes.",
      date: "2024-01-16",
    },
  },
  {
    id: "REV-002",
    customer: "Priya Patel",
    farmer: "Suresh Patel",
    product: "Fresh Spinach",
    rating: 4,
    title: "Good quality, fast delivery",
    comment:
      "The spinach was fresh and green. Delivery was prompt. Only minor issue was some leaves were a bit wilted.",
    date: "2024-01-14",
    verified: true,
    helpful: 8,
    orderValue: 160,
    images: [],
    response: null,
  },
  {
    id: "REV-003",
    customer: "Rohit Singh",
    farmer: "Meera Singh",
    product: "Basmati Rice",
    rating: 5,
    title: "Premium quality rice",
    comment: "Outstanding basmati rice! The aroma and taste are exceptional. Highly recommended for special occasions.",
    date: "2024-01-13",
    verified: true,
    helpful: 15,
    orderValue: 750,
    images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    response: {
      farmer: "Meera Singh",
      message: "We're thrilled you loved our basmati rice! Thank you for choosing us.",
      date: "2024-01-14",
    },
  },
  {
    id: "REV-004",
    customer: "Sneha Reddy",
    farmer: "Arjun Reddy",
    product: "Fresh Mangoes",
    rating: 3,
    title: "Average quality",
    comment: "The mangoes were okay but not as sweet as expected. Some were overripe while others were still raw.",
    date: "2024-01-12",
    verified: true,
    helpful: 3,
    orderValue: 300,
    images: [],
    response: {
      farmer: "Arjun Reddy",
      message:
        "We apologize for the inconsistency. We're working on better quality control. Please contact us for a replacement.",
      date: "2024-01-13",
    },
  },
]

export default function ReviewsPage() {
  const { user } = useAuth()
  const [reviews] = useState(mockReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [replyText, setReplyText] = useState("")

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter

    return matchesSearch && matchesRating
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const reviewStats = {
    totalReviews: reviews.length,
    averageRating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    ratingDistribution: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
  }

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClass = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4"

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const handleReply = () => {
    // Handle farmer reply logic
    alert(`Reply sent: ${replyText}`)
    setIsReplyDialogOpen(false)
    setReplyText("")
    setSelectedReview(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
        <p className="text-gray-600">Customer feedback and ratings for your products</p>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{reviewStats.averageRating.toFixed(1)}</div>
              {renderStars(Math.round(reviewStats.averageRating), "lg")}
              <p className="text-gray-600 mt-2">Based on {reviewStats.totalReviews} reviews</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                  <Progress
                    value={
                      (reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] /
                        reviewStats.totalReviews) *
                      100
                    }
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-gray-600 w-8">
                    {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews by product, customer, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{review.customer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.customer}</h3>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">{review.rating}/5</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {review.date}
                      </div>
                      <div className="flex items-center mt-1">
                        <Package className="h-3 w-3 mr-1" />₹{review.orderValue}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Product: <span className="font-medium text-gray-900">{review.product}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Farmer: <span className="font-medium text-gray-900">{review.farmer}</span>
                    </p>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                    {user?.role === "farmer" && !review.response && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review)
                          setIsReplyDialogOpen(true)
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    )}
                  </div>

                  {/* Farmer Response */}
                  {review.response && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-600 text-white text-xs">
                            {review.response.farmer.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-green-900">{review.response.farmer}</span>
                            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                              Farmer
                            </Badge>
                            <span className="text-xs text-green-700">{review.response.date}</span>
                          </div>
                          <p className="text-green-800">{review.response.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedReviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {searchTerm || ratingFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any reviews yet"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{selectedReview.customer}</span>
                  {renderStars(selectedReview.rating, "sm")}
                </div>
                <p className="text-sm text-gray-700">{selectedReview.comment}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a thoughtful response to this review..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReply} disabled={!replyText.trim()}>
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
