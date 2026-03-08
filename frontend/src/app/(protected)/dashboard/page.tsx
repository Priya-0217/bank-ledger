'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/axios'

type Account = { _id: string, currency: string, status: string }
type Tx = { _id: string, amount: number, status: string, createdAt: string, direction?: 'incoming' | 'outgoing', counterparty?: string }

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [accountRes, txRes] = await Promise.all([
        api.get('/account'),
        api.get('/transaction/history')
      ])
      const list: Account[] = accountRes.data?.accounts || []
      setAccounts(list)
      setTransactions((txRes.data?.transactions || []).slice(0, 5))

      const balanceResults = await Promise.allSettled(
        list.map(async (acc) => {
          const b = await api.get(`/account/balance/${acc._id}`)
          return [acc._id, b.data?.balance || 0] as const
        })
      )

      const fetched: Record<string, number> = {}
      balanceResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const [id, amount] = result.value
          fetched[id] = amount
        }
      })
      setBalances(fetched)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      setError(err?.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const totalBalance = useMemo(() => accounts.reduce((sum, acc) => sum + (balances[acc._id] || 0), 0), [accounts, balances])
  const incoming = useMemo(() => transactions.filter((t) => t.direction === 'incoming').reduce((sum, t) => sum + t.amount, 0), [transactions])
  const outgoing = useMemo(() => transactions.filter((t) => t.direction === 'outgoing').reduce((sum, t) => sum + t.amount, 0), [transactions])

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-400">Overview of your financial activity</p>
        </div>
        <Link href="/transactions/new" className="vault-primary-btn">New Transfer</Link>
      </header>

      {loading && <div className="vault-card p-6">Loading...</div>}
      {!!error && <div className="vault-card p-6 text-rose-400">{error}</div>}

      {!loading && !error && (
        <>
          <section className="vault-card p-6">
            <p className="text-sm text-slate-400">Total Balance</p>
            <p className="mt-2 text-5xl font-semibold text-white">${totalBalance.toFixed(2)}</p>
            <div className="mt-10 grid grid-cols-6 gap-3 text-xs text-slate-500">
              {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((m) => <span key={m}>{m}</span>)}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <article className="metric-card"><p className="text-slate-400">Income</p><p className="mt-2 text-3xl font-semibold text-white">${incoming.toFixed(2)}</p></article>
            <article className="metric-card"><p className="text-slate-400">Expenses</p><p className="mt-2 text-3xl font-semibold text-white">${outgoing.toFixed(2)}</p></article>
            <article className="metric-card"><p className="text-slate-400">Pending</p><p className="mt-2 text-3xl font-semibold text-white">{transactions.filter((t) => t.status === 'pending').length}</p></article>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="vault-card xl:col-span-2">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                <Link className="text-sm text-slate-400 hover:text-white" href="/transactions/history">View all</Link>
              </div>
              <div>
                {transactions.map((t) => (
                  <div key={t._id} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-b-0">
                    <div>
                      <p className="text-sm text-white">{t.counterparty || 'Transfer'}</p>
                      <p className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                    <p className={`mono text-lg font-semibold ${t.direction === 'incoming' ? 'text-emerald-400' : 'text-rose-400'}`}>{t.direction === 'incoming' ? '+' : '-'}${t.amount.toFixed(2)}</p>
                  </div>
                ))}
                {!transactions.length && <p className="p-4 text-sm text-slate-500">No recent transactions.</p>}
              </div>
            </div>

            <div className="vault-card">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h2 className="text-lg font-semibold text-white">Accounts</h2>
                <Link className="text-sm text-slate-400 hover:text-white" href="/accounts">Manage</Link>
              </div>
              <div className="space-y-3 p-4">
                {accounts.map((acc) => (
                  <article key={acc._id} className="rounded-xl bg-white/5 p-3">
                    <p className="mono text-xs text-slate-400">{acc._id}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">${(balances[acc._id] || 0).toFixed(2)}</p>
                  </article>
                ))}
                {!accounts.length && <p className="text-sm text-slate-500">No accounts yet.</p>}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
