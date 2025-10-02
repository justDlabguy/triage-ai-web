import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Triage AI - AI-Powered Healthcare Triage",
  description: "AI-powered healthcare triage system for Nigerian communities. Get instant symptom analysis and find nearby emergency clinics.",
  keywords: ["healthcare", "triage", "AI", "Nigeria", "medical", "emergency", "clinics", "accessibility", "responsive"],
  authors: [{ name: "Triage AI Team" }],
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  robots: "index, follow",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
  openGraph: {
    title: "Triage AI - AI-Powered Healthcare Triage",
    description: "AI-powered healthcare triage system for Nigerian communities",
    type: "website",
    locale: "en_NG",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body 
        className={cn(
          "font-sans antialiased bg-background text-foreground",
          "min-h-screen flex flex-col",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          inter.className
        )}
      >
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log to monitoring service in production
            console.error('Global error boundary caught error:', error, errorInfo);
          }}
        >
          <AuthProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </AuthProvider>
        </ErrorBoundary>
        
        {/* Screen reader announcements */}
        <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only" />
        

      </body>
    </html>
  );
}
