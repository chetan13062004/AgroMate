"use client"

import { useState, useEffect } from "react"

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionSpeed, setConnectionSpeed] = useState<"slow" | "fast" | "unknown">("unknown")

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Check connection speed
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      const updateConnectionSpeed = () => {
        const effectiveType = connection.effectiveType
        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          setConnectionSpeed("slow")
        } else if (effectiveType === "3g" || effectiveType === "4g") {
          setConnectionSpeed("fast")
        } else {
          setConnectionSpeed("unknown")
        }
      }

      updateConnectionSpeed()
      connection.addEventListener("change", updateConnectionSpeed)

      return () => connection.removeEventListener("change", updateConnectionSpeed)
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return { isOnline, connectionSpeed }
}
