"use client";

import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import {
    Badge,
    Box,
    Card,
    CardActionArea,
    Chip,
    Typography,
} from "@mui/material";
import { Log } from "../../logging_middleware/logger";
import { Notification } from "../utils/notifications";

interface NotificationCardProps {
  notification: Notification;
  isViewed: boolean;
  onView: (id: string) => void;
  rank?: number;
}

const TYPE_META = {
  Placement: {
    color: "#1565C0" as const,
    bg: "#E3F2FD" as const,
    icon: <WorkIcon fontSize="small" />,
  },
  Result: {
    color: "#2E7D32" as const,
    bg: "#E8F5E9" as const,
    icon: <SchoolIcon fontSize="small" />,
  },
  Event: {
    color: "#E65100" as const,
    bg: "#FFF3E0" as const,
    icon: <EventIcon fontSize="small" />,
  },
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(ts: string): string {
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationCard({
  notification,
  isViewed,
  onView,
  rank,
}: NotificationCardProps) {
  const meta = TYPE_META[notification.Type] ?? TYPE_META.Event;

  const handleClick = async () => {
    if (!isViewed) {
      onView(notification.ID);
      await Log(
        "frontend",
        "info",
        "component",
        `Notification opened: ${notification.ID} type=${notification.Type}`
      );
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: isViewed ? "divider" : "primary.light",
        borderRadius: 3,
        mb: 1.5,
        opacity: isViewed ? 0.75 : 1,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        bgcolor: isViewed ? "background.default" : "background.paper",
        "&:hover": {
          borderColor: isViewed ? "grey.400" : "primary.main",
          transform: "translateY(-2px)",
          boxShadow: isViewed ? "0 4px 12px rgba(15, 23, 42, 0.04)" : "0 4px 16px rgba(2, 132, 199, 0.1)",
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ p: 0 }}>
        <Box sx={{ display: "flex", alignItems: "stretch" }}>
          {/* Left accent bar */}
          <Box
            sx={{
              width: 5,
              borderTopLeftRadius: "inherit",
              borderBottomLeftRadius: "inherit",
              bgcolor: isViewed ? "divider" : meta.color,
              flexShrink: 0,
            }}
          />

          <Box sx={{ p: 2, flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              {/* Rank badge for priority inbox */}
              {rank !== undefined && (
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: rank <= 3 ? "#FFD700" : "grey.200",
                    color: rank <= 3 ? "#333" : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {rank}
                </Box>
              )}

              <Chip
                icon={meta.icon}
                label={notification.Type}
                size="small"
                sx={{
                  bgcolor: meta.bg,
                  color: meta.color,
                  fontWeight: 600,
                  fontSize: 11,
                  "& .MuiChip-icon": { color: meta.color },
                }}
              />

              {!isViewed && (
                <Badge
                  variant="dot"
                  color="error"
                  sx={{ ml: 0.5 }}
                  componentsProps={{ badge: { style: { top: 4, right: -4 } } }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "error.main",
                      color: "error.contrastText",
                      px: 0.8,
                      py: 0.2,
                      borderRadius: 1,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      boxShadow: "0px 2px 8px rgba(211,47,47,0.22)",
                    }}
                  >
                    NEW
                  </Typography>
                </Badge>
              )}

              <Typography
                variant="caption"
                sx={{ ml: "auto", color: "text.disabled", fontSize: 11 }}
              >
                {timeAgo(notification.Timestamp)}
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontWeight: isViewed ? 400 : 600,
                color: isViewed ? "text.secondary" : "text.primary",
                textTransform: "capitalize",
                mt: 0.5,
                mb: 0.25,
                fontSize: 14,
              }}
            >
              {notification.Message}
            </Typography>

            <Typography variant="caption" color="text.disabled">
              {formatTimestamp(notification.Timestamp)}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
