import { NextRequest, NextResponse } from 'next/server';

// Proxy to backend API to fetch users, optionally filtered by role
export async function GET(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Get query params from request (e.g. /api/users?role=buyer)
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  const queryString = role ? `?role=${encodeURIComponent(role)}` : '';

  try {
    const response = await fetch(`${backendUrl}/api/admin/users${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.get('cookie') ? { Cookie: req.headers.get('cookie') as string } : {}),
        ...(req.headers.get('authorization') ? { Authorization: req.headers.get('authorization') as string } : {}),
      },
      // credentials: 'include', // Uncomment if backend needs auth cookies
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Backend error' }, { status: response.status });
    }

    const users = await response.json();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Unable to fetch users from backend' }, { status: 500 });
  }
}
