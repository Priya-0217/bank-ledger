'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { clearToken } from '@/lib/auth'
import Logo from './Logo'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/transactions/new', label: 'Transfers' },
  { href: '/transactions/history', label: 'Transactions' },
  { href: '/settings', label: 'Settings' }
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    clearToken()
    router.replace('/login')
  }

  return (
    <aside className="vault-sidebar">
      <div>
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2">
          <Logo size={34} />
          <span className="text-2xl font-semibold tracking-tight text-white">Vault</span>
        </Link>

        <nav className="mt-8 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} className={`vault-nav-link ${active ? 'is-active' : ''}`}>
                <span>{link.label}</span>
                {active && <span className="h-2 w-2 rounded-full bg-[#6dd8a5]" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="space-y-3 border-t border-emerald-900/40 px-3 py-4">
        <p className="text-xs text-slate-400">john@vault.com</p>
        <button onClick={logout} className="vault-secondary-btn w-full">Logout</button>
      </div>
    </aside>
  )
}
