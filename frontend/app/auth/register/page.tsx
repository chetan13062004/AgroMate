"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type UserRole = 'buyer' | 'farmer' | 'admin'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  phone: string
  address: string
  farmSize: string
  categories: string
}

interface FormErrors {
  [key: string]: string
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register, loading, error: authError } = useAuth()
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    phone: "",
    address: "",
    farmSize: "",
    categories: "",
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    // Check address requirement based on role
    if (formData.role === 'farmer' && !formData.address) {
      newErrors.address = "Address is required for farmers"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      // Prepare the registration data based on user role
      const registrationData = formData.role === 'farmer' 
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phone: formData.phone,
            location: {
              address: formData.address,
              lat: 0, // These should be geocoded in a real app
              lng: 0
            },
            farmSize: formData.farmSize,
            categories: formData.categories.split(',').map(s => s.trim().toLowerCase())
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phone: formData.phone
          }

      const result = await register(registrationData)
      
      if (result?.success) {
        toast.success("Registration successful!")
        router.push(redirectTo)
      } else {
        toast.error(result?.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const handleChange = (field: string, value: string | UserRole) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            {searchParams.get('redirect') ? 'Sign up to continue to your dashboard' : 'Join our marketplace today'}
          </p>
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{authError}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>I am a</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="farmer">Farmer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="Enter your email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  placeholder="••••••••"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                placeholder="Enter your phone number"
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to contact you about your {formData.role === 'farmer' ? 'listings and orders' : 'orders'}
              </p>
            </div>

            {formData.role === 'farmer' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Farm Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">Farm Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your farm's full address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={`min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.farmSize}
                      onChange={(e) => handleChange("farmSize", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories</Label>
                    <Input
                      id="categories"
                      placeholder="e.g., vegetables, fruits"
                      value={formData.categories}
                      onChange={(e) => handleChange("categories", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple categories with commas
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href={`/auth/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
