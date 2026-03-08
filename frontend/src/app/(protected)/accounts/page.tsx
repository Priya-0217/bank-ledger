'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'

type Account = { _id: string, currency: string, status: string }
type Tx = { _id: string, amount: number, direction?: 'incoming' | 'outgoing', fromAccount: string, toAccount: string }

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [tx, setTx] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [accountRes, txRes] = await Promise.all([api.get('/account'), api.get('/transaction/history')])
    const list: Account[] = accountRes.data?.accounts || []
    setAccounts(list)
    setTx(txRes.data?.transactions || [])

    const balanceResults = await Promise.allSettled(list.map(async (acc) => {
      const b = await api.get(`/account/balance/${acc._id}`)
      return [acc._id, b.data?.balance || 0] as const
    }))

    const nextBalances: Record<string, number> = {}
    for (const result of balanceResults) {
      if (result.status === 'fulfilled') {
        const [id, amount] = result.value
        nextBalances[id] = amount
      }
    }
    setBalances(nextBalances)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const totals = useMemo(() => ({
    totalAssets: accounts.reduce((sum, acc) => sum + (balances[acc._id] || 0), 0)
  }), [accounts, balances])

  const createAccount = async () => {
    await api.post('/account')
    await load()
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white">Accounts</h1>
          <p className="text-slate-400">Manage your bank accounts and balances</p>
        </div>
        <button onClick={createAccount} className="vault-primary-btn">Add Account</button>
      </header>

      <section className="vault-card p-5">
        <p className="text-sm text-slate-400">Total Assets</p>
        <p className="mt-2 text-5xl font-semibold text-white">${totals.totalAssets.toFixed(2)}</p>
      </section>

      {loading ? <div className="vault-card p-5">Loading...</div> : (
        <section className="space-y-3">
          {accounts.map((acc) => {
            const incoming = tx.filter((t) => String(t.toAccount) === String(acc._id)).reduce((sum, t) => sum + t.amount, 0)
            const outgoing = tx.filter((t) => String(t.fromAccount) === String(acc._id)).reduce((sum, t) => sum + t.amount, 0)
            return (
              <article key={acc._id} className="vault-card flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-xl font-semibold text-white">{acc.status === 'active' ? 'Operating Account' : 'Account'}</p>
                  <p className="mono text-xs text-slate-500">{acc._id}</p>
                  <p className="mt-2 text-4xl font-semibold text-white">${(balances[acc._id] || 0).toFixed(2)}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-emerald-400">Incoming ${incoming.toFixed(2)}</p>
                  <p className="text-emerald-300">Outgoing ${outgoing.toFixed(2)}</p>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
