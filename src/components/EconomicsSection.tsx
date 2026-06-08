import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Wallet, TrendingUp, ShieldCheck, Hourglass } from 'lucide-react'
import AnimatedText from './ui/AnimatedText'

const metrics = [
  {
    icon: Wallet,
    label: 'Deposit minimum',
    value: '1',
    unit: 'SUI',
    gradient: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
    glow: 'rgba(129,140,248,0.4)',
    hoverShadow: '0 0 0 1px rgba(129,140,248,0.32), 0 20px 48px rgba(99,102,241,0.15), 0 8px 20px rgba(0,0,0,0.6)',
  },
  {
    icon: TrendingUp,
    label: 'APY Scallop (est.)',
    value: '~8',
    unit: '%',
    gradient: 'linear-gradient(135deg, #34D399 0%, #0D9488 100%)',
    glow: 'rgba(52,211,153,0.4)',
    hoverShadow: '0 0 0 1px rgba(52,211,153,0.28), 0 20px 48px rgba(16,185,129,0.1), 0 8px 20px rgba(0,0,0,0.6)',
  },
  {
    icon: ShieldCheck,
    label: 'Coverage (5 SUI)',
    value: '~20',
    unit: '×',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)',
    glow: 'rgba(34,211,238,0.4)',
    hoverShadow: '0 0 0 1px rgba(34,211,238,0.28), 0 20px 48px rgba(59,130,246,0.1), 0 8px 20px rgba(0,0,0,0.6)',
  },
  {
    icon: Hourglass,
    label: 'Durasi (5 SUI)',
    value: '~80',
    unit: 'tahun',
    gradient: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
    glow: 'rgba(253,230,138,0.4)',
    hoverShadow: '0 0 0 1px rgba(253,230,138,0.22), 0 20px 48px rgba(245,158,11,0.1), 0 8px 20px rgba(0,0,0,0.6)',
  },
]

const compare = [
  { k: 'Token', testnet: 'SUI (1:1)', mainnet: 'sSUI dari Scallop' },
  { k: 'Walrus epoch', testnet: '1 hari', mainnet: '2 minggu' },
  { k: 'Scallop yield', testnet: 'Simulasi', mainnet: 'Real APY ~8%' },
  { k: 'Protocol fee', testnet: '2% dari yield', mainnet: '2% dari yield' },
  { k: 'Keeper reward', testnet: '0.1% dari yield', mainnet: '0.1% dari yield' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

function MetricCard({ m, i }: { m: (typeof metrics)[0]; i: number }) {
  const Icon = m.icon

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotX = (-y / (rect.height / 2)) * 8
    const rotY = (x / (rect.width / 2)) * 8
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.03)`
    el.style.boxShadow = m.hoverShadow
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
    e.currentTarget.style.boxShadow = '0 4px 28px rgba(0,0,0,0.4)'
  }

  return (
    <motion.div
      custom={i}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-60px' }}
    >
      <div
        className="p-6 text-center h-full backdrop-blur-xl cursor-default"
        style={{
          background: 'rgba(11, 18, 38, 0.88)',
          border: '1px solid rgba(99, 102, 241, 0.18)',
          borderRadius: '1.25rem',
          boxShadow: '0 4px 28px rgba(0,0,0,0.4)',
          transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)',
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-4"
          style={{
            background: m.gradient,
            boxShadow: `0 4px 16px ${m.glow}`,
          }}
        >
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex items-end justify-center gap-1">
          <span
            className="text-3xl font-bold leading-none"
            style={{ color: '#F1F5F9' }}
          >
            {m.value}
          </span>
          <span className="text-sm mb-0.5" style={{ color: '#475569' }}>
            {m.unit}
          </span>
        </div>
        <p className="text-xs mt-2" style={{ color: '#374151' }}>
          {m.label}
        </p>
      </div>
    </motion.div>
  )
}

export default function EconomicsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  return (
    <section
      id="economics"
      ref={ref}
      className="relative w-full py-28 px-6 md:px-14 scroll-mt-16 overflow-hidden"
      style={{ background: '#050C1A' }}
    >
      {/* Ambient orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: 520,
            height: 520,
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818CF8',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            Economic Model
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold leading-tight mt-2"
            style={{
              color: '#E2E8F0',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            Didanai sekali,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              abadi selamanya.
            </span>
          </h2>
          <AnimatedText
            text="Principal tidak pernah tersentuh — hanya yield yang dipakai untuk renewal. Satu deposit kecil mendanai storage skill selama puluhan tahun."
            className="mt-5 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: '#475569' }}
          />
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} m={m} i={i} />
          ))}
        </div>

        {/* Testnet vs Mainnet table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl overflow-hidden backdrop-blur-xl"
          style={{
            background: 'rgba(11, 18, 38, 0.88)',
            border: '1px solid rgba(99, 102, 241, 0.18)',
            boxShadow: '0 4px 28px rgba(0,0,0,0.4)',
          }}
        >
          <div className="grid grid-cols-3 text-sm">
            {/* Header row */}
            <div
              className="px-5 py-4 font-semibold"
              style={{ background: 'rgba(255,255,255,0.03)', color: '#374151' }}
            />
            <div
              className="px-5 py-4 font-semibold"
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: '#94A3B8',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              Testnet
            </div>
            <div
              className="px-5 py-4 font-semibold"
              style={{
                background: 'rgba(99,102,241,0.08)',
                color: '#818CF8',
                borderLeft: '1px solid rgba(99,102,241,0.15)',
              }}
            >
              Mainnet
            </div>

            {compare.map((row, i) => (
              <div key={row.k} className="contents">
                <div
                  className="px-5 py-4 font-medium"
                  style={{
                    color: '#475569',
                    background: i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {row.k}
                </div>
                <div
                  className="px-5 py-4"
                  style={{
                    color: '#94A3B8',
                    background: i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderLeft: '1px solid rgba(255,255,255,0.07)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {row.testnet}
                </div>
                <div
                  className="px-5 py-4 font-medium"
                  style={{
                    color: '#A5B4FC',
                    background: i % 2
                      ? 'rgba(99,102,241,0.06)'
                      : 'rgba(99,102,241,0.03)',
                    borderLeft: '1px solid rgba(99,102,241,0.15)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {row.mainnet}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-sm mt-8"
          style={{ color: '#374151' }}
        >
          Smart contract: 18/18 tests passing · principal protection · fee
          distribution otomatis saat renewal.
        </motion.p>
      </div>
    </section>
  )
}
