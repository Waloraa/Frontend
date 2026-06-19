import type { CSSProperties, ReactNode, MouseEvent } from 'react'

// Tilt 3D mengikuti posisi kursor — pola yang sama dengan MetricCard di
// EconomicsSection, dibuat reusable untuk kartu dashboard.
export default function TiltCard({
  children,
  className = '',
  style,
  maxTilt = 4,
  lift = 6,
  hoverShadow,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
  lift?: number
  hoverShadow?: string
}) {
  const baseShadow = style?.boxShadow as string | undefined

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotX = (-y / (rect.height / 2)) * maxTilt
    const rotY = (x / (rect.width / 2)) * maxTilt
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-${lift}px)`
    if (hoverShadow) el.style.boxShadow = hoverShadow
  }

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
    e.currentTarget.style.boxShadow = baseShadow ?? ''
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        transition:
          'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
