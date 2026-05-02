"use client";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import {
    AppBar,
    Box,
    Button,
    Chip,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Log } from "../../logging_middleware/logger";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "./MuiProvider";

export function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  const handleLogout = async () => {
    await Log("frontend", "info", "component", "User clicked logout from navbar");
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.05)",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 2px 6px rgba(211,47,47,0.16)",
            }}
          >
            <NotificationsIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} fontSize={18} color="primary.main">
            CampusNotify
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<NotificationsIcon />}
            size="small"
            variant={pathname === "/" ? "contained" : "text"}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            onClick={() =>
              Log("frontend", "info", "component", "Navigated to All Notifications page")
            }
          >
            All Notifications
          </Button>

          <Button
            component={Link}
            href="/priority"
            startIcon={<StarIcon />}
            size="small"
            variant={pathname === "/priority" ? "contained" : "text"}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            onClick={() =>
              Log("frontend", "info", "component", "Navigated to Priority Inbox page")
            }
          >
            Priority Inbox
            <Chip
              label="TOP N"
              size="small"
              sx={{
                ml: 0.5,
                height: 16,
                fontSize: 9,
                fontWeight: 700,
                bgcolor: pathname === "/priority" ? "rgba(255,255,255,0.08)" : "primary.main",
                color: "white",
              }}
            />
          </Button>
        </Box>

        {/* Theme Toggle */}
        <IconButton onClick={toggleTheme} sx={{ color: "text.secondary", ml: 1 }}>
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        {/* Logout */}
        <Button
          startIcon={<LogoutIcon />}
          size="small"
          color="inherit"
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            color: "text.secondary",
            "&:hover": { color: "error.main" },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
