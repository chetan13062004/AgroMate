"use client"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Menu,
  Bell,
  Package,
  Sprout,
  Calendar,
  MessageCircle,
  BarChart3,
  X,
  LogOut,
  Tractor,
  Warehouse,
  Star,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function FarmerNavigation() {
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "harvest":
        return <Sprout className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-green-800 shadow-lg border-b border-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Farmer Logo */}
          <Link href="/farmer/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-white">Farmer Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/farmer/dashboard"
              className="text-green-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/farmer/products"
              className="text-green-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Package className="h-4 w-4" />
              <span>Products</span>
            </Link>
            <Link
              href="/equipment"
              className="text-green-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Tractor className="h-4 w-4" />
              <span>Equipment Rent</span>
            </Link>
            <Link
              href="/orders"
              className="text-green-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </Link>
            <Link
              href="/farmer/rent-history"
              className="text-green-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Warehouse className="h-4 w-4" />
              <span>Rent History</span>
            </Link>
            <Link
              href="/marketing"
              className="text-green-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Star className="h-4 w-4" />
              <span>Marketing</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">


            {/* Farmer Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-green-100 hover:text-white">
                  <User className="h-5 w-5 mr-1" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile/new-profile">Farm Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-green-100">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-green-800 text-white">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/farmer/dashboard" className="text-lg font-medium flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/equipment" className="text-lg font-medium flex items-center space-x-2">
                    <Tractor className="h-5 w-5" />
                    <span>Equipment Rent</span>
                  </Link>
                  <Link href="/orders" className="text-lg font-medium flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  <Link href="/farmer/rent-history" className="text-lg font-medium flex items-center space-x-2">
                    <Warehouse className="h-5 w-5" />
                    <span>Rent History</span>
                  </Link>
                  <Link href="/marketing" className="text-lg font-medium flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Marketing</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
