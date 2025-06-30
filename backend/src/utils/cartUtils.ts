export function calculateDeliveryFee(subtotal: number): number {
  // Free delivery for big orders
  if (subtotal >= 500) return 0;

  // Variable delivery fee: 10% of subtotal, but clamped between 10 and 50
  const fee = Math.floor(subtotal * 0.1);
  return Math.min(50, Math.max(10, fee));
}
