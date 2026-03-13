'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

function Item({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname?.startsWith(href)
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${active ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800'}`}>
      <span className="inline-flex w-5 h-5">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-neutral-100 bg-white/70 backdrop-blur dark:bg-neutral-950/60 dark:border-neutral-800">
      <div className="p-4 flex items-center gap-2">
        <Logo size={24} />
        <div className="font-semibold">Bank Ledger</div>
      </div>
      <nav className="px-3 space-y-1">
        <Item href="/dashboard" label="Dashboard" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zM3 21h8v-6H3v6zm10-8h8V3h-8v10z" strokeWidth="2"/></svg>} />
        <Item href="/transactions/new" label="Transfers" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h11m0 0-3-3m3 3-3 3M20 17H9m0 0 3-3m-3 3 3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        <Item href="/transactions/history" label="History" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3M4 4v5h5M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
      </nav>
      <div className="p-4 text-xs text-neutral-500 dark:text-neutral-400">© {new Date().getFullYear()}</div>
    </aside>
  )
}
