"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useEnhancedChat } from "@/contexts/enhanced-chat-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Mic,
  MicOff,
  MapPin,
  Package,
  ImageIcon,
  Star,
  Clock,
  CheckCircle,
  Truck,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

const farmerQuickResponses = [
  "Available now!",
  "Fresh harvest today",
  "₹80 per kg",
  "Free delivery above ₹500",
  "Organic certified",
  "Can deliver tomorrow",
  "Minimum 5kg order",
  "Best quality guaranteed",
]

const orderStatuses = [
  "Order confirmed ✅",
  "Preparing for harvest 🌱",
  "Ready for pickup 📦",
  "Out for delivery 🚚",
  "Delivered successfully ✨",
]

export default function FarmerChatPage() {
  const { user } = useAuth()
  const {
    chatRooms,
    currentRoom,
    messages,
    setCurrentRoom,
    sendMessage,
    sendQuickResponse,
    shareLocation,
    shareProduct,
    startVoiceMessage,
    stopVoiceMessage,
    isRecording,
  } = useEnhancedChat()

  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showQuickResponses, setShowQuickResponses] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatRooms.length > 0 && !currentRoom) {
      setCurrentRoom(chatRooms[0])
    }
  }, [chatRooms, currentRoom, setCurrentRoom])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentRoom) return

    sendMessage({
      senderId: user?.id || "",
      receiverId: currentRoom.participants.find((p) => p.id !== user?.id)?.id || "",
      message: newMessage,
      read: false,
      type: "text",
    })
    setNewMessage("")
    setShowQuickResponses(false)
  }

  const handleOrderUpdate = (status: string) => {
    if (!currentRoom) return

    sendMessage({
      senderId: user?.id || "",
      receiverId: currentRoom.participants.find((p) => p.id !== user?.id)?.id || "",
      message: `Order status updated: ${status}`,
      read: false,
      type: "order_update",
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && currentRoom) {
      sendMessage({
        senderId: user?.id || "",
        receiverId: currentRoom.participants.find((p) => p.id !== user?.id)?.id || "",
        message: "📷 Shared crop photos",
        read: false,
        type: "image",
        attachments: [
          {
            type: "image",
            url: "/placeholder.svg?height=200&width=300",
            name: file.name,
          },
        ],
      })
    }
  }

  const renderMessage = (message: any) => {
    const isOwn = message.senderId === user?.id
    const otherUser = currentRoom?.participants.find((p) => p.id !== user?.id)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
        >
          {!isOwn && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={otherUser?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{otherUser?.name?.charAt(0) || "B"}</AvatarFallback>
            </Avatar>
          )}

          <div className={`rounded-2xl px-4 py-2 ${isOwn ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"}`}>
            {message.type === "order_update" && (
              <Card className="mb-2 bg-white/10 border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">Order Update</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {message.type === "location" && message.location && (
              <Card className="mb-2 bg-white/10 border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Farm location shared</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {message.type === "voice" && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Mic className="h-4 w-4" />
                </div>
                <div className="flex-1 h-2 bg-white/20 rounded-full">
                  <div className="h-full w-1/3 bg-white rounded-full"></div>
                </div>
                <span className="text-xs opacity-80">{message.voiceDuration}s</span>
              </div>
            )}

            {message.type === "image" && message.attachments && (
              <div className="mb-2">
                {message.attachments.map((attachment, index) => (
                  <img
                    key={index}
                    src={attachment.url || "/placeholder.svg"}
                    alt={attachment.name}
                    className="rounded-lg max-w-full h-auto"
                  />
                ))}
              </div>
            )}

            <p className="text-sm">{message.message}</p>
            <div className="flex items-center justify-between mt-1">
              <p className={`text-xs ${isOwn ? "text-green-100" : "text-gray-500"}`}>
                {format(message.timestamp, "HH:mm")}
              </p>
              {isOwn && <CheckCircle className={`h-3 w-3 ${message.read ? "text-green-200" : "text-green-300"}`} />}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const filteredRooms = chatRooms.filter((room) => {
    if (activeTab === "inquiries") return room.context?.type === "product_inquiry"
    if (activeTab === "orders") return room.context?.type === "order_discussion"
    return true
  })

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">Please log in to access chat.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: "700px" }}>
        <div className="flex h-full">
          {/* Chat Rooms Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gradient-to-b from-green-50 to-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-green-600 text-white">
              <h2 className="text-lg font-semibold">Customer Chats</h2>
              <p className="text-sm text-green-100">Manage customer inquiries</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="inquiries" className="text-xs">
                  Inquiries
                </TabsTrigger>
                <TabsTrigger value="orders" className="text-xs">
                  Orders
                </TabsTrigger>
              </TabsList>

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-400"
                  />
                </div>
              </div>

              {/* Chat Rooms List */}
              <TabsContent value={activeTab} className="flex-1 m-0">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {filteredRooms.map((room) => {
                      const otherUser = room.participants.find((p) => p.id !== user.id)
                      return (
                        <motion.div
                          key={room.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCurrentRoom(room)}
                          className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-green-50 transition-colors ${
                            currentRoom?.id === room.id ? "bg-green-100 border-l-4 border-green-600" : ""
                          }`}
                        >
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={otherUser?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{otherUser?.name?.charAt(0) || "B"}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-gray-900 truncate">{otherUser?.name}</p>
                              <p className="text-xs text-gray-500">{format(room.lastActivity, "HH:mm")}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-500 truncate">
                                {room.lastMessage?.message || "New customer"}
                              </p>
                              {room.unreadCount > 0 && (
                                <Badge className="bg-green-600 text-white text-xs">{room.unreadCount}</Badge>
                              )}
                            </div>
                            <div className="flex items-center mt-1 space-x-2">
                              {room.context?.type === "product_inquiry" && (
                                <div className="flex items-center">
                                  <Package className="h-3 w-3 text-green-600 mr-1" />
                                  <span className="text-xs text-green-600">Product Inquiry</span>
                                </div>
                              )}
                              {room.context?.type === "order_discussion" && (
                                <div className="flex items-center">
                                  <Truck className="h-3 w-3 text-blue-600 mr-1" />
                                  <span className="text-xs text-blue-600">Order</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={currentRoom.participants.find((p) => p.id !== user.id)?.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {currentRoom.participants.find((p) => p.id !== user.id)?.name?.charAt(0) || "B"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {currentRoom.participants.find((p) => p.id !== user.id)?.name}
                        </p>
                        <div className="flex items-center text-xs text-green-100">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                          <span>Active • Customer</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Customer Context */}
                  {currentRoom.context?.product && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentRoom.context.product.images[0] || "/placeholder.svg"}
                          alt={currentRoom.context.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{currentRoom.context.product.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-green-100">
                            <span>
                              ₹{currentRoom.context.product.price}/{currentRoom.context.product.unit}
                            </span>
                            <Separator orientation="vertical" className="h-3 bg-white/30" />
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{currentRoom.context.product.rating}</span>
                            </div>
                            <Separator orientation="vertical" className="h-3 bg-white/30" />
                            <span>{currentRoom.context.product.inStock ? "In Stock" : "Out of Stock"}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="space-y-1">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <div key={message.id}>{renderMessage(message)}</div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Quick Actions */}
                <AnimatePresence>
                  {showQuickResponses && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 border-t border-gray-200 bg-gray-50"
                    >
                      <div className="space-y-3">
                        {/* Quick Responses */}
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-2">Quick Responses</p>
                          <div className="flex flex-wrap gap-2">
                            {farmerQuickResponses.map((response, index) => (
                              <motion.button
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => sendQuickResponse(response)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                              >
                                {response}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Order Status Updates */}
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-2">Order Status</p>
                          <div className="flex flex-wrap gap-2">
                            {orderStatuses.map((status, index) => (
                              <motion.button
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleOrderUpdate(status)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                              >
                                {status}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQuickResponses(!showQuickResponses)}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareLocation}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Reply to customer inquiry..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 border-green-200 focus:border-green-400"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onMouseDown={startVoiceMessage}
                      onMouseUp={stopVoiceMessage}
                      className={`text-green-600 hover:bg-green-50 ${isRecording ? "bg-red-100 text-red-600" : ""}`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-500 text-lg">Select a customer to start chatting</p>
                  <p className="text-gray-400 text-sm mt-2">Manage inquiries and orders efficiently</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
