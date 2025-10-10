import { Toaster } from "@/components/ui/toaster";
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navigation } from "@/components/layout/Navigation"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Vehicle Intelligence Platform",
  description: "Auto-generate rich vehicle comparison and overview pages with AI",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navigation />
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        <Analytics />
              <Toaster />
      </body>
    </html>
  )
}
