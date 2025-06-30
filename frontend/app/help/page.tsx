"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageCircle, Phone, Mail, Book, Video, FileText, Users } from "lucide-react"

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click on 'Sign Up' in the top navigation, choose your role (Farmer or Buyer), and fill in your details. You'll receive a verification email to activate your account.",
      },
      {
        question: "What's the difference between Farmer and Buyer accounts?",
        answer:
          "Farmer accounts can list products, manage inventory, and receive orders. Buyer accounts can browse products, place orders, and communicate with farmers.",
      },
      {
        question: "Is FarmMarket free to use?",
        answer:
          "Creating an account is free. We charge a small commission on successful transactions to maintain the platform and provide support services.",
      },
    ],
  },
  {
    category: "For Farmers",
    questions: [
      {
        question: "How do I list my products?",
        answer:
          "Go to your dashboard, click 'Add Product', fill in product details including photos, pricing, and availability. Your listing will be live immediately.",
      },
      {
        question: "How do I receive payments?",
        answer:
          "Payments are processed securely through our platform. You'll receive payments directly to your bank account within 2-3 business days after order completion.",
      },
      {
        question: "Can I set my own delivery areas?",
        answer:
          "Yes, you can specify your delivery radius and areas in your profile settings. This helps customers know if you deliver to their location.",
      },
      {
        question: "What if I need to cancel an order?",
        answer:
          "You can cancel orders within 2 hours of receiving them. After that, please contact our support team for assistance.",
      },
    ],
  },
  {
    category: "For Buyers",
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "Browse products, add items to your cart, proceed to checkout, enter delivery details, and complete payment. You'll receive order confirmation immediately.",
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept credit/debit cards, UPI payments, digital wallets (Paytm, PhonePe), and cash on delivery for eligible orders.",
      },
      {
        question: "How can I track my order?",
        answer:
          "You'll receive tracking information via SMS and email. You can also track your order in real-time through your dashboard.",
      },
      {
        question: "What's your return policy?",
        answer:
          "We offer returns for damaged or incorrect items within 24 hours of delivery. Fresh produce quality issues are handled case-by-case.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "The website is not loading properly",
        answer:
          "Try clearing your browser cache, disable ad blockers, or try a different browser. If issues persist, contact our technical support.",
      },
      {
        question: "I'm not receiving notifications",
        answer:
          "Check your notification settings in your profile. Ensure you've allowed browser notifications and check your email spam folder.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page, enter your email, and follow the instructions in the reset email.",
      },
    ],
  },
]

const supportChannels = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    action: "Start Chat",
    available: "24/7",
    color: "bg-blue-500",
  },
  {
    title: "Phone Support",
    description: "Call us for urgent issues",
    icon: Phone,
    action: "Call Now",
    available: "9 AM - 9 PM",
    color: "bg-green-500",
  },
  {
    title: "Email Support",
    description: "Send us detailed queries",
    icon: Mail,
    action: "Send Email",
    available: "24-48 hrs response",
    color: "bg-purple-500",
  },
]

const resources = [
  {
    title: "User Guide",
    description: "Complete guide to using FarmMarket",
    icon: Book,
    type: "PDF",
    color: "bg-red-500",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video instructions",
    icon: Video,
    type: "Video",
    color: "bg-yellow-500",
  },
  {
    title: "API Documentation",
    description: "For developers and integrations",
    icon: FileText,
    type: "Docs",
    color: "bg-indigo-500",
  },
  {
    title: "Community Forum",
    description: "Connect with other users",
    icon: Users,
    type: "Forum",
    color: "bg-pink-500",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFAQs, setFilteredFAQs] = useState(faqData)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredFAQs(faqData)
      return
    }

    const filtered = faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(query.toLowerCase()) ||
            q.answer.toLowerCase().includes(query.toLowerCase()),
        ),
      }))
      .filter((category) => category.questions.length > 0)

    setFilteredFAQs(filtered)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600 mb-8">Find answers to your questions and get support</p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 py-3"
          />
        </div>
      </div>

      <Tabs defaultValue="faq" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <div className="space-y-6">
            {filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.category}
                    <Badge variant="outline">{category.questions.length} questions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
                <Button variant="outline" onClick={() => handleSearch("")} className="mt-4">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${channel.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <channel.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
                  <p className="text-gray-600 mb-4">{channel.description}</p>
                  <p className="text-sm text-gray-500 mb-4">Available: {channel.available}</p>
                  <Button className="w-full">{channel.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">General Support</h4>
                <p className="text-gray-600">Email: support@farmmarket.com</p>
                <p className="text-gray-600">Phone: +91 98765 43210</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Hours</h4>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 9:00 PM</p>
                <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 6:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <resource.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <Badge variant="outline">{resource.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Start Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">For Farmers</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Setting up your farmer profile
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Adding your first product listing
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Managing orders and inventory
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Understanding payment processing
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">For Buyers</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Finding and ordering fresh produce
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Understanding delivery options
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Tracking your orders
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Communicating with farmers
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
