"use client";

import EventIcon from "@mui/icons-material/Event";
import RefreshIcon from "@mui/icons-material/Refresh";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import WorkIcon from "@mui/icons-material/Work";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Log } from "../../../logging_middleware/logger";
import { AuthGate } from "../../components/AuthGate";
import { ErrorState } from "../../components/ErrorState";
import { Navbar } from "../../components/Navbar";
import { NotificationCard } from "../../components/NotificationCard";
import { useNotifications } from "../../hooks/useNotifications";
import { useViewedNotifications } from "../../hooks/useViewedNotifications";
import { getTopN } from "../../utils/notifications";

const PAGE_SIZE = 10;
const N_OPTIONS = [10, 15, 20];

const STAT_CARDS = [
  {
    label: "Placement",
    weight: 3,
    icon: <WorkIcon fontSize="small" />,
    color: "#1565C0",
    bg: "#E3F2FD",
  },
  {
    label: "Result",
    weight: 2,
    icon: <SchoolIcon fontSize="small" />,
    color: "#2E7D32",
    bg: "#E8F5E9",
  },
  {
    label: "Event",
    weight: 1,
    icon: <EventIcon fontSize="small" />,
    color: "#E65100",
    bg: "#FFF3E0",
  },
];

export default function PriorityInboxPage() {
  const [topN, setTopN] = useState(10);
  const { notifications, loading, error, refetch } = useNotifications({
    limit: PAGE_SIZE,
    page: 1,
    notification_type: "All",
    fetchAllPages: true,
  });

  const { isViewed, markAsViewed } = useViewedNotifications();

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page mounted");
  }, []);

  const priorityNotifications = useMemo(() => {
    if (notifications.length === 0) return [];
    const result = getTopN(notifications, topN);
    Log(
      "frontend",
      "info",
      "utils",
      `Priority inbox computed: top ${topN} selected from ${notifications.length} notifications`
    );
    return result;
  }, [notifications, topN]);

  const handleNChange = async (newN: number) => {
    setTopN(newN);
    await Log("frontend", "info", "component", `Priority inbox N changed to: ${newN}`);
  };

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { Placement: 0, Result: 0, Event: 0 };
    priorityNotifications.forEach((n) => {
      counts[n.Type] = (counts[n.Type] ?? 0) + 1;
    });
    return counts;
  }, [priorityNotifications]);

  const newCount = priorityNotifications.filter((n) => !isViewed(n.ID)).length;

  return (
    <AuthGate>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />

        <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <StarIcon sx={{ color: "#F59E0B", fontSize: 28 }} />
              <Typography variant="h5" fontWeight={700}>
                Priority Inbox
              </Typography>
              {newCount > 0 && (
                <Chip
                  label={`${newCount} new`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Showing top {topN} notifications sorted by type priority, then recency
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0px 2px 8px rgba(15, 23, 42, 0.04)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  display="block"
                  mb={0.75}
                >
                  Priority weights
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {STAT_CARDS.map((s) => (
                    <Chip
                      key={s.label}
                      icon={React.cloneElement(s.icon, {
                        style: { color: s.color },
                      })}
                      label={`${s.label} ×${s.weight}`}
                      size="small"
                      sx={{
                        bgcolor: s.bg,
                        color: s.color,
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Show top
                </Typography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select value={topN} onChange={(e) => handleNChange(Number(e.target.value))}>
                    {N_OPTIONS.map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary">
                  notifications
                </Typography>
              </Box>

              <Button
                startIcon={<RefreshIcon />}
                size="small"
                variant="outlined"
                onClick={() => {
                  refetch();
                  Log("frontend", "info", "component", "Priority inbox refreshed by user");
                }}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Refresh
              </Button>
            </Box>

            {priorityNotifications.length > 0 && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", gap: 2 }}>
                  {STAT_CARDS.map((s) => (
                    <Box key={s.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {React.cloneElement(s.icon, {
                        style: { color: s.color, fontSize: 14 },
                      })}
                      <Typography variant="caption" color="text.secondary">
                        {typeCounts[s.label] ?? 0} {s.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Paper>

          <Divider sx={{ mb: 2.5 }} />

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

          {!loading && !error && priorityNotifications.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <StarIcon sx={{ fontSize: 48, color: "grey.300", mb: 1 }} />
              <Typography color="text.secondary">No notifications available yet.</Typography>
            </Box>
          )}

          {!loading && !error && (
            <Stack spacing={0}>
              {priorityNotifications.map((notif) => (
                <NotificationCard
                  key={notif.ID}
                  notification={notif}
                  isViewed={isViewed(notif.ID)}
                  onView={markAsViewed}
                  rank={notif.rank}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </AuthGate>
  );
}
