import React from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { ThemeProvider } from "../theme-provider"

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 container py-6">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  )
} 