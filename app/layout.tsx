import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Brendon Edwards | Portfolio",
  description: "Exploring alignment, behavioural nuance, and the human side of intelligent systems.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} antialiased bg-white text-black dark:bg-black dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
