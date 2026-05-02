import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const TARGET_URL = "http://20.207.122.201/evaluation-service/auth";

  try {
    const body = await request.text();

    const res = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch (err) {
    return NextResponse.json({ error: "Proxy error" }, { status: 502 });
  }
}
