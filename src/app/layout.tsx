import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
};

export const metadata: Metadata = {
  title: "HealthPal - AI-Powered Healthcare Triage",
  description: "AI-powered healthcare triage system for Nigerian communities. Get instant symptom analysis and find nearby emergency clinics.",
  keywords: ["healthcare", "triage", "AI", "Nigeria", "medical", "emergency", "clinics", "accessibility", "responsive"],
  authors: [{ name: "HealthPal Team" }],
  creator: "HealthPal",
  publisher: "HealthPal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://healthpal.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "HealthPal - AI-Powered Healthcare Triage",
    description: "AI-powered healthcare triage system for Nigerian communities",
    url: '/',
    siteName: 'HealthPal',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HealthPal - Healthcare Assistant',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HealthPal - AI-Powered Healthcare Triage",
    description: "AI-powered healthcare triage system for Nigerian communities",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
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
        <ErrorBoundary>
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
