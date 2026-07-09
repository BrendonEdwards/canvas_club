import "./globals.css"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Archivo, Fraunces } from "next/font/google"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
})

export const metadata: Metadata = {
  title: "Canvas Club · Art that lives with you",
  description:
    "A quarterly art subscription that transforms your home and supports emerging artists.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  )
}
