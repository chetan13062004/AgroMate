"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { ChatMessage, Product, User } from "@/lib/types"

interface ChatRoom {
  id: string
  participants: User[]
  lastMessage?: ChatMessage
  lastActivity: Date
  unreadCount: number
  context?: {
    type: "product_inquiry" | "order_discussion" | "general"
    productId?: string
    orderId?: string
    product?: Product
  }
}

interface EnhancedChatMessage extends ChatMessage {
  type: "text" | "image" | "voice" | "product" | "location" | "order_update"
  attachments?: {
    type: string
    url: string
    name: string
  }[]
  productRef?: {
    id: string
    name: string
    image: string
    price: number
  }
  location?: {
    lat: number
    lng: number
    address: string
  }
  voiceDuration?: number
}

interface EnhancedChatContextType {
  chatRooms: ChatRoom[]
  currentRoom: ChatRoom | null
  messages: EnhancedChatMessage[]
  setCurrentRoom: (room: ChatRoom) => void
  sendMessage: (message: Omit<EnhancedChatMessage, "id" | "timestamp">) => void
  sendQuickResponse: (response: string) => void
  shareProduct: (product: Product) => void
  shareLocation: () => void
  startVoiceMessage: () => void
  stopVoiceMessage: () => void
  isRecording: boolean
  createProductInquiry: (farmerId: string, productId: string) => Promise<ChatRoom>
}

const EnhancedChatContext = createContext<EnhancedChatContextType | undefined>(undefined)

export function EnhancedChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([])
  const [isRecording, setIsRecording] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      const mockRooms: ChatRoom[] = [
        {
          id: "room1",
          participants: [
            user,
            {
              id: "farmer1",
              name: "Rajesh Kumar",
              email: "rajesh@farm.com",
              role: "farmer",
              location: { lat: 19.076, lng: 72.8777, address: "Pune, Maharashtra" },
            },
          ],
          lastActivity: new Date(),
          unreadCount: 2,
          context: {
            type: "product_inquiry",
            productId: "prod1",
            product: {
              id: "prod1",
              name: "Organic Tomatoes",
              price: 80,
              unit: "kg",
              images: ["/placeholder.svg?height=200&width=200"],
              category: "vegetables",
              description: "Fresh organic tomatoes",
              farmerId: "farmer1",
              farmerName: "Rajesh Kumar",
              location: { lat: 19.076, lng: 72.8777, address: "Pune, Maharashtra" },
              isOrganic: true,
              rating: 4.5,
              reviewCount: 23,
              inStock: true,
              harvestDate: "2024-01-15",
            },
          },
        },
      ]
      setChatRooms(mockRooms)
    } else {
      // Clear chat rooms when user is not logged in
      setChatRooms([])
      setCurrentRoom(null)
      setMessages([])
    }
  }, [user])

  const sendMessage = (messageData: Omit<EnhancedChatMessage, "id" | "timestamp">) => {
    if (!currentRoom || !user) return

    const newMessage: EnhancedChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate response for demo
    setTimeout(() => {
      const otherParticipant = currentRoom.participants.find((p) => p.id !== user.id)
      if (otherParticipant) {
        const response: EnhancedChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: otherParticipant.id,
          receiverId: user.id,
          message: "Thanks for your message! Let me check and get back to you.",
          timestamp: new Date(),
          read: false,
          type: "text",
        }
        setMessages((prev) => [...prev, response])
      }
    }, 2000)
  }

  const sendQuickResponse = (response: string) => {
    sendMessage({
      senderId: user?.id || "",
      receiverId: currentRoom?.participants.find((p) => p.id !== user?.id)?.id || "",
      message: response,
      read: false,
      type: "text",
    })
  }

  const shareProduct = (product: Product) => {
    sendMessage({
      senderId: user?.id || "",
      receiverId: currentRoom?.participants.find((p) => p.id !== user?.id)?.id || "",
      message: `Check out this product: ${product.name}`,
      read: false,
      type: "product",
      productRef: {
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
      },
    })
  }

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        sendMessage({
          senderId: user?.id || "",
          receiverId: currentRoom?.participants.find((p) => p.id !== user?.id)?.id || "",
          message: "📍 Shared my location",
          read: false,
          type: "location",
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          },
        })
      })
    }
  }

  const startVoiceMessage = () => {
    setIsRecording(true)
    // Voice recording logic would go here
  }

  const stopVoiceMessage = () => {
    setIsRecording(false)
    // Stop recording and send voice message
    sendMessage({
      senderId: user?.id || "",
      receiverId: currentRoom?.participants.find((p) => p.id !== user?.id)?.id || "",
      message: "🎵 Voice message",
      read: false,
      type: "voice",
      voiceDuration: 15,
    })
  }

  const createProductInquiry = async (farmerId: string, productId: string): Promise<ChatRoom> => {
    // Create new chat room for product inquiry
    const newRoom: ChatRoom = {
      id: `room_${Date.now()}`,
      participants: [
        user!,
        {
          id: farmerId,
          name: "Farmer Name",
          email: "farmer@example.com",
          role: "farmer",
        },
      ],
      lastActivity: new Date(),
      unreadCount: 0,
      context: {
        type: "product_inquiry",
        productId,
      },
    }

    setChatRooms((prev) => [newRoom, ...prev])
    return newRoom
  }

  return (
    <EnhancedChatContext.Provider
      value={{
        chatRooms,
        currentRoom,
        messages,
        setCurrentRoom,
        sendMessage,
        sendQuickResponse,
        shareProduct,
        shareLocation,
        startVoiceMessage,
        stopVoiceMessage,
        isRecording,
        createProductInquiry,
      }}
    >
      {children}
    </EnhancedChatContext.Provider>
  )
}

export function useEnhancedChat() {
  const context = useContext(EnhancedChatContext)
  if (context === undefined) {
    throw new Error("useEnhancedChat must be used within an EnhancedChatProvider")
  }
  return context
}
