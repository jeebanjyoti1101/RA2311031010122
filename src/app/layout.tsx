import type { Metadata } from "next";
import { MuiProvider } from "../components/MuiProvider";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "CampusNotify",
  description: "Campus Notifications Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MuiProvider>
          <AuthProvider>{children}</AuthProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
