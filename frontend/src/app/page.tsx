import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-25 to-white">
      <div className="container flex items-center justify-center py-24">
        <div className="max-w-2xl text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Logo size={36} />
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Bank Ledger</h1>
          </div>
          <p className="text-slate-600">A clean, modern banking experience with secure transfers and real-time balances.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/login" className="btn-primary hover:shadow-lg">Login</Link>
            <Link href="/register" className="btn-secondary hover:shadow-lg">Register</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
