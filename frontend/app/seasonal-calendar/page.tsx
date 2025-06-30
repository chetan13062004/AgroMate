"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Leaf, Sun, Droplets } from "lucide-react"

interface CropInfo {
  id: string
  name: string
  category: string
  plantingMonths: number[]
  harvestMonths: number[]
  region: string[]
  benefits: string[]
  tips: string[]
  waterRequirement: "Low" | "Medium" | "High"
  sunRequirement: "Partial" | "Full"
  difficulty: "Easy" | "Medium" | "Hard"
}

const cropData: CropInfo[] = [
  {
    id: "1",
    name: "Tomatoes",
    category: "Vegetables",
    plantingMonths: [6, 7, 10, 11],
    harvestMonths: [9, 10, 1, 2],
    region: ["Maharashtra", "Karnataka", "Andhra Pradesh"],
    benefits: ["Rich in Vitamin C", "Good for heart health", "Contains lycopene"],
    tips: ["Plant after monsoon", "Provide support stakes", "Regular pruning needed"],
    waterRequirement: "Medium",
    sunRequirement: "Full",
    difficulty: "Medium",
  },
  {
    id: "2",
    name: "Rice",
    category: "Grains",
    plantingMonths: [6, 7],
    harvestMonths: [10, 11],
    region: ["West Bengal", "Punjab", "Andhra Pradesh", "Tamil Nadu"],
    benefits: ["Primary carbohydrate source", "Gluten-free", "Easy to digest"],
    tips: ["Requires flooded fields", "Transplant seedlings", "Monitor for pests"],
    waterRequirement: "High",
    sunRequirement: "Full",
    difficulty: "Hard",
  },
  {
    id: "3",
    name: "Wheat",
    category: "Grains",
    plantingMonths: [11, 12],
    harvestMonths: [3, 4],
    region: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"],
    benefits: ["High in protein", "Good source of fiber", "Contains B vitamins"],
    tips: ["Sow in winter", "Requires well-drained soil", "Regular irrigation needed"],
    waterRequirement: "Medium",
    sunRequirement: "Full",
    difficulty: "Medium",
  },
  {
    id: "4",
    name: "Mangoes",
    category: "Fruits",
    plantingMonths: [6, 7, 8],
    harvestMonths: [3, 4, 5, 6],
    region: ["Maharashtra", "Andhra Pradesh", "Karnataka", "Gujarat"],
    benefits: ["Rich in Vitamin A", "High in antioxidants", "Good for immunity"],
    tips: ["Plant during monsoon", "Requires deep soil", "Prune regularly"],
    waterRequirement: "Medium",
    sunRequirement: "Full",
    difficulty: "Hard",
  },
  {
    id: "5",
    name: "Spinach",
    category: "Vegetables",
    plantingMonths: [9, 10, 11, 1, 2],
    harvestMonths: [11, 12, 1, 2, 3, 4],
    region: ["All regions"],
    benefits: ["High in iron", "Rich in vitamins", "Low in calories"],
    tips: ["Cool season crop", "Harvest young leaves", "Successive planting"],
    waterRequirement: "Medium",
    sunRequirement: "Partial",
    difficulty: "Easy",
  },
  {
    id: "6",
    name: "Onions",
    category: "Vegetables",
    plantingMonths: [10, 11, 12],
    harvestMonths: [3, 4, 5],
    region: ["Maharashtra", "Karnataka", "Gujarat", "Madhya Pradesh"],
    benefits: ["Natural antibiotic", "Good for heart", "Anti-inflammatory"],
    tips: ["Plant in winter", "Requires well-drained soil", "Avoid overwatering"],
    waterRequirement: "Low",
    sunRequirement: "Full",
    difficulty: "Easy",
  },
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const regions = [
  "All",
  "Maharashtra",
  "Karnataka",
  "Punjab",
  "Andhra Pradesh",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
  "Haryana",
  "Uttar Pradesh",
  "Madhya Pradesh",
]

export default function SeasonalCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Vegetables", "Fruits", "Grains"]

  const filteredCrops = cropData.filter((crop) => {
    const monthMatch = crop.plantingMonths.includes(selectedMonth) || crop.harvestMonths.includes(selectedMonth)
    const regionMatch = selectedRegion === "All" || crop.region.includes(selectedRegion)
    const categoryMatch = selectedCategory === "All" || crop.category === selectedCategory
    return monthMatch && regionMatch && categoryMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getWaterColor = (requirement: string) => {
    switch (requirement) {
      case "Low":
        return "text-yellow-600"
      case "Medium":
        return "text-blue-600"
      case "High":
        return "text-blue-800"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Seasonal Crop Calendar</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover what crops to plant and harvest each month based on your region and preferences
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Month Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {months[selectedMonth - 1]} Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">🌱 Planting Season</h3>
              <div className="space-y-1">
                {cropData
                  .filter((crop) => crop.plantingMonths.includes(selectedMonth))
                  .map((crop) => (
                    <Badge key={`plant-${crop.id}`} variant="outline" className="mr-2 mb-1">
                      {crop.name}
                    </Badge>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-orange-600 mb-2">🌾 Harvest Season</h3>
              <div className="space-y-1">
                {cropData
                  .filter((crop) => crop.harvestMonths.includes(selectedMonth))
                  .map((crop) => (
                    <Badge key={`harvest-${crop.id}`} variant="outline" className="mr-2 mb-1">
                      {crop.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{crop.name}</CardTitle>
                <Badge className={getDifficultyColor(crop.difficulty)}>{crop.difficulty}</Badge>
              </div>
              <Badge variant="outline">{crop.category}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timing */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Timing</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-green-600">🌱 Plant:</span>{" "}
                    {crop.plantingMonths.map((m) => months[m - 1]).join(", ")}
                  </p>
                  <p>
                    <span className="text-orange-600">🌾 Harvest:</span>{" "}
                    {crop.harvestMonths.map((m) => months[m - 1]).join(", ")}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Droplets className={`h-4 w-4 mr-1 ${getWaterColor(crop.waterRequirement)}`} />
                    <span>{crop.waterRequirement}</span>
                  </div>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{crop.sunRequirement}</span>
                  </div>
                </div>
              </div>

              {/* Regions */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Best Regions</h4>
                <div className="flex flex-wrap gap-1">
                  {crop.region.slice(0, 3).map((region) => (
                    <Badge key={region} variant="secondary" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                  {crop.region.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{crop.region.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Benefits</h4>
                <ul className="text-xs space-y-1">
                  {crop.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-1">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Growing Tips</h4>
                <ul className="text-xs space-y-1">
                  {crop.tips.slice(0, 2).map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more crops for this period.</p>
        </div>
      )}
    </div>
  )
}
