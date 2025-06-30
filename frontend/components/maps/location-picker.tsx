"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, Navigation } from "lucide-react"

interface Location {
  lat: number
  lng: number
  address: string
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void
  initialLocation?: Location
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock locations for demonstration
  const mockLocations = [
    { lat: 19.076, lng: 72.8777, address: "Mumbai, Maharashtra" },
    { lat: 18.5204, lng: 73.8567, address: "Pune, Maharashtra" },
    { lat: 19.9975, lng: 73.7898, address: "Nashik, Maharashtra" },
    { lat: 23.0225, lng: 72.5714, address: "Ahmedabad, Gujarat" },
    { lat: 12.9716, lng: 77.5946, address: "Bangalore, Karnataka" },
  ]

  const [searchResults, setSearchResults] = useState<Location[]>([])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter mock locations based on search query
    const results = mockLocations.filter((location) =>
      location.address.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(results)
    setIsLoading(false)
  }

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          }
          setSelectedLocation(location)
          onLocationSelect(location)
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoading(false)
        },
      )
    }
  }

  const selectLocation = (location: Location) => {
    setSelectedLocation(location)
    onLocationSelect(location)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Select Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex space-x-2">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Current Location Button */}
        <Button variant="outline" onClick={getCurrentLocation} disabled={isLoading} className="w-full">
          <Navigation className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>

        {/* Map Placeholder */}
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive Map</p>
            <p className="text-sm text-gray-400">
              {selectedLocation ? selectedLocation.address : "No location selected"}
            </p>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Search Results:</h4>
            {searchResults.map((location, index) => (
              <div
                key={index}
                onClick={() => selectLocation(location)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{location.address}</span>
                </div>
                {selectedLocation?.address === location.address && (
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Popular Locations */}
        <div className="space-y-2">
          <h4 className="font-medium">Popular Locations:</h4>
          {mockLocations.slice(0, 3).map((location, index) => (
            <div
              key={index}
              onClick={() => selectLocation(location)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{location.address}</span>
              </div>
              {selectedLocation?.address === location.address && (
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Selected Location</p>
                <p className="text-sm text-green-600">{selectedLocation.address}</p>
                <p className="text-xs text-green-500">
                  Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
