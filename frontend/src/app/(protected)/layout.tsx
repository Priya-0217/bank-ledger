'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser, clearToken, type AuthUser } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'
import api from '@/lib/axios'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login')
    }
    setUser(getUser())
  }, [router])
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-neutral-100 dark:bg-neutral-900/60 dark:border-neutral-800">
            <div className="container h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Welcome</div>
                <div className="font-medium">{user?.name || 'User'}</div>
              </div>
              <div className="flex items-center gap-3">
                {user && <div className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400">{user.email}</div>}
                <ThemeToggle />
                <button
                  onClick={async () => {
                    try { await api.post('/auth/logout') } catch {}
                    clearToken()
                    router.replace('/login')
                  }}
                  className="btn-ghost"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
