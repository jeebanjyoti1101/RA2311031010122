"use client";

import { createTheme, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export function MuiProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  // Load preferred theme from local storage
  useEffect(() => {
    const saved = localStorage.getItem("app-theme-mode");
    if (saved === "dark") setMode("dark");
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("app-theme-mode", next);
      return next;
    });
  };

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#0284C7", light: "#38BDF8", dark: "#0369A1", contrastText: "#fff" }, // Healthcare Blue
                secondary: { main: "#0EA5E9" }, // Sky Blue
                background: { default: "#F0F9FF", paper: "#FFFFFF" }, // Soft blue tint background
                text: { primary: "#0F172A", secondary: "#475569" },
                divider: "#E2E8F0",
              }
            : {
                primary: { main: "#D32F2F", light: "#FF6659", dark: "#9A0000", contrastText: "#FFFFFF" }, // Red accent for dark mode
                secondary: { main: "#B71C1C" },
                background: { default: "#000000", paper: "#0B0B0B" }, // True black background
                text: { primary: "#FFFFFF", secondary: "#BFC7CD" },
                divider: "#1F2933",
              }),
        },
        typography: {
          fontFamily: '"Inter", "Segoe UI", sans-serif',
          h5: {
            fontFamily: '"Outfit", "Segoe UI", sans-serif',
            fontWeight: 700,
            letterSpacing: "-0.02em",
          },
          h6: {
            fontFamily: '"Outfit", "Segoe UI", sans-serif',
            fontWeight: 700,
            letterSpacing: "-0.01em",
          },
          button: {
            fontWeight: 600,
          },
          body1: {
            color: mode === "light" ? "#334155" : "#E2E8F0",
          },
          body2: {
            color: mode === "light" ? "#64748B" : "#94A3B8",
          }
        },
        shape: {
          borderRadius: 12, // Slightly less rounded for a more professional/medical feel
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                boxShadow: mode === "light"
                  ? "0px 2px 4px rgba(2, 132, 199, 0.04), 0px 4px 12px rgba(2, 132, 199, 0.02)"
                  : "0px 2px 10px rgba(0,0,0,0.7)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                backgroundImage: "none",
                transition: "all 0.2s ease",
              },
              contained: {
                boxShadow: "none",
                "&:hover": {
                  boxShadow: mode === "light" ? "0px 4px 12px rgba(2, 132, 199, 0.2)" : "0px 6px 18px rgba(211,47,47,0.24)",
                  transform: "translateY(-1px)",
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                borderRadius: "6px",
                backgroundImage: "none",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                boxShadow: mode === "light" ? "0px 4px 20px rgba(15, 23, 42, 0.02)" : "none",
                border: mode === "dark" ? "1px solid #111827" : undefined,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
