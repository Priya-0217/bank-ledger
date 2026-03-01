'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { clearToken } from '@/lib/auth'
import Logo from './Logo'

export default function Navbar() {
  const router = useRouter()
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    clearToken()
    router.replace('/login')
  }
  return (
    <div className="border-b border-neutral-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={24} />
          <span className="font-semibold tracking-tight text-slate-900">Bank Ledger</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="nav-link hover:underline underline-offset-4">Dashboard</Link>
          <Link href="/transactions/new" className="nav-link hover:underline underline-offset-4">Create Transaction</Link>
          <Link href="/transactions/history" className="nav-link hover:underline underline-offset-4">History</Link>
          <button onClick={logout} className="btn-secondary hover:shadow-lg">Logout</button>
        </nav>
      </div>
    </div>
  )
}
