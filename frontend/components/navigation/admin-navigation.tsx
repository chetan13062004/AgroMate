"use client"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  User,
  Menu,
  Settings,
  Users,
  Package,
  BarChart3,
  Shield,
  FileText,
  LogOut,
  ShoppingCart,
} from "lucide-react"

export default function AdminNavigation() {
  const { user, logout } = useAuth()


  return (
    <nav className="sticky top-0 z-50 bg-slate-900 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Admin Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            
            <Link
              href="/admin/users"
              className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/farmers"
              className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Users className="h-4 w-4" />
              <span>Farmers</span>
            </Link>
            <Link
              href="/admin/products"
              className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Package className="h-4 w-4" />
              <span>Products</span>
            </Link>
            <Link
              href="/admin/equipment"
              className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Equipment</span>
            </Link>
            <Link
              href="/admin/orders"
              className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Orders</span>
            </Link>


          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <User className="h-5 w-5 mr-1" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile/new-profile">Profile</Link>
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
                <Button variant="ghost" size="sm" className="md:hidden text-slate-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-slate-900 text-white">
                <div className="flex flex-col space-y-4 mt-8">
                  
                  <Link href="/admin/users" className="text-lg font-medium flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </Link>
                  <Link href="/admin/farmers" className="text-lg font-medium flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Farmers</span>
                  </Link>
                  <Link href="/admin/products" className="text-lg font-medium flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Products</span>
                  </Link>
                  <Link href="/admin/orders" className="text-lg font-medium flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  <Link href="/admin/equipment" className="text-lg font-medium flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Equipment</span>
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
