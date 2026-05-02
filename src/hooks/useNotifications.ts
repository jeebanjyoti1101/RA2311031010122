"use client";

import { useCallback, useEffect, useState } from "react";
import { Log } from "../../logging_middleware/logger";
import { Notification, NotificationType } from "../utils/notifications";

interface UseNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | "All";
  fetchAllPages?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNotifications({
  limit = 50,
  page = 1,
  notification_type = "All",
  fetchAllPages = false,
}: UseNotificationsParams = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    // Always read token fresh from sessionStorage at call time
    const token = typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;

    if (!token) {
      setError("Not authenticated. Please wait...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestedLimit = Math.min(Math.max(limit, 5), 10);
      const loadPage = async (pageNumber: number) => {
        const params = new URLSearchParams();
        params.set("limit", String(requestedLimit));
        params.set("page", String(pageNumber));
        if (notification_type && notification_type !== "All") {
          params.set("notification_type", notification_type);
        }

        const res = await fetch(`/api/notifications?${params.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to load notifications (${res.status}).`);
        }

        const data = await res.json();
        return (data.notifications ?? []) as Notification[];
      };

      if (fetchAllPages) {
        const collected: Notification[] = [];
        let currentPage = page;

        while (true) {
          const batch = await loadPage(currentPage);
          collected.push(...batch);

          if (batch.length < requestedLimit) {
            break;
          }

          currentPage += 1;
          if (currentPage > 50) {
            break;
          }
        }

        setNotifications(collected);
        await Log("frontend", "info", "api", `Notifications loaded: ${collected.length} items`);
      } else {
        const notifs = await loadPage(page);
        setNotifications(notifs);
        await Log("frontend", "info", "api", `Notifications loaded: ${notifs.length} items`);
      }
    } catch (err) {
      setError("Network error. Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [limit, page, notification_type, fetchAllPages]);

  useEffect(() => {
    // Poll until token is available, then fetch
    let attempts = 0;
    const tryFetch = () => {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
      if (token) {
        fetchNotifications();
      } else if (attempts < 20) {
        attempts++;
        setTimeout(tryFetch, 300); // retry every 300ms, up to 6 seconds
      } else {
        setError("Authentication timed out. Please refresh.");
      }
    };
    tryFetch();
  }, [fetchNotifications]);

  return { notifications, loading, error, refetch: fetchNotifications };
}
