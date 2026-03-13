'use client'
import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value, duration = 800, prefix = '$', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const start = useRef<number | null>(null)
  const from = useRef(0)
  useEffect(() => {
    const f = from.current
    const v = value
    start.current = null
    const step = (ts: number) => {
      if (start.current == null) start.current = ts
      const p = Math.min(1, (ts - start.current) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(f + (v - f) * eased)
      if (p < 1) requestAnimationFrame(step)
      else from.current = v
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [value, duration])
  return <span>{prefix}{display.toFixed(2)}{suffix}</span>
}
