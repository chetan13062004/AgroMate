"use client"

import { useConnectivity } from "@/hooks/use-connectivity"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Signal, Loader2, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface ConnectivityLoaderProps {
  message?: string
  showProgress?: boolean
  size?: "sm" | "md" | "lg"
}

export default function ConnectivityLoader({
  message = "Loading...",
  showProgress = true,
  size = "md",
}: ConnectivityLoaderProps) {
  const { isOnline, connectionSpeed } = useConnectivity()
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState(message)

  useEffect(() => {
    if (!isOnline) {
      setLoadingMessage("Waiting for internet connection...")
      return
    }

    // Simulate loading progress based on connection speed
    const interval = setInterval(
      () => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }

          // Adjust speed based on connection
          const increment = connectionSpeed === "slow" ? 2 : connectionSpeed === "fast" ? 8 : 5
          return Math.min(prev + increment, 100)
        })
      },
      connectionSpeed === "slow" ? 500 : connectionSpeed === "fast" ? 100 : 200,
    )

    // Update message based on connection speed
    if (connectionSpeed === "slow") {
      setLoadingMessage("Loading... (Slow connection detected)")
    } else if (connectionSpeed === "fast") {
      setLoadingMessage("Loading...")
    } else {
      setLoadingMessage(message)
    }

    return () => clearInterval(interval)
  }, [isOnline, connectionSpeed, message])

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4"
      case "lg":
        return "h-8 w-8"
      default:
        return "h-6 w-6"
    }
  }

  const getCardSize = () => {
    switch (size) {
      case "sm":
        return "p-4"
      case "lg":
        return "p-8"
      default:
        return "p-6"
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Card className="w-full max-w-md">
        <CardContent className={getCardSize()}>
          <div className="flex flex-col items-center space-y-4">
            {/* Connection Status Icon */}
            <div className="relative">
              {isOnline ? (
                <div className="flex items-center space-x-2">
                  <Wifi className={`${getIconSize()} text-green-600`} />
                  <Signal
                    className={`${getIconSize()} ${
                      connectionSpeed === "slow"
                        ? "text-yellow-500"
                        : connectionSpeed === "fast"
                          ? "text-green-600"
                          : "text-blue-500"
                    }`}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <WifiOff className={`${getIconSize()} text-red-500`} />
                  <AlertTriangle className={`${getIconSize()} text-red-500`} />
                </div>
              )}

              {isOnline && (
                <Loader2 className={`${getIconSize()} animate-spin absolute -top-1 -right-1 text-blue-500`} />
              )}
            </div>

            {/* Connection Status Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Online" : "Offline"}</Badge>
              {isOnline && connectionSpeed !== "unknown" && (
                <Badge variant={connectionSpeed === "slow" ? "secondary" : "outline"}>
                  {connectionSpeed === "slow" ? "Slow Connection" : "Fast Connection"}
                </Badge>
              )}
            </div>

            {/* Loading Message */}
            <p className="text-center text-sm text-gray-600">{loadingMessage}</p>

            {/* Progress Bar */}
            {showProgress && isOnline && (
              <div className="w-full space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-center text-gray-500">{progress}% complete</p>
              </div>
            )}

            {/* Offline Message */}
            {!isOnline && (
              <div className="text-center space-y-2">
                <p className="text-sm text-red-600">No internet connection detected</p>
                <p className="text-xs text-gray-500">Please check your connection and try again</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
