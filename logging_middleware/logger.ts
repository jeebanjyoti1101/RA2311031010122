import { LogLevel, Stack, Package } from "./types";

const LOG_API_URL = "/api/logs";

/**
 * Log — reusable logging function.
 */
export async function Log(
  stack: Stack,
  level: LogLevel,
  pkg: Package,
  message: string
): Promise<void> {
  // Read token fresh each call
  const token = typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;

  if (!token) {
    return; // silently skip — no token yet
  }

  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    if (!response.ok) {
      // silently fail — logging must never crash the app
    }
  } catch {
    // network error — silently fail
  }
}
