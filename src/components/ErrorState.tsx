"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

export function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
        px: 3,
        textAlign: "center",
        bgcolor: "background.paper",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "primary.light",
          opacity: 0.15,
          position: "absolute",
        }}
      />
      <ErrorOutlineIcon sx={{ fontSize: 40, color: "primary.main", mb: 2, position: "relative" }} />
      <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
        Connection Error
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 4 }}>
        {error}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<RefreshIcon />}
        onClick={onRetry}
        sx={{ px: 4, py: 1.25, borderRadius: 2, boxShadow: "none", "&:hover": { boxShadow: "0px 4px 12px rgba(2, 132, 199, 0.2)" } }}
      >
        Try Again
      </Button>
    </Box>
  );
}
