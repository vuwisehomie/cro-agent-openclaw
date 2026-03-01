import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRO-Agent | AI-Powered Conversion Optimization',
  description: 'Unify marketing data and automate conversion improvements.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
