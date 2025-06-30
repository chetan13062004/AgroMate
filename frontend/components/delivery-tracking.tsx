"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Package, Truck, MapPin, Clock, Phone, MessageCircle } from "lucide-react"

interface DeliveryStatus {
  id: string
  status: "confirmed" | "preparing" | "picked_up" | "in_transit" | "delivered"
  timestamp: Date
  description: string
  location?: string
}

interface DeliveryTrackingProps {
  orderId: string
}

const mockDeliveryStatuses: DeliveryStatus[] = [
  {
    id: "1",
    status: "confirmed",
    timestamp: new Date(2024, 0, 15, 10, 0),
    description: "Order confirmed and payment received",
  },
  {
    id: "2",
    status: "preparing",
    timestamp: new Date(2024, 0, 15, 11, 30),
    description: "Farmer is preparing your fresh produce",
    location: "Rajesh Kumar's Farm, Pune",
  },
  {
    id: "3",
    status: "picked_up",
    timestamp: new Date(2024, 0, 15, 14, 15),
    description: "Order picked up by delivery partner",
    location: "Pune Distribution Center",
  },
  {
    id: "4",
    status: "in_transit",
    timestamp: new Date(2024, 0, 15, 16, 45),
    description: "Out for delivery to your location",
    location: "En route to Mumbai",
  },
]

export default function DeliveryTracking({ orderId }: DeliveryTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus[]>(mockDeliveryStatuses)
  const [estimatedDelivery, setEstimatedDelivery] = useState(new Date(2024, 0, 15, 18, 0))
  const [deliveryPartner, setDeliveryPartner] = useState({
    name: "Ravi Sharma",
    phone: "+91 98765 43210",
    vehicle: "MH 12 AB 1234",
  })

  const statusOrder = ["confirmed", "preparing", "picked_up", "in_transit", "delivered"]
  const currentStatusIndex = Math.max(...currentStatus.map((s) => statusOrder.indexOf(s.status)))
  const progress = ((currentStatusIndex + 1) / statusOrder.length) * 100

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5" />
      case "preparing":
        return <Package className="h-5 w-5" />
      case "picked_up":
        return <Truck className="h-5 w-5" />
      case "in_transit":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <MapPin className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return "text-green-600"
    }
    return "text-gray-400"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStatusIndex < statusOrder.length - 1 && Math.random() < 0.3) {
        const nextStatus = statusOrder[currentStatusIndex + 1]
        const newStatus: DeliveryStatus = {
          id: Date.now().toString(),
          status: nextStatus as any,
          timestamp: new Date(),
          description: `Status updated to ${nextStatus}`,
          location: "Updated location",
        }
        setCurrentStatus((prev) => [...prev, newStatus])
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [currentStatusIndex])

  return (
    <div className="space-y-6">
      {/* Delivery Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Delivery Progress</span>
            <Badge variant={progress === 100 ? "default" : "secondary"}>
              {progress === 100 ? "Delivered" : "In Progress"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>Estimated Delivery:</span>
              </div>
              <span className="font-medium">{formatTime(estimatedDelivery)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusOrder.map((status, index) => {
              const statusData = currentStatus.find((s) => s.status === status)
              const isCompleted = statusData !== undefined
              const isCurrent = index === currentStatusIndex && progress < 100

              return (
                <div key={status} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${isCompleted ? "bg-green-100" : "bg-gray-100"}`}>
                    <div className={getStatusColor(status, isCompleted)}>{getStatusIcon(status)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium capitalize ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        {status.replace("_", " ")}
                      </h4>
                      {statusData && <span className="text-sm text-gray-500">{formatTime(statusData.timestamp)}</span>}
                    </div>
                    {statusData && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">{statusData.description}</p>
                        {statusData.location && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {statusData.location}
                          </p>
                        )}
                      </div>
                    )}
                    {isCurrent && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Current Status
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Partner Info */}
      {currentStatusIndex >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{deliveryPartner.name}</p>
                <p className="text-sm text-gray-600">Vehicle: {deliveryPartner.vehicle}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Location (Mock) */}
      {currentStatusIndex >= 3 && currentStatusIndex < 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Live Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Live Location Tracking</p>
                <p className="text-sm text-gray-400">Your delivery is 15 minutes away</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
