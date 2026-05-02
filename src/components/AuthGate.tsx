"use client";

import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticating, authError, authenticate } = useAuth();
  const [form, setForm] = useState({
    email: "",
    name: "",
    rollNo: "",
    accessCode: "",
    clientID: "",
    clientSecret: "",
  });

  if (token) return <>{children}</>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F0F4F8",
        px: 2,
      }}
    >
      <Card sx={{ p: 4, width: 440, maxWidth: "100%", borderRadius: 3, border: "1px solid #e0e0e0" }} elevation={0}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          CampusNotify Login
        </Typography>
        {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField size="small" label="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <TextField size="small" label="Full Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <TextField size="small" label="Roll Number" value={form.rollNo} onChange={(e) => setForm((p) => ({ ...p, rollNo: e.target.value }))} />
          <TextField size="small" label="Access Code" value={form.accessCode} onChange={(e) => setForm((p) => ({ ...p, accessCode: e.target.value }))} />
          <TextField size="small" label="Client ID" value={form.clientID} onChange={(e) => setForm((p) => ({ ...p, clientID: e.target.value }))} />
          <TextField size="small" label="Client Secret" type="password" value={form.clientSecret} onChange={(e) => setForm((p) => ({ ...p, clientSecret: e.target.value }))} />
          <Button variant="contained" size="large" disabled={isAuthenticating} onClick={() => authenticate(form)}>
            {isAuthenticating ? <CircularProgress size={22} color="inherit" /> : "Login"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
