"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  CreditCard,
  MapPin,
  Clock,
  Shield,
  AlertCircle,
  Truck,
  Package,
  CheckCircle,
  Gift,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Swal from "sweetalert2"

interface PaymentMethod {
  id: string
  name: string
  type: "cod" | "wallet"
  icon: string
  fee: number
  description: string
  available: boolean
  offers?: string[]
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    type: "cod",
    icon: "package",
    fee: 0,
    description: "Pay when you receive your order",
    available: true,
  },
  {
    id: "wallet",
    name: "Wallet",
    type: "wallet",
    icon: "wallet",
    fee: 0,
    description: "Pay using your wallet balance",
    available: false,
  },
]

const deliverySlots = [
  { id: "morning", label: "Morning (8 AM - 12 PM)", available: true, fee: 0 },
  { id: "afternoon", label: "Afternoon (12 PM - 4 PM)", available: true, fee: 0 },
  { id: "evening", label: "Evening (4 PM - 8 PM)", available: false, fee: 20 },
  { id: "express", label: "Express (Within 2 hours)", available: true, fee: 50 },
]

export default function CheckoutPage() {
  const { items, total, clearCart, checkout } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [selectedPayment, setSelectedPayment] = useState("cod")
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [deliverySlot, setDeliverySlot] = useState("morning")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [saveAddress, setSaveAddress] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const [paymentError, setPaymentError] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Review

  const deliveryFee = total > 500 ? 0 : 50
  const selectedSlot = deliverySlots.find((slot) => slot.id === deliverySlot)
  const slotFee = selectedSlot?.fee || 0
  const selectedPaymentMethod = paymentMethods.find((p) => p.id === selectedPayment)
  const paymentFee = selectedPaymentMethod?.fee || 0
  const subtotal = total
  const taxes = Math.round(subtotal * 0.05) // 5% tax
  const finalTotal = subtotal + deliveryFee + slotFee + paymentFee + taxes - discount

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const handleAddressChange = (field: string, value: string) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (stepNumber: number) => {
    if (stepNumber === 1) {
      if (
        !deliveryAddress.name ||
        !deliveryAddress.phone ||
        !deliveryAddress.email ||
        !deliveryAddress.address ||
        !deliveryAddress.city ||
        !deliveryAddress.state ||
        !deliveryAddress.pincode
      ) {
        setError("Please fill in all required address fields")
        return false
      }
    }
    if (stepNumber === 3) {
      if (!agreeTerms) {
        setError("Please agree to the terms and conditions")
        return false
      }
    }
    setError("")
    return true
  }

  const applyPromoCode = () => {
    const validCodes = {
      FRESH10: subtotal * 0.1,
      SAVE50: 50,
      NEWUSER: subtotal * 0.15,
      FARMER20: subtotal * 0.2,
    }

    if (validCodes[promoCode as keyof typeof validCodes]) {
      setDiscount(validCodes[promoCode as keyof typeof validCodes])
      setError("")
    } else {
      setError("Invalid promo code")
    }
  }

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true)
      setError("")
      setPaymentError("")
      
      const order = await checkout()
      clearCart()
      
      await Swal.fire({
        icon: "success",
        title: "Order Confirmed",
        text: "Your order has been placed successfully!",
        confirmButtonColor: "#22c55e",
      })
      
      router.push(`/order-success?orderId=${order._id}`)
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentError(
        error instanceof Error ? error.message : "Failed to process payment"
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add items to your cart to proceed with checkout</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/cart">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {stepNumber === 1 && "Address"}
                  {stepNumber === 2 && "Payment"}
                  {stepNumber === 3 && "Review"}
                </span>
                {stepNumber < 3 && <div className="w-8 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {paymentError && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{paymentError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={deliveryAddress.name}
                        onChange={(e) => handleAddressChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={deliveryAddress.phone}
                        onChange={(e) => handleAddressChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={deliveryAddress.email}
                      onChange={(e) => handleAddressChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      value={deliveryAddress.address}
                      onChange={(e) => handleAddressChange("address", e.target.value)}
                      placeholder="House/Flat No., Street, Area"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      value={deliveryAddress.landmark}
                      onChange={(e) => handleAddressChange("landmark", e.target.value)}
                      placeholder="Near landmark for easy delivery"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={deliveryAddress.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={deliveryAddress.state}
                        onValueChange={(value) => handleAddressChange("state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="haryana">Haryana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={deliveryAddress.pincode}
                        onChange={(e) => handleAddressChange("pincode", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
  id="saveAddress"
  checked={saveAddress}
  onCheckedChange={(checked) => setSaveAddress(checked === true)}
/>
                    <Label htmlFor="saveAddress">Save this address for future orders</Label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        if (validateStep(1)) setStep(2)
                      }}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Delivery Slot */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Delivery Time Slot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={deliverySlot} onValueChange={setDeliverySlot}>
                      {deliverySlots.map((slot) => (
                        <div key={slot.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={slot.id} disabled={!slot.available} />
                          <Label className={`flex-1 ${!slot.available ? "text-gray-400" : ""}`}>
                            <div className="flex justify-between items-center">
                              <span>{slot.label}</span>
                              <div className="flex items-center space-x-2">
                                {slot.fee > 0 && <Badge variant="outline">+₹{slot.fee}</Badge>}
                                {!slot.available && <Badge variant="destructive">Not Available</Badge>}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPayment === method.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => method.available && setSelectedPayment(method.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={selectedPayment === method.id}
                              disabled={!method.available}
                              onChange={() => setSelectedPayment(method.id)}
                              className="text-green-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">{method.icon}</span>
                                <Label className="font-medium cursor-pointer">{method.name}</Label>
                                {method.fee > 0 && <Badge variant="outline">+₹{method.fee}</Badge>}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                              {method.offers && (
                                <div className="mt-2 space-y-1">
                                  {method.offers.map((offer, index) => (
                                    <div key={index} className="flex items-center text-xs text-green-600">
                                      <Gift className="h-3 w-3 mr-1" />
                                      {offer}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back to Address
                  </Button>
                  <Button onClick={() => setStep(3)}>Continue to Review</Button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Order Review */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Delivery Address Summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">
                        {deliveryAddress.name} • {deliveryAddress.phone}
                        <br />
                        {deliveryAddress.address}
                        {deliveryAddress.landmark && `, ${deliveryAddress.landmark}`}
                        <br />
                        {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
                      </p>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{selectedPaymentMethod?.icon}</span>
                        <span className="text-sm">{selectedPaymentMethod?.name}</span>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any special delivery instructions..."
                        rows={3}
                      />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked === true)} />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-green-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-green-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back to Payment
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !agreeTerms}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? "Processing..." : `Place Order - ₹${finalTotal.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Summary</span>
                  <Badge variant="outline">{items.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg?height=50&width=50"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} {item.unit} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Promo Code */}
                <div className="space-y-2">
                  <Label>Promo Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Try: FRESH10, SAVE50, NEWUSER</p>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {slotFee > 0 && (
                    <div className="flex justify-between">
                      <span>Express Delivery</span>
                      <span>₹{slotFee}</span>
                    </div>
                  )}
                  {paymentFee > 0 && (
                    <div className="flex justify-between">
                      <span>Payment Fee</span>
                      <span>₹{paymentFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxes (5%)</span>
                    <span>₹{taxes}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>

                {/* Delivery Info */}
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-800">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Estimated delivery: {selectedSlot?.id === "express" ? "Within 2 hours" : "Tomorrow"}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-blue-800">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Secure & Encrypted Payment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
