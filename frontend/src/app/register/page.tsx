'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { setToken } from '@/lib/auth'
import Logo from '@/components/Logo'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const token = res.data?.token
      if (token) setToken(token)
      router.replace('/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Unable to create account. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020814] p-6">
      <form onSubmit={onSubmit} className="vault-card w-full max-w-xl space-y-4 p-8 text-white">
        <div className="flex items-center gap-2"><Logo size={28} /><h1 className="text-3xl font-semibold">Create your Vault account</h1></div>

        {!!error && (
          <div className="rounded-xl border border-emerald-700/40 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-200">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="John Doe" className="vault-input" required minLength={2} />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com" className="vault-input" required />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Minimum 6 characters" className="vault-input" required minLength={6} />
        </div>

        <button disabled={loading} className="vault-primary-btn w-full">{loading ? 'Creating...' : 'Create account'}</button>
        <p className="text-center text-slate-400">Already have an account? <Link href="/login" className="text-[#72d3a3]">Sign in</Link></p>
      </form>
    </main>
  )
}
