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
      setError(e?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020814] p-6">
      <form onSubmit={onSubmit} className="vault-card w-full max-w-xl space-y-4 p-8 text-white">
        <div className="flex items-center gap-2"><Logo size={28} /><h1 className="text-3xl font-semibold">Create your Vault account</h1></div>
        {error && <p className="text-sm text-emerald-300">{error}</p>}
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full name" className="vault-input" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="vault-input" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="vault-input" required />
        <button disabled={loading} className="vault-primary-btn w-full">{loading ? 'Creating...' : 'Create account'}</button>
        <p className="text-center text-slate-400">Already have an account? <Link href="/login" className="text-[#72d3a3]">Sign in</Link></p>
      </form>
    </main>
  )
}
