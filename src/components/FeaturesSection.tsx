import { useRef, useState, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Search, PiggyBank, TrendingUp, Database, Code2 } from 'lucide-react'

const cardBase: React.CSSProperties = {
  background: 'rgba(8, 14, 34, 0.95)',
  border: '1px solid rgba(99, 102, 241, 0.13)',
  borderRadius: '1.25rem',
  position: 'relative',
  overflow: 'hidden',
  flexShrink: 0,
}

// Card dengan efek zoom-in interaktif saat hover
function HoverCard({
  width,
  children,
}: {
  width: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.06,
        borderColor: 'rgba(129,140,248,0.45)',
        boxShadow: '0 24px 55px rgba(0,0,0,0.55), 0 0 0 1px rgba(129,140,248,0.3)',
        zIndex: 30,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ ...cardBase, width }}
    >
      {children}
    </motion.div>
  )
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Measured horizontal overflow (content width − viewport width). Re-measured on
  // resize so the row always scrolls EXACTLY to the last card — no over/under-scroll
  // regardless of screen dimension.
  const [distance, setDistance] = useState(0)
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const overflow = track.scrollWidth - document.documentElement.clientWidth
      setDistance(overflow > 0 ? overflow : 0)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // scrollYProgress 0→1 across the tall section while the inner row is sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Scroll DOWN → row moves LEFT (x negative). Scroll UP → row moves RIGHT (back).
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  // Background text parallax
  const bgX = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0, 0.06, 0.06, 0.03])

  return (
    // Tall section gives scroll distance; inner content is sticky
    <section
      id="how"
      ref={sectionRef}
      className="relative scroll-mt-16"
      // Height = 1 viewport (the sticky pin) + a fraction of the horizontal travel.
      // Faktor 0.4 = 1px scroll vertikal menggerakkan ~2.5px horizontal → lebih cepat,
      // sekaligus memperpendek section sehingga tak ada gap besar setelahnya.
      style={{ height: `calc(100vh + ${distance * 0.4}px)`, background: '#050C1A' }}
    >
      {/* Sticky viewport — stays pinned while scroll drives horizontal motion */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: '8%', right: '-8%',
            width: 640, height: 640,
            background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '8%', left: '-8%',
            width: 520, height: 520,
            background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Background "HOW IT WORKS" */}
        <motion.div
          style={{ x: bgX, opacity: bgOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span style={{
            fontSize: 'clamp(52px, 10.5vw, 165px)',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
          }}>
            HOW IT WORKS
          </span>
        </motion.div>

        {/* Header */}
        <div className="relative px-6 md:px-14 max-w-6xl mx-auto w-full mb-10 text-center">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818CF8',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            How it Works
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold leading-tight mt-1.5"
            style={{
              color: '#E2E8F0',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            Tiga layer,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              satu memory abadi.
            </span>
          </h2>
        </div>

        {/* ── HORIZONTAL ROW — bergerak kiri/kanan mengikuti scroll ── */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex gap-5 px-6 md:px-14 will-change-transform"
        >

          {/* Card 1 — Skill Memory */}
          <HoverCard width="clamp(320px, 38vw, 540px)">
            <div className="p-7">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)', boxShadow: '0 4px 18px rgba(129,140,248,0.4)' }}>
                  <Brain size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1" style={{ color: '#E2E8F0' }}>Skill Memory</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: '#64748B' }}>
                    Agent membuat skill dari pengalaman — prosedur yang bisa dieksekusi ulang. Simpan sekali, panggil selamanya.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['navigate_ui', 'parse_invoice', 'summarize_doc', 'fetch_data', 'fill_form'].map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full font-mono"
                        style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.22)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, #6366F1, transparent)' }} />
            </div>
          </HoverCard>

          {/* Card 2 — Walrus Storage */}
          <HoverCard width="clamp(300px, 34vw, 480px)">
            <div className="p-7 flex flex-col h-full">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)', boxShadow: '0 4px 16px rgba(34,211,238,0.4)' }}>
                <Database size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-base mb-1.5" style={{ color: '#E2E8F0' }}>Walrus Storage</h3>
              <p className="text-xs leading-relaxed mb-5" style={{ color: '#64748B' }}>
                Skills & index tersimpan sebagai blob di Walrus. Storage terbayar otomatis — tak pernah hilang.
              </p>
              <div className="space-y-2.5 mt-auto">
                {[
                  { label: 'Skills Stored', value: '∞', sub: 'permanent' },
                  { label: 'Manual Payments', value: '0', sub: 'needed' },
                  { label: 'Availability', value: '100%', sub: 'uptime' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                    style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.1)' }}>
                    <span className="text-xs" style={{ color: '#64748B' }}>{stat.label}</span>
                    <span className="text-sm font-bold" style={{ color: '#22D3EE' }}>
                      {stat.value}{' '}
                      <span className="text-xs font-normal" style={{ color: '#475569' }}>{stat.sub}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, #22D3EE, transparent)' }} />
            </div>
          </HoverCard>

          {/* Card 3 — Auto-Funding */}
          <HoverCard width="clamp(280px, 30vw, 420px)">
            <div className="p-7">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', boxShadow: '0 4px 16px rgba(253,230,138,0.4)' }}>
                <PiggyBank size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: '#E2E8F0' }}>Auto-Funding Vault</h3>
              <p className="text-xs leading-relaxed mb-3.5" style={{ color: '#64748B' }}>
                Deposit SUI sekali. Keeper memperpanjang storage otomatis dari yield.
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['SUI', '→', 'Scallop', '→', 'Yield', '→', 'Renew'].map((s, i) =>
                  s === '→'
                    ? <span key={i} className="text-xs" style={{ color: '#475569' }}>→</span>
                    : <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                        {s}
                      </span>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, #F59E0B, transparent)' }} />
            </div>
          </HoverCard>

          {/* Card 4 — Scallop Yield */}
          <HoverCard width="clamp(260px, 26vw, 380px)">
            <div className="p-7">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #34D399 0%, #0D9488 100%)', boxShadow: '0 4px 16px rgba(52,211,153,0.4)' }}>
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: '#E2E8F0' }}>Scallop Yield</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>
                Principal diproteksi. Hanya yield yang dipakai untuk renewal — endowment abadi.
              </p>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-black leading-none" style={{ color: '#34D399' }}>~8%</span>
                <span className="text-sm font-semibold pb-0.5" style={{ color: '#475569' }}>APY</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, #34D399, transparent)' }} />
            </div>
          </HoverCard>

          {/* Card 5 — 5-Line SDK */}
          <HoverCard width="clamp(340px, 40vw, 560px)">
            <div className="p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)' }}>
                  <Code2 size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: '#E2E8F0' }}>5-Line SDK</h3>
                  <span className="text-xs" style={{ color: '#475569' }}>Python / TypeScript</span>
                </div>
              </div>
              <div className="rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div><span style={{ color: '#818CF8' }}>from</span> <span style={{ color: '#38BDF8' }}>walora</span> <span style={{ color: '#818CF8' }}>import</span> <span style={{ color: '#E2E8F0' }}>MemoryClient</span></div>
                <div className="mt-1"><span style={{ color: '#E2E8F0' }}>client</span> <span style={{ color: '#64748B' }}>=</span> <span style={{ color: '#38BDF8' }}>MemoryClient</span><span style={{ color: '#E2E8F0' }}>(vault_id)</span></div>
                <div className="mt-2.5"><span style={{ color: '#64748B' }}># Save a skill</span></div>
                <div><span style={{ color: '#E2E8F0' }}>client.</span><span style={{ color: '#34D399' }}>save_skill</span><span style={{ color: '#E2E8F0' }}>(name, procedure)</span></div>
                <div className="mt-2.5"><span style={{ color: '#64748B' }}># Retrieve on next task</span></div>
                <div><span style={{ color: '#E2E8F0' }}>context</span> <span style={{ color: '#64748B' }}>=</span> <span style={{ color: '#E2E8F0' }}>client.</span><span style={{ color: '#34D399' }}>get_context</span><span style={{ color: '#E2E8F0' }}>(query)</span></div>
              </div>
            </div>
          </HoverCard>

          {/* Card 6 — Efficient Search */}
          <HoverCard width="clamp(280px, 30vw, 420px)">
            <div className="p-7">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)', boxShadow: '0 4px 16px rgba(129,140,248,0.4)' }}>
                <Search size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1.5" style={{ color: '#E2E8F0' }}>Efficient Search</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#64748B' }}>
                Pre-computed index + embedding. Cari skill relevan tanpa fetch semua blob.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <span style={{ color: '#64748B' }}>Walora</span>
                  <span className="font-bold font-mono" style={{ color: '#34D399' }}>O(1) + top-K</span>
                </div>
                <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <span style={{ color: '#64748B' }}>Brute force</span>
                  <span className="font-bold font-mono" style={{ color: '#EF4444' }}>O(N) fetch</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, #6366F1, transparent)' }} />
            </div>
          </HoverCard>

        </motion.div>

        {/* Scroll hint */}
        <div className="relative px-6 md:px-14 max-w-6xl mx-auto w-full mt-8">
          <span className="text-xs" style={{ color: '#334155' }}>
            Scroll ↓ untuk menjelajah · scroll ↑ untuk kembali
          </span>
        </div>
      </div>
    </section>
  )
}
