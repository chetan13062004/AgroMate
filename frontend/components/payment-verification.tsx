"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"

interface PaymentVerificationProps {
  orderId: string
  paymentId: string
  onVerificationComplete: (success: boolean, data?: any) => void
}

export function PaymentVerification({ orderId, paymentId, onVerificationComplete }: PaymentVerificationProps) {
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying")
  const [error, setError] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  const verifyPayment = async () => {
    try {
      setStatus("verifying")
      setError("")

      const response = await fetch("/api/payment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentId }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        onVerificationComplete(true, data)
      } else {
        setStatus("failed")
        setError(data.error || "Payment verification failed")
        onVerificationComplete(false)
      }
    } catch (error) {
      setStatus("failed")
      setError("Network error occurred")
      onVerificationComplete(false)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    verifyPayment()
  }

  useEffect(() => {
    verifyPayment()
  }, [])

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Payment Verification</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {status === "verifying" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <p>Verifying your payment...</p>
            <p className="text-sm text-gray-600">Please wait while we confirm your transaction</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <p className="text-green-600 font-medium">Payment Verified Successfully!</p>
            <p className="text-sm text-gray-600">Your order has been confirmed</p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="h-12 w-12 mx-auto text-red-600" />
            <p className="text-red-600 font-medium">Payment Verification Failed</p>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {retryCount < 3 && (
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Verification
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
