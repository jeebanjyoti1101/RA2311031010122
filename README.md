# notification_app_fe

Campus Notifications Platform — Frontend (Next.js + Material UI)

## Setup

```bash
cd notification_app_fe
npm install
npm run dev
```

App runs on **http://localhost:3000**

## Pages

| Route | Description |
|-------|-------------|
| `/` | All notifications — filter by type, pagination, new/read state |
| `/priority` | Priority inbox — top N notifications by weight × recency |

## Auth

Authentication is handled in code. The app restores a saved session token when one exists and otherwise attempts the notification fetch flow directly, so there is no separate login page in the UI.

## Logging

All events are logged via `logging_middleware/logger.ts` → POST to the test server log API.
No `console.log` is used anywhere in the application.

## Priority Formula

```
score = typeWeight × (1 / secondsSinceTimestamp)

Placement = 3, Result = 2, Event = 1
```
