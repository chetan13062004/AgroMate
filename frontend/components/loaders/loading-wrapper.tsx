"use client"

import { useConnectivity } from "@/hooks/use-connectivity"
import ConnectivityLoader from "./connectivity-loader"
import { type ReactNode, useState, useEffect } from "react"

interface LoadingWrapperProps {
  children: ReactNode
  isLoading: boolean
  loadingType?: "dashboard" | "products" | "orders" | "profile" | "chat" | "default"
  message?: string
  minLoadingTime?: number
}

export default function LoadingWrapper({
  children,
  isLoading,
  loadingType = "default",
  message,
  minLoadingTime = 1000,
}: LoadingWrapperProps) {
  const { isOnline, connectionSpeed } = useConnectivity()
  const [showLoading, setShowLoading] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true)

      // Ensure minimum loading time for better UX
      const timer = setTimeout(() => {
        if (!isLoading) {
          setShowLoading(false)
        }
      }, minLoadingTime)

      return () => clearTimeout(timer)
    } else {
      // Add slight delay before hiding loader for smooth transition
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [isLoading, minLoadingTime])

  if (showLoading || !isOnline) {
    return <ConnectivityLoader message={message || "Loading..."} size="lg" showProgress={isOnline} />
  }

  return <>{children}</>
}
