'use client'
import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'

type Tx = {
  _id: string
  fromAccount: string
  toAccount: string
  amount: number
  status: string
  type: 'credit' | 'debit'
  createdAt: string
}

export default function HistoryPage() {
  const [tx, setTx] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const rows = useMemo(() => tx.map(t => ({
    ...t,
    time: new Date(t.createdAt).toLocaleString()
  })), [tx])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Transaction History</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Latest activity</p>
      </div>
      {loading && <div className="card p-6">Loading...</div>}
      {!!error && <div className="card p-6 text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(t => (
                  <tr key={t._id} className="border-b last:border-b-0 border-neutral-100 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-700 dark:text-neutral-300">{t.time}</td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">{t.fromAccount}</td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">{t.toAccount}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">${t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 capitalize">{t.status}</span>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-neutral-500">No transactions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
