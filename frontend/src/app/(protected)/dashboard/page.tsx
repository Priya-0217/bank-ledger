'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'
import { v4 as uuidv4 } from 'uuid'
import CountUp from '@/components/CountUp'

type Account = { _id: string, currency: string, status: string }
type Tx = { _id: string, amount: number, type: 'credit' | 'debit', createdAt: string }

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [depositFor, setDepositFor] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | ''>('')
  const [busy, setBusy] = useState(false)
  const [history, setHistory] = useState<Tx[]>([])

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
      try {
        const tx = await api.get('/transaction/history')
        setHistory(tx.data?.transactions || [])
      } catch {}
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

  const deposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!depositFor || typeof amount !== 'number' || amount <= 0) return
    setBusy(true)
    try {
      await api.post('/transaction/deposit', {
        toAccount: depositFor,
        amount,
        idempotencyKey: uuidv4()
      })
      const b = await api.get(`/account/balance/${depositFor}`)
      setBalances((prev) => ({ ...prev, [depositFor]: b.data?.balance || 0 }))
      setAmount('')
      setDepositFor(null)
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Deposit failed')
    } finally {
      setBusy(false)
    }
  }

  const removeAccount = async (id: string) => {
    setBusy(true)
    try {
      await api.delete(`/account/${id}`)
      setAccounts((prev) => prev.filter(a => a._id !== id))
      const next = { ...balances }
      delete next[id]
      setBalances(next)
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Unable to delete account')
    } finally {
      setBusy(false)
    }
  }

  const totalBalance = useMemo(() => Object.values(balances).reduce((a, b) => a + b, 0), [balances])
  const recent = useMemo(() => history.slice(0, 5), [history])
  const stats = useMemo(() => {
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const last30 = history.filter(h => now - new Date(h.createdAt).getTime() <= 30 * dayMs)
    const income = last30.filter(t => t.type === 'credit').reduce((a, b) => a + b.amount, 0)
    const expenses = last30.filter(t => t.type === 'debit').reduce((a, b) => a + b.amount, 0)
    return { income, expenses }
  }, [history])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 hover:shadow-xl transition-all">
          <div className="text-sm text-neutral-500 mb-1">Total Balance</div>
          <div className="text-3xl font-semibold"><CountUp value={totalBalance} /></div>
        </div>
        <div className="card p-6 hover:shadow-xl transition-all">
          <div className="text-sm text-neutral-500 mb-1">Income (30d)</div>
          <div className="text-3xl font-semibold text-emerald-600"><CountUp value={stats.income} prefix="$" /></div>
        </div>
        <div className="card p-6 hover:shadow-xl transition-all">
          <div className="text-sm text-neutral-500 mb-1">Expenses (30d)</div>
          <div className="text-3xl font-semibold text-rose-600"><CountUp value={stats.expenses} prefix="$" /></div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Accounts</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage balances</p>
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
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setDepositFor(acc._id)} className="btn-success hover:shadow-soft" title="Add funds to this account">Add Funds</button>
                <button onClick={() => removeAccount(acc._id)} className="btn-danger hover:shadow-soft" title="Close this account">Delete</button>
              </div>
            </div>
          ))}
          {accounts.length === 0 && <div className="card p-6">No accounts</div>}
        </div>
      )}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Recent Transactions</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(t => (
                <tr key={t._id} className="border-b last:border-b-0 border-neutral-100 dark:border-neutral-800">
                  <td className="px-4 py-2">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 capitalize">{t.type}</td>
                  <td className="px-4 py-2">{t.type === 'debit' ? '-' : ''}${t.amount.toFixed(2)}</td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td className="px-4 py-3 text-neutral-500" colSpan={3}>No recent transactions</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {depositFor && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form onSubmit={deposit} className="card p-6 w-full max-w-sm animate-[fadeIn_.2s_ease-out]">
            <h3 className="text-lg font-semibold mb-3">Add funds</h3>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700"
              placeholder="Amount"
              autoFocus
            />
            <div className="mt-4 flex gap-2 justify-end">
              <button type="button" onClick={() => { setDepositFor(null); setAmount('') }} className="btn-secondary">Cancel</button>
              <button disabled={busy || !amount} className="btn-primary">{busy ? 'Adding...' : 'Add funds'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
