import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Here you can make calls to Microsoft Graph API or your own backend services
    // using the validated token
    return NextResponse.json({
      message: "Protected API route working",
      status: "authenticated"
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}