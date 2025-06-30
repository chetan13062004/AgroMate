import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Create PDF receipt
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setTextColor(34, 139, 34)
    doc.text("FarmFresh Marketplace", 20, 30)

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("PAYMENT RECEIPT", 20, 45)

    // Order Details
    doc.setFontSize(12)
    doc.text(`Receipt No: ${orderData.id}`, 20, 65)
    doc.text(`Date: ${new Date(orderData.createdAt).toLocaleDateString()}`, 20, 75)
    doc.text(`Payment ID: ${orderData.razorpay_payment_id}`, 20, 85)

    // Customer Details
    doc.text("Bill To:", 20, 105)
    doc.text(orderData.deliveryAddress.name, 20, 115)
    doc.text(orderData.deliveryAddress.phone, 20, 125)
    doc.text(orderData.deliveryAddress.address, 20, 135)
    doc.text(
      `${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} - ${orderData.deliveryAddress.pincode}`,
      20,
      145,
    )

    // Items Table Header
    doc.text("Item", 20, 170)
    doc.text("Qty", 100, 170)
    doc.text("Price", 130, 170)
    doc.text("Total", 160, 170)
    doc.line(20, 175, 190, 175)

    // Items
    let yPos = 185
    orderData.items.forEach((item: any) => {
      doc.text(item.name, 20, yPos)
      doc.text(`${item.quantity} ${item.unit}`, 100, yPos)
      doc.text(`₹${item.price}`, 130, yPos)
      doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 160, yPos)
      yPos += 10
    })

    // Totals
    doc.line(20, yPos + 5, 190, yPos + 5)
    doc.text(`Subtotal: ₹${orderData.subtotal.toFixed(2)}`, 130, yPos + 15)
    doc.text(`Delivery: ₹${orderData.deliveryFee.toFixed(2)}`, 130, yPos + 25)
    doc.text(`Total: ₹${orderData.total.toFixed(2)}`, 130, yPos + 35)

    // Footer
    doc.setFontSize(10)
    doc.text("Thank you for shopping with FarmFresh Marketplace!", 20, yPos + 55)
    doc.text("For support, contact: support@farmfresh.com | +91-9876543210", 20, yPos + 65)

    const pdfBuffer = doc.output("arraybuffer")

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${orderData.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating receipt:", error)
    return NextResponse.json({ success: false, error: "Failed to generate receipt" }, { status: 500 })
  }
}
