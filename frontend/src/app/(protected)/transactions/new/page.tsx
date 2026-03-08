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
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section className="vault-card xl:col-span-2 p-5">
        <h1 className="text-4xl font-semibold text-white">Transfers</h1>
        <p className="text-slate-400">Send money securely with idempotent transactions</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">From account</label>
              <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="vault-input">
                <option value="">Select source account</option>
                {accounts.map((acc) => <option key={acc._id} value={acc._id}>{acc._id}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">To account / recipient</label>
              <select value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="vault-input">
                <option value="">Select recipient account</option>
                {accounts.map((acc) => <option key={acc._id} value={acc._id}>{acc._id}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Amount</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} type="number" min="0.01" step="0.01" placeholder="$ 0.00" className="vault-input" />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Reference / memo</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Payment for invoice #1234" className="vault-input" />
          </div>

          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 px-3 py-2 text-sm text-slate-400">All transfers are idempotent and protected.</div>
          <button disabled={!canSubmit || submitting} className="vault-primary-btn w-full text-base">{submitting ? 'Processing...' : 'Send Transfer'}</button>
          {status && <p className="text-sm text-slate-300">{status}</p>}
        </form>
      </section>

      <aside className="space-y-4">
        <div className="vault-card p-4">
          <h2 className="text-lg font-semibold text-white">Quick Transfer</h2>
          <div className="mt-3 space-y-2">
            {accounts.slice(0, 3).map((acc) => (
              <button key={acc._id} onClick={() => setToAccount(acc._id)} className="flex w-full items-center justify-between rounded-xl bg-emerald-900/10 px-3 py-2 text-left hover:bg-emerald-900/20">
                <span className="mono text-xs text-slate-300">{acc._id.slice(-8)}</span>
                <span className="text-slate-500">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="vault-card p-4">
          <h2 className="text-lg font-semibold text-white">Transfer History</h2>
          <div className="mt-3 space-y-3">
            {history.map((item) => (
              <div key={item._id} className="flex items-start justify-between border-b border-white/5 pb-2 last:border-b-0">
                <div>
                  <p className="text-sm text-slate-200">{item.counterparty || 'Transfer'}</p>
                  <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`mono text-sm ${item.direction === 'incoming' ? 'text-emerald-400' : 'text-emerald-300'}`}>{item.direction === 'incoming' ? '+' : '-'}${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
