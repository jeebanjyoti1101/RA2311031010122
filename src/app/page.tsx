"use client";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Log } from "../../logging_middleware/logger";
import { AuthGate } from "../components/AuthGate";
import { ErrorState } from "../components/ErrorState";
import { Navbar } from "../components/Navbar";
import { NotificationCard } from "../components/NotificationCard";
import { useNotifications } from "../hooks/useNotifications";
import { useViewedNotifications } from "../hooks/useViewedNotifications";
import { Notification, NotificationType } from "../utils/notifications";

const PAGE_SIZE = 10;
type FilterType = NotificationType | "All";

export default function AllNotificationsPage() {
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [page, setPage] = useState(1);
  const [feedNotifications, setFeedNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { notifications, loading, error, refetch } = useNotifications({
    limit: PAGE_SIZE,
    page,
    notification_type: filterType,
  });

  const { isViewed, markAsViewed } = useViewedNotifications();

  // Log page mount
  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page mounted");
  }, []);

  const handleFilterChange = async (
    _: React.MouseEvent<HTMLElement>,
    newType: FilterType | null
  ) => {
    const next = newType ?? "All";
    setFilterType(next);
    setPage(1);
    setFeedNotifications([]);
    setHasMore(true);
    await Log(
      "frontend",
      "info",
      "component",
      `Notification filter changed to: ${next}`
    );
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await Log("frontend", "debug", "component", `Load more requested for page ${nextPage}`);
  };

  useEffect(() => {
    if (page === 1) {
      setFeedNotifications(notifications);
    } else {
      setFeedNotifications((current) => {
        const merged = new Map(current.map((notif) => [notif.ID, notif]));
        notifications.forEach((notif) => merged.set(notif.ID, notif));
        return Array.from(merged.values());
      });
    }

    setHasMore(notifications.length === PAGE_SIZE);
  }, [notifications, page]);

  const visibleNotifications = useMemo(() => feedNotifications, [feedNotifications]);
  const newCount = visibleNotifications.filter((n) => !isViewed(n.ID)).length;

  return (
    <AuthGate>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />

        <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 3 }}>
          {/* Page header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" fontWeight={700}>
                All Notifications
              </Typography>
              {newCount > 0 && (
                <Chip
                  label={`${newCount} new`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Showing {visibleNotifications.length} notifications
            </Typography>
          </Box>

          {/* Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 2.5,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0px 2px 8px rgba(15, 23, 42, 0.04)",
            }}
          >
            {/* Type filter */}
            <ToggleButtonGroup
              value={filterType}
              exclusive
              onChange={handleFilterChange}
              size="small"
              sx={{ flexWrap: "wrap" }}
            >
              {(["All", "Placement", "Result", "Event"] as FilterType[]).map(
                (type) => (
                  <ToggleButton
                    key={type}
                    value={type}
                    sx={{
                      px: 2,
                      py: 0.5,
                      fontWeight: 600,
                      fontSize: 12,
                      textTransform: "none",
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                    }}
                  >
                    {type}
                  </ToggleButton>
                )
              )}
            </ToggleButtonGroup>

            <Box sx={{ flex: 1 }} />

            {/* Refresh */}
            <Button
              startIcon={<RefreshIcon />}
              size="small"
              variant="outlined"
              onClick={() => {
                refetch();
                Log("frontend", "info", "component", "Notifications refreshed by user");
              }}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Refresh
            </Button>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* States */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box sx={{ mb: 3 }}>
              <ErrorState error={error} onRetry={refetch} />
            </Box>
          )}

          {!loading && !error && notifications.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <DoneAllIcon sx={{ fontSize: 48, color: "grey.300", mb: 1 }} />
              <Typography color="text.secondary">
                No notifications found for this filter.
              </Typography>
            </Box>
          )}

          {/* Notification list */}
          {!loading && !error && (
            <Stack spacing={0}>
              {visibleNotifications.map((notif) => (
                <NotificationCard
                  key={notif.ID}
                  notification={notif}
                  isViewed={isViewed(notif.ID)}
                  onView={markAsViewed}
                />
              ))}
            </Stack>
          )}

          {!loading && !error && visibleNotifications.length > 0 && hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loading}
                sx={{ borderRadius: 999, px: 3, textTransform: "none", fontWeight: 600 }}
              >
                Load more
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </AuthGate>
  );
}
