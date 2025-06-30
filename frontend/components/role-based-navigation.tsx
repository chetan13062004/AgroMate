"use client"

import { useAuth } from "@/contexts/auth-context"
import AdminNavigation from "@/components/navigation/admin-navigation"
import FarmerNavigation from "@/components/navigation/farmer-navigation"
import BuyerNavigation from "@/components/navigation/buyer-navigation"
import Navigation from "@/components/navigation"

export default function RoleBasedNavigation() {
  const { user } = useAuth()

  // If no user is logged in, show the default navigation
  if (!user) {
    return <Navigation />
  }

  // Show role-specific navigation based on user role
  switch (user.role) {
    case "admin":
      return <AdminNavigation />
    case "farmer":
      return <FarmerNavigation />
    case "buyer":
      return <BuyerNavigation />
    default:
      return <Navigation />
  }
}
