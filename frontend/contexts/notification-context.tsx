"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Bell, Package, MessageCircle, Star, TrendingUp } from "lucide-react"

interface Notification {
  id: string
  type: "order" | "message" | "review" | "system" | "promotion"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "New Order Received",
      message: "You have received a new order for Organic Tomatoes",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionUrl: "/dashboard",
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      message: "Rajesh Kumar sent you a message about delivery timing",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionUrl: "/chat",
    },
    {
      id: "3",
      type: "review",
      title: "New Review",
      message: "You received a 5-star review for Fresh Mangoes",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      actionUrl: "/profile/new-profile",
    },
  ])

  const [showToast, setShowToast] = useState<Notification | null>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
    setShowToast(newNotification)

    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowToast(null), 5000)

    // Request permission for browser notifications
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/favicon.ico",
      })
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: "order" as const,
          title: "New Order",
          message: "New order for Fresh Spinach received",
        },
        {
          type: "message" as const,
          title: "New Message",
          message: "Customer inquiry about delivery",
        },
        {
          type: "system" as const,
          title: "System Update",
          message: "New features available in your dashboard",
        },
      ]

      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "review":
        return <Star className="h-4 w-4" />
      case "promotion":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-green-600"
      case "message":
        return "bg-blue-600"
      case "review":
        return "bg-yellow-600"
      case "promotion":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <Card className="w-80 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getNotificationColor(showToast.type)}`}>
                  {getNotificationIcon(showToast.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{showToast.title}</h4>
                  <p className="text-sm text-gray-600">{showToast.message}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowToast(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
