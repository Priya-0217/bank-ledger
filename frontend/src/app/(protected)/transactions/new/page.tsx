'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { v4 as uuidv4 } from 'uuid'

type Account = { _id: string }

export default function NewTransactionPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/account')
      setAccounts(res.data?.accounts || [])
    }
    load()
  }, [])

  const canSubmit = useMemo(() => {
    return fromAccount && toAccount && fromAccount !== toAccount && typeof amount === 'number' && amount > 0
  }, [fromAccount, toAccount, amount])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setStatus('')
    try {
      const res = await api.post('/transaction', {
        fromAccount,
        toAccount,
        amount: Number(amount),
        idempotencyKey: uuidv4()
      })
      setStatus(res.data?.message || 'Success')
      // After a successful transaction, go back to dashboard to view updated balances
      setTimeout(() => router.replace('/dashboard'), 300)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setStatus(e?.response?.data?.message || 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create Transaction</h1>
        <p className="text-sm text-slate-500">Transfer between your accounts</p>
      </div>
      <form onSubmit={submit} className="card p-6 space-y-5 max-w-xl">
        <div className="space-y-1">
          <div className="text-sm text-slate-700">From account</div>
          <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
            <option value="">Select</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>{acc._id}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-slate-700">To account</div>
          <select value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
            <option value="">Select</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>{acc._id}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-slate-700">Amount</div>
          <input value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} type="number" min="0.01" step="0.01" placeholder="0.00" className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
        <button disabled={!canSubmit || submitting} className="btn-primary hover:shadow-lg">{submitting ? 'Processing...' : 'Submit'}</button>
        {status && <div className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  )
}
