'use client'
import { useCallback, useEffect, useState } from 'react'
import api from '@/lib/axios'

type Account = { _id: string, currency: string, status: string }

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/account')
      const list: Account[] = res.data?.accounts || []
      setAccounts(list)
      const fetched: Record<string, number> = {}
      for (const acc of list) {
        try {
          const b = await api.get(`/account/balance/${acc._id}`)
          fetched[acc._id] = b.data?.balance || 0
        } catch {
          fetched[acc._id] = 0
        }
      }
      setBalances(fetched)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      setError(err?.response?.data?.message || 'Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [])

  const createAccount = async () => {
    const res = await api.post('/account')
    const acc: Account = res.data?.account
    setAccounts((prev) => [...prev, acc])
    try {
      const b = await api.get(`/account/balance/${acc._id}`)
      setBalances((prev) => ({ ...prev, [acc._id]: b.data?.balance || 0 }))
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Accounts and balances</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="btn-secondary hover:shadow-soft">Refresh</button>
          <button onClick={createAccount} className="btn-primary hover:shadow-soft">New account</button>
        </div>
      </div>
      {loading && <div className="card p-8">Loading...</div>}
      {!!error && <div className="card p-6 text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => (
            <div key={acc._id} className="grad-card rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm opacity-90">Account</div>
                <div className="px-2 py-0.5 rounded-full text-xs bg-white/20 text-white/90 uppercase">Active</div>
              </div>
              <div className="text-3xl font-bold tracking-tight mb-1">${(balances[acc._id] || 0).toFixed(2)} {acc.currency || 'USD'}</div>
              <div className="text-xs opacity-90 font-mono break-all">{acc._id}</div>
            </div>
          ))}
          {accounts.length === 0 && <div className="card p-6">No accounts</div>}
        </div>
      )}
    </div>
  )
}
