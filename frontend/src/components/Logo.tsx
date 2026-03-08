export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="rounded-xl">
      <defs>
        <linearGradient id="vault-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#86e1b6" />
          <stop offset="100%" stopColor="#5ebf94" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#vault-g)" />
      <path d="M24 12L14 16V24C14 30 18.2 35.6 24 37C29.8 35.6 34 30 34 24V16L24 12Z" fill="#052519" />
      <path d="M24 17.4L18.2 19.8V24C18.2 27.6 20.7 30.9 24 31.8C27.3 30.9 29.8 27.6 29.8 24V19.8L24 17.4Z" fill="#86e1b6" opacity="0.85" />
    </svg>
  )
}
