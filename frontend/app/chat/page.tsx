"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video, MoreVertical, Search } from "lucide-react"
import { format } from "date-fns"
import type { ChatMessage } from "@/lib/types"

interface ChatContact {
  id: string
  name: string
  avatar?: string
  role: "farmer" | "buyer"
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  online: boolean
}

const mockContacts: ChatContact[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "farmer",
    lastMessage: "The tomatoes are ready for harvest!",
    lastMessageTime: new Date(2024, 0, 15, 14, 30),
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "farmer",
    lastMessage: "Thank you for your order",
    lastMessageTime: new Date(2024, 0, 15, 12, 15),
    unreadCount: 0,
    online: false,
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "buyer",
    lastMessage: "When will the mangoes be available?",
    lastMessageTime: new Date(2024, 0, 15, 10, 45),
    unreadCount: 1,
    online: true,
  },
]

const mockMessages: { [key: string]: ChatMessage[] } = {
  "1": [
    {
      id: "1",
      senderId: "1",
      receiverId: "current-user",
      message: "Hello! I have fresh organic tomatoes available.",
      timestamp: new Date(2024, 0, 15, 14, 0),
      read: true,
    },
    {
      id: "2",
      senderId: "current-user",
      receiverId: "1",
      message: "That's great! What's the price per kg?",
      timestamp: new Date(2024, 0, 15, 14, 5),
      read: true,
    },
    {
      id: "3",
      senderId: "1",
      receiverId: "current-user",
      message: "₹80 per kg. They are freshly harvested this morning.",
      timestamp: new Date(2024, 0, 15, 14, 10),
      read: true,
    },
    {
      id: "4",
      senderId: "current-user",
      receiverId: "1",
      message: "Perfect! I'll take 5 kg. Can you deliver today?",
      timestamp: new Date(2024, 0, 15, 14, 15),
      read: true,
    },
    {
      id: "5",
      senderId: "1",
      receiverId: "current-user",
      message: "The tomatoes are ready for harvest!",
      timestamp: new Date(2024, 0, 15, 14, 30),
      read: false,
    },
  ],
}

export default function ChatPage() {
  const { user } = useAuth()
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(mockContacts[0])
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages["1"] || [])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedContact) {
      setMessages(mockMessages[selectedContact.id] || [])
    }
  }, [selectedContact])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: "current-user",
      receiverId: selectedContact.id,
      message: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate response after 2 seconds
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        receiverId: "current-user",
        message: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date(),
        read: false,
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">Please log in to access chat.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: "600px" }}>
        <div className="flex h-full">
          {/* Contacts Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Contacts List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedContact?.id === contact.id ? "bg-green-50 border-l-4 border-green-600" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                        <p className="text-xs text-gray-500">{format(contact.lastMessageTime, "HH:mm")}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-green-600 text-white text-xs">{contact.unreadCount}</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {contact.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedContact.online ? "Online" : "Last seen recently"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === "current-user"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === "current-user" ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            {format(message.timestamp, "HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
