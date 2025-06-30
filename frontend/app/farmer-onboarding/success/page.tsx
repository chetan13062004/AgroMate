"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Mail, Phone, FileText } from "lucide-react"

export default function FarmerOnboardingSuccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h1>
        <p className="text-xl text-gray-600">
          Thank you for applying to join FarmMarket. We're excited to have you as part of our farming community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Application Review</h4>
                <p className="text-sm text-gray-600">
                  Our team will review your application and documents within 24-48 hours.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium">Verification Call</h4>
                <p className="text-sm text-gray-600">We may contact you for additional information or clarification.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Account Activation</h4>
                <p className="text-sm text-gray-600">
                  Once approved, you'll receive login credentials and can start listing products.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Application Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Application ID:</span>
              <span className="font-medium">FA-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Under Review</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Response:</span>
              <span className="font-medium">Within 48 hours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>While You Wait...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">Read Our Farmer Guide</h4>
              <p className="text-sm text-gray-600">Learn best practices for listing products and managing orders.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Join Our Community</h4>
              <p className="text-sm text-gray-600">
                Connect with other farmers in our WhatsApp group for tips and support.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-2">Prepare Your Products</h4>
              <p className="text-sm text-gray-600">
                Start taking photos and preparing descriptions for your first listings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/help">
            <Button>Get Support</Button>
          </Link>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Questions? Contact us at{" "}
            <a href="mailto:farmers@farmmarket.com" className="text-green-600 hover:underline">
              farmers@farmmarket.com
            </a>
          </p>
          <p>
            or call us at{" "}
            <a href="tel:+919876543210" className="text-green-600 hover:underline">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
