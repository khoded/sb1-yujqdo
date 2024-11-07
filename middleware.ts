import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  // Allow access to login page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/api")) {
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      // Verify JWT token
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY)
      );
      
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/login"],
};