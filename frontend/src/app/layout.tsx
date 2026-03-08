import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bank Ledger',
  description: 'Modern banking dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020814] text-slate-200">
        {children}
      </body>
    </html>
  )
}
