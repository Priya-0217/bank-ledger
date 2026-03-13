'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { setToken, setUser } from '@/lib/auth'
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
      if (res.data?.user) setUser(res.data.user)
      router.replace('/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <form onSubmit={onSubmit} className="card p-8 w-full max-w-md space-y-6">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <h1 className="text-2xl font-semibold">Create account</h1>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full name" className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700" required />
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
    </main>
  )
}
