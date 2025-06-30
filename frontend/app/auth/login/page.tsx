"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("buyer")
  const { login, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login(email, password, role);
      if (result?.success) {
        const redirect = searchParams.get("redirect") || "/dashboard";
        router.push(redirect);
      } else if (result?.isPendingApproval || result?.error?.toLowerCase().includes('pending')) {
        // Show SweetAlert for pending approval
        await Swal.fire({
          title: 'Account Pending Approval',
          html: `
            <div style="text-align: left;">
              <p>Your farmer account is currently pending admin approval.</p>
              <p style="margin-top: 0.5rem;">We've sent your registration details to our team for review. You'll receive an email once your account is approved.</p>
              <p style="margin-top: 0.5rem; font-weight: 500;">Please check back later or contact support if you have any questions.</p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Got it!',
          confirmButtonColor: '#10B981'
        });
      } else if (result?.error) {
        // Show error message for other login failures
        await Swal.fire({
          title: 'Login Failed',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#10B981'
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      await Swal.fire({
        title: 'Login Failed',
        text: error instanceof Error ? error.message : 'An error occurred during login',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10B981'
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <p className="text-gray-600">Welcome back to FarmMarket</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="role">I am a</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-green-600 hover:text-green-500">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
