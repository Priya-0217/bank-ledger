'use client'
import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'

type Tx = {
  _id: string
  fromAccount: string
  toAccount: string
  amount: number
  status: string
  idempotencyKey?: string
  direction?: 'incoming' | 'outgoing'
  counterparty?: string
  createdAt: string
}

const statusStyles: Record<string, string> = {
  completed: 'text-emerald-300',
  pending: 'text-emerald-200',
  failed: 'text-emerald-400',
  reversed: 'text-emerald-300'
}

export default function HistoryPage() {
  const [tx, setTx] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/transaction/history')
        setTx(res.data?.transactions || [])
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } }
        setError(err?.response?.data?.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredRows = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return tx
    return tx.filter((t) =>
      t.counterparty?.toLowerCase().includes(q) ||
      t.idempotencyKey?.toLowerCase().includes(q) ||
      t.fromAccount.toLowerCase().includes(q) ||
      t.toAccount.toLowerCase().includes(q)
    )
  }, [query, tx])

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold text-white">Transactions</h1>
          <p className="text-slate-400">Complete ledger of all financial activity</p>
        </div>
        <button className="vault-secondary-btn">Export CSV</button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions..." className="vault-input max-w-md" />
      </div>

      {loading && <div className="vault-card p-6">Loading...</div>}
      {!!error && <div className="vault-card p-6 text-emerald-300">{error}</div>}

      {!loading && !error && (
        <div className="vault-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500">
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Idempotency Key</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((t) => (
                <tr key={t._id} className="border-b border-white/5 hover:bg-emerald-900/10">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{t.counterparty || 'Transfer'}</p>
                    <p className="mono text-xs text-slate-500">TXN-{t._id.slice(-4)}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className={`px-4 py-3 capitalize ${statusStyles[t.status] || 'text-slate-300'}`}>{t.status}</td>
                  <td className="mono px-4 py-3 text-xs text-slate-500">{t.idempotencyKey || '-'}</td>
                  <td className={`mono px-4 py-3 text-right text-lg font-semibold ${t.direction === 'incoming' ? 'text-emerald-400' : 'text-emerald-300'}`}>{t.direction === 'incoming' ? '+' : '-'}${t.amount.toFixed(2)}</td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
