'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { clearToken, getUser, type AuthUser } from '@/lib/auth'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const router = useRouter()
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    clearToken()
    router.replace('/login')
  }
  const [user, setUser] = useState<AuthUser | null>(null)
  useEffect(() => {
    setUser(getUser())
  }, [])
  return (
    <div className="border-b border-neutral-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/80 dark:border-neutral-800">
      <div className="container flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={24} />
          <span className="font-semibold tracking-tight text-slate-900 dark:text-neutral-100">Bank Ledger</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="nav-link hover:underline underline-offset-4">Dashboard</Link>
          <Link href="/transactions/new" className="nav-link hover:underline underline-offset-4">Create Transaction</Link>
          <Link href="/transactions/history" className="nav-link hover:underline underline-offset-4">History</Link>
          <ThemeToggle />
          {user && (
            <div className="hidden sm:flex flex-col leading-tight mr-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</span>
            </div>
          )}
          <button onClick={logout} className="btn-secondary hover:shadow-lg">Logout</button>
        </nav>
      </div>
    </div>
  )
}
