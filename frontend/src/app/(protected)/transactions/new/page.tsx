'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { v4 as uuidv4 } from 'uuid'

type Account = { _id: string }
type Tx = { _id: string, counterparty?: string, createdAt: string, amount: number, status: string, direction?: 'incoming' | 'outgoing' }

export default function NewTransactionPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [history, setHistory] = useState<Tx[]>([])
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [accountsRes, historyRes] = await Promise.all([api.get('/account'), api.get('/transaction/history')])
      setAccounts(accountsRes.data?.accounts || [])
      setHistory((historyRes.data?.transactions || []).slice(0, 4))
    }
    load()
  }, [])

  const canSubmit = useMemo(() => fromAccount && toAccount && fromAccount !== toAccount && typeof amount === 'number' && amount > 0, [fromAccount, toAccount, amount])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setStatus('')
    try {
      const res = await api.post('/transaction', { fromAccount, toAccount, amount: Number(amount), note, idempotencyKey: uuidv4() })
      setStatus(res.data?.message || 'Transfer created')
      setTimeout(() => router.replace('/transactions/history'), 350)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setStatus(e?.response?.data?.message || 'Transfer failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <section className="card xl:col-span-2 p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Transfers</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Send money securely with idempotent transactions</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">From account</label>
              <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700">
                <option value="">Select source account</option>
                {accounts.map((acc) => <option key={acc._id} value={acc._id}>{acc._id}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">To account / recipient</label>
              <select value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700">
                <option value="">Select recipient account</option>
                {accounts.map((acc) => <option key={acc._id} value={acc._id}>{acc._id}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Amount</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} type="number" min="0.01" step="0.01" placeholder="$ 0.00" className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700" />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Reference / memo</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Payment for invoice #1234" className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700" />
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">All transfers are idempotent and protected.</div>
          <button disabled={!canSubmit || submitting} className="btn-primary w-full text-base">{submitting ? 'Processing...' : 'Send Transfer'}</button>
          {status && <p className="text-sm text-neutral-600 dark:text-neutral-400">{status}</p>}
        </form>
      </section>

      <aside className="space-y-4">
        <div className="card p-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Quick Transfer</h2>
          <div className="mt-3 space-y-2">
            {accounts.slice(0, 3).map((acc) => (
              <button key={acc._id} onClick={() => setToAccount(acc._id)} className="flex w-full items-center justify-between rounded-xl bg-neutral-100 px-3 py-2 text-left hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">{acc._id.slice(-8)}</span>
                <span className="text-neutral-500 dark:text-neutral-400">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Transfer History</h2>
          <div className="mt-3 space-y-3">
            {history.map((item) => (
              <div key={item._id} className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 last:border-b-0">
                <div>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">{item.counterparty || 'Transfer'}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`font-mono text-sm ${item.direction === 'incoming' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'}`}>{item.direction === 'incoming' ? '+' : '-'}${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
