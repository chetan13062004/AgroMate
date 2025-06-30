"use client"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useRentalCart } from "@/contexts/rental-cart-context"
import { useWishlist } from "@/contexts/WishlistContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Menu,
  ShoppingCart,
  Package,
  Tractor,
  Heart,
  LogOut,
  Search,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function BuyerNavigation() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: rentalCount } = useRentalCart()
  const { wishlist } = useWishlist()


  return (
    <nav className="sticky top-0 z-50 bg-blue-600 shadow-lg border-b border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Buyer Logo */}
          <Link href="/buyer/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-white">FreshMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
<Link
              href="/buyer/dashboard"
              className="text-blue-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Package className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/products"
              className="text-blue-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Browse</span>
            </Link>
            <Link
              href="/wishlist"
              className="text-blue-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
            </Link>
            <Link
              href="/rentals"
              className="text-blue-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Tractor className="h-4 w-4" />
              <span>Rentals</span>
            </Link>
            <Link
              href="/orders"
              className="text-blue-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </Link>
            <Link
              href="/rent-history"
              className="text-blue-100 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Tractor className="h-4 w-4" />
              <span>Rent History</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">


            {/* Wishlist */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-700" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-pink-500">
                      {wishlist.length}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>

            {/* Rental Cart */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-700" asChild>
                <Link href="/rent-cart">
                  <Tractor className="h-5 w-5" />
                  {rentalCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-500">
                      {rentalCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>

            {/* Cart */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-700" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>

            {/* Buyer Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white">
                  <User className="h-5 w-5 mr-1" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile/new-profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Order History</Link>
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
                <Button variant="ghost" size="sm" className="md:hidden text-blue-100">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-blue-600 text-white">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/buyer/dashboard" className="text-lg font-medium flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/products" className="text-lg font-medium flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Browse Products</span>
                  </Link>
                  <Link href="/orders" className="text-lg font-medium flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>
                  <Link href="/rentals" className="text-lg font-medium flex items-center space-x-2">
                    <Tractor className="h-5 w-5" />
                    <span>Rentals</span>
                  </Link>
                  <Link href="/rentals" className="text-lg font-medium flex items-center space-x-2">
                    <Tractor className="h-5 w-5" />
                    <span>Rentals</span>
                  </Link>
                  <Link href="/rent-history" className="text-lg font-medium flex items-center space-x-2">
                    <Tractor className="h-5 w-5" />
                    <span>Rent History</span>
                  </Link>
                  <Link href="/wishlist" className="text-lg font-medium flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
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
