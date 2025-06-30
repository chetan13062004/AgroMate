"use client"

import { useAuth } from "@/contexts/auth-context"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import FarmerDashboard from "@/components/dashboards/farmer-dashboard"
import BuyerDashboard from "@/components/dashboards/buyer-dashboard"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/farmer/dashboard")
  }, [router])
  return null
}
