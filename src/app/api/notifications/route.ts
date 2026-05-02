import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const TARGET = "http://20.207.122.201/evaluation-service/notifications";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Read token from Authorization header sent by the client
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "No authorization header" }, { status: 401 });
  }

  try {
    const res = await fetch(`${TARGET}?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      cache: "no-store",
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    console.error("Notifications proxy error:", err);
    return NextResponse.json({ error: "Proxy error", detail: String(err) }, { status: 502 });
  }
}
