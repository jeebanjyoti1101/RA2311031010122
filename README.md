# CampusNotify (Frontend)

This is the frontend for a simple campus notifications app built with Next.js and Material UI. It shows a feed of notifications and a priority inbox that surfaces the most important items first.

Quick start

```bash
cd notification_app_fe
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

What you'll find

- `/` — All notifications: browse, filter by type, and mark as viewed.
- `/priority` — Priority inbox: shows the top N notifications by importance and recency.

Authentication

The app uses a session token stored in the browser (sessionStorage). If a valid token is present the app will use it; otherwise you'll see the login form to obtain a token.

Logging

Client-side events are sent to the logging endpoint using the `logging_middleware` module.

Priority scoring (brief)

Higher weight means higher priority: Placement > Result > Event.

If you want a deeper description (how priority is computed, API details, or deployment steps) tell me and I'll expand this file.

