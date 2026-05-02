# Notification System Design

## Stage 1

### Overview

The Priority Inbox feature solves the problem of notification overload by surfacing the top **N** most important unread notifications at any time. Priority is determined by a combination of **notification type weight** and **recency**.

---

### Priority Scoring Formula

Each notification is assigned a score using the following formula:

```
score = typeWeight × recencyFactor

where:
  recencyFactor = 1 / max(secondsSinceTimestamp, 1)
```

**Type weights:**

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

**Rationale:**
- Placement notifications (job/internship opportunities) are the highest priority because missing them has direct career impact.
- Result notifications (exam/project results) are second priority as they affect academic standing.
- Event notifications are lowest priority as they are informational.
- Recency factor ensures that among notifications of the same type, newer ones rank higher.

---

### Finding Top-N Efficiently

**Current approach (sort + slice):**

```typescript
function getTopN(notifications: Notification[], n: number): PriorityNotification[] {
  const scored = notifications.map(n => ({ ...n, score: computeScore(n) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n);
}
```

This is O(m log m) where m = total notifications. Acceptable for the current dataset size.

**At scale — Min-Heap approach:**

As new notifications arrive in a real-time system (WebSocket/SSE), maintaining a sorted array with re-sort on each insert is O(m log m) per insert — inefficient.

A **min-heap of size N** solves this in O(log N) per insertion:

```
Algorithm:
1. Initialize a min-heap of capacity N
2. For each incoming notification:
   a. Compute its score
   b. If heap.size < N → push it
   c. Else if score > heap.min → pop min, push new notification
3. The heap always contains the top-N highest-scored notifications
```

This gives O(log N) per new notification regardless of total notification volume — ideal for a live-updating inbox.

---

### Handling New Notifications Over Time

Since new notifications are continuously arriving, the score of older notifications naturally decreases (recencyFactor shrinks). This means:

- A Placement from 1 hour ago may be outranked by a Result from 5 minutes ago
- The priority list is **recomputed on every fetch or refresh** to reflect the current moment
- In a production system, a WebSocket connection would push new notifications and trigger a heap rebalance in real-time

---

### Read / Unread State

- Viewed notification IDs are persisted in **localStorage** under the key `viewed_notification_ids`
- This distinguishes "new" (never opened) from "read" (previously clicked) without requiring a backend
- New notifications are visually highlighted with a blue accent bar and a "NEW" badge
- In production, read state would be synced to a user-specific backend store

---

### API Used

```
GET http://20.207.122.201/evaluation-service/notifications
  ?limit=100
  &page=1
  &notification_type=All   (optional: Placement | Result | Event)

Authorization: Bearer <token>
```

Response shape:
```json
{
  "notifications": [
    {
      "ID": "uuid",
      "Type": "Placement | Result | Event",
      "Message": "string",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

---

## Stage 2

### Frontend Architecture

The frontend is a **Next.js 14 (App Router)** application written in **TypeScript**, styled with **Material UI v5**.

**Folder structure:**

```
notification_app_fe/
├── logging_middleware/       ← reusable logging module
│   ├── index.ts
│   ├── logger.ts
│   ├── tokenStore.ts
│   └── types.ts
└── src/
    ├── app/
    │   ├── layout.tsx        ← root layout with MUI + Auth providers
    │   ├── page.tsx          ← All Notifications page (/)
    │   └── priority/
    │       └── page.tsx      ← Priority Inbox page (/priority)
    ├── components/
    │   ├── AuthGate.tsx      ← login form, wraps protected pages
    │   ├── Navbar.tsx        ← top navigation bar
    │   ├── NotificationCard.tsx ← individual notification display
    │   └── MuiProvider.tsx   ← MUI theme setup
    ├── context/
    │   └── AuthContext.tsx   ← authentication state + token management
    ├── hooks/
    │   ├── useNotifications.ts     ← fetches from API
    │   └── useViewedNotifications.ts ← localStorage read/unread state
    └── utils/
        └── notifications.ts  ← priority scoring logic
```

**Pages:**

| Route      | Description |
|------------|-------------|
| `/`        | All notifications with type filter (Placement/Result/Event/All), pagination, per-page limit selector, new/read visual distinction |
| `/priority`| Priority inbox showing top-N notifications; user selects N (5/10/15/20); type breakdown stats; rank badges for top 3 |

**Key design decisions:**
- No login/registration UI required — users enter their clientID/clientSecret directly (pre-authorised assumption)
- Auth token stored in `sessionStorage` — persists across page navigation but clears on tab close
- All logging goes through the `Log()` middleware — no `console.log` anywhere
- Error states show MUI Alerts with Retry buttons
- Mobile responsive via MUI's responsive breakpoints
