export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface PriorityNotification extends Notification {
  score: number;
  rank: number;
}

// Weight map: Placement > Result > Event
const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const TYPE_PRIORITY: Record<NotificationType, number> = {
  Placement: 1,
  Result: 2,
  Event: 3,
};

/**
 * Compute a priority score for a notification.
 * score = typeWeight × recencyFactor
 * recencyFactor = 1 / max(secondsSinceNow, 1)  — newer = higher score
 */
export function computeScore(notification: Notification): number {
  const weight = TYPE_WEIGHT[notification.Type] ?? 1;
  const then = new Date(notification.Timestamp).getTime();
  const nowMs = Date.now();
  const secondsAgo = Math.max((nowMs - then) / 1000, 1);
  const recencyFactor = 1 / secondsAgo;
  return weight * recencyFactor;
}

export function comparePriorityNotifications(
  left: Notification,
  right: Notification
): number {
  const leftType = TYPE_PRIORITY[left.Type] ?? Number.MAX_SAFE_INTEGER;
  const rightType = TYPE_PRIORITY[right.Type] ?? Number.MAX_SAFE_INTEGER;

  if (leftType !== rightType) {
    return leftType - rightType;
  }

  const leftTime = new Date(left.Timestamp).getTime();
  const rightTime = new Date(right.Timestamp).getTime();

  return rightTime - leftTime;
}

/**
 * Return top-N notifications sorted by priority score descending.
 * Uses a simple sort+slice (efficient enough for this dataset size).
 * At scale, a min-heap would maintain O(log N) insertion.
 */
export function getTopN(
  notifications: Notification[],
  n: number
): PriorityNotification[] {
  const scored = [...notifications]
    .sort(comparePriorityNotifications)
    .map((notif) => ({
      ...notif,
      score: computeScore(notif),
      rank: 0,
    }));

  return scored.slice(0, n).map((notif, idx) => ({
    ...notif,
    rank: idx + 1,
  }));
}
