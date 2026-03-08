'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { setToken } from '@/lib/auth'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const token = res.data?.token
      if (token) setToken(token)
      router.replace('/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#020814] text-white lg:grid-cols-2">
      <section className="flex items-center px-8 lg:px-24">
        <div className="max-w-lg space-y-6">
          <div className="flex items-center gap-3"><Logo size={42} /><span className="text-5xl font-semibold">Vault</span></div>
          <h1 className="text-6xl font-semibold leading-tight">Banking infrastructure <span className="text-[#72d3a3]">built for the future</span></h1>
          <p className="text-2xl text-slate-400">Idempotent transactions, real-time balances, and military-grade security in one unified ledger.</p>
        </div>
      </section>

      <section className="flex items-center px-8 py-12 lg:px-24">
        <form onSubmit={onSubmit} className="vault-card w-full max-w-xl p-8 space-y-5">
          <h2 className="text-4xl font-semibold">Welcome back</h2>
          <p className="text-slate-400">Sign in to your ledger</p>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div>
            <label className="mb-1 block text-xs uppercase text-slate-400">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com" className="vault-input" required />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase text-slate-400">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="vault-input" required />
          </div>
          <button disabled={loading} className="vault-primary-btn w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
          <p className="text-center text-slate-400">Don&apos;t have an account? <Link href="/register" className="text-[#72d3a3]">Sign up</Link></p>
        </form>
      </section>
    </main>
  )
}
