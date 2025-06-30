import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { RentalCartProvider } from "@/contexts/rental-cart-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { EnhancedChatProvider } from "@/contexts/enhanced-chat-context"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import RoleBasedNavigation from "@/components/role-based-navigation"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FarmMarket - Direct Farm to Consumer Marketplace",
  description: "Connect directly with local farmers and buy fresh, organic produce",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <RentalCartProvider>
              <NotificationProvider>
                <EnhancedChatProvider>
                  <WishlistProvider>
                    <div className="min-h-screen flex flex-col">
                      <RoleBasedNavigation />
                      <main className="flex-1">{children}</main>
                      <Footer />
                      <nav>
                        <a href="/marketing" className="mr-4">Marketing Tool</a>
                      </nav>
                    </div>
                    <Toaster />
                  </WishlistProvider>
                </EnhancedChatProvider>
              </NotificationProvider>
              </RentalCartProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
