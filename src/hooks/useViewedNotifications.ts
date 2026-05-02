"use client";

import { useState, useCallback, useEffect } from "react";
import { Log } from "../../logging_middleware/logger";

const STORAGE_KEY = "viewed_notification_ids";

export function useViewedNotifications() {
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        setViewedIds(new Set(ids));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const markAsViewed = useCallback(async (id: string) => {
    setViewedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }
      return next;
    });
    await Log("frontend", "debug", "state", `Notification marked as viewed: ${id}`);
  }, []);

  const isViewed = useCallback(
    (id: string) => viewedIds.has(id),
    [viewedIds]
  );

  return { viewedIds, markAsViewed, isViewed };
}
