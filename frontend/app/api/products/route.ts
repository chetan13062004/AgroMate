import { NextResponse } from 'next/server';

// Proxy to backend API to fetch active products
export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${backendUrl}/api/products`, {
      // Include credentials (cookies) if your backend requires authentication; adjust as needed.
      // credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Backend error' }, { status: response.status });
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Unable to fetch products from backend' }, { status: 500 });
  }
}
