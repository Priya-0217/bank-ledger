import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bank Ledger',
  description: 'Modern banking dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-black dark:text-neutral-100">
        {children}
      </body>
    </html>
  )
}
