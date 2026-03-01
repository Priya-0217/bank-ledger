'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login')
    }
  }, [router])
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-6">{children}</div>
    </div>
  )
}
