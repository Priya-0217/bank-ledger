export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="rounded-lg">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#g)" />
      <g fill="white">
        <rect x="12" y="18" width="24" height="2" rx="1" />
        <rect x="14" y="20" width="2" height="14" rx="1" />
        <rect x="32" y="20" width="2" height="14" rx="1" />
        <path d="M12 18L24 12L36 18Z" />
      </g>
    </svg>
  )
}
