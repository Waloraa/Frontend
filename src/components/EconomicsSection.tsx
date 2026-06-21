import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Wallet, TrendingUp, ShieldCheck, Hourglass } from 'lucide-react'
import AnimatedText from './ui/AnimatedText'

const metrics = [
  {
    icon: Wallet,
    label: 'Minimum Deposit',
    value: '1',
    unit: 'SUI',
    gradient: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
    glow: 'rgba(129,140,248,0.4)',
    hoverShadow: '0 0 0 1px rgba(129,140,248,0.32), 0 20px 48px rgba(99,102,241,0.15), 0 8px 20px rgba(0,0,0,0.6)',
  },
  {
    icon: TrendingUp,
    label: 'Live Scallop APY',
    value: '~2.9',
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
    label: 'Lifetime',
    value: '∞',
    unit: 'perpetual',
    gradient: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
    glow: 'rgba(253,230,138,0.4)',
    hoverShadow: '0 0 0 1px rgba(253,230,138,0.22), 0 20px 48px rgba(245,158,11,0.1), 0 8px 20px rgba(0,0,0,0.6)',
  },
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

// Radius berat sesuai prompt referensi — dipakai semua gambar showcase.
const imageRadius = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'

// Slot gambar: render <img> bila ada `src`, selain itu tampil placeholder
// gradient ber-label. `fit='contain'` dipakai untuk aset ikon/logo (koin,
// shell) supaya tampil utuh di atas backdrop gelap; `fit='cover'` untuk
// foto/banner agar mengisi penuh slot.
function ImageSlot({
  src,
  gradient,
  label,
  style,
  className = '',
  fit = 'cover',
}: {
  src?: string
  gradient: string
  label: string
  style?: React.CSSProperties
  className?: string
  fit?: 'cover' | 'contain'
}) {
  if (src) {
    if (fit === 'contain') {
      return (
        <div
          className={`w-full overflow-hidden ${imageRadius} ${className}`}
          style={{ background: gradient, ...style }}
        >
          <img
            src={src}
            alt={label}
            className="w-full h-full object-contain p-6 sm:p-8"
            style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.45))' }}
          />
        </div>
      )
    }
    return (
      <img
        src={src}
        alt={label}
        loading="lazy"
        className={`w-full h-full object-cover ${imageRadius} ${className}`}
        style={style}
      />
    )
  }
  return (
    <div
      className={`w-full flex items-end overflow-hidden ${imageRadius} ${className}`}
      style={{ background: gradient, ...style }}
    >
      <span
        className="px-5 py-4 text-sm font-semibold"
        style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 10px rgba(0,0,0,0.4)' }}
      >
        {label}
      </span>
    </div>
  )
}

// ── Data project cards (diadaptasi ke alur ekonomi Walora). Tiap gambar bisa
//    diberi `src` (URL CloudFront) nanti; tanpa src → placeholder gradient. ──
type ProjImg = {
  src?: string
  gradient: string
  label: string
  fit?: 'cover' | 'contain'
}
type Project = {
  num: string
  label: string
  title: string
  images: [ProjImg, ProjImg, ProjImg] // [kiri-atas, kiri-bawah, kanan-besar]
}

const projects: Project[] = [
  {
    num: '01',
    label: 'Deposit',
    title: 'Vault Funding',
    images: [
      {
        src: '/Vault%20Funding/ff11d856b3715ba6a521c1dbaf27477d.png',
        gradient: 'linear-gradient(140deg, #6366F1 0%, #818CF8 100%)',
        label: 'Deposit SUI',
      },
      {
        src: '/Vault%20Funding/SUI.png',
        gradient:
          'radial-gradient(circle at 50% 38%, rgba(99,102,241,0.30) 0%, rgba(11,18,38,0.96) 72%)',
        label: 'Lock Principal',
        fit: 'contain',
      },
      {
        src: '/Vault%20Funding/walrus-wal-crypto-logo-3d-icon-png-download-11711568.png',
        gradient:
          'radial-gradient(circle at 50% 40%, rgba(34,211,238,0.26) 0%, rgba(11,18,38,0.96) 74%)',
        label: 'Vault Active',
        fit: 'contain',
      },
    ],
  },
  {
    num: '02',
    label: 'Yield',
    title: 'Scallop Endowment',
    images: [
      {
        src: '/Scallop%20Endowment/1_2rEcpRpz4UdrUeqmJCRYlQ.png',
        gradient: 'linear-gradient(140deg, #22D3EE 0%, #3B82F6 100%)',
        label: 'Supply → Scallop',
      },
      {
        src: '/Scallop%20Endowment/news-cointelegraph-3-Bx-6yBOM.jpg',
        gradient: 'linear-gradient(140deg, #2DD4BF 0%, #0D9488 100%)',
        label: '~8% APY',
      },
      {
        src: '/Scallop%20Endowment/logo-BJvH6zKq.png',
        gradient:
          'radial-gradient(circle at 50% 40%, rgba(45,212,191,0.26) 0%, rgba(11,18,38,0.96) 74%)',
        label: 'Yield Flowing',
        fit: 'contain',
      },
    ],
  },
  {
    num: '03',
    label: 'Renewal',
    title: 'Renewal Storage',
    images: [
      {
        src: '/Storage%20Abadi/AI-Decrypt-Tease-gID_7.webp',
        gradient: 'linear-gradient(140deg, #FDE68A 0%, #F59E0B 100%)',
        label: 'Keeper Trigger',
      },
      {
        src: '/Storage%20Abadi/walrus%20vault.png',
        gradient: 'linear-gradient(140deg, #34D399 0%, #0D9488 100%)',
        label: 'Renew Walrus',
      },
      {
        src: '/Storage%20Abadi/WalrusMemory.jpg',
        gradient: 'linear-gradient(150deg, #FDE68A 0%, #F59E0B 55%, #B45309 100%)',
        label: 'Eternal Memory',
      },
    ],
  },
]

// Satu kartu project: header (nomor · label · title · pill) + grid gambar
// bersusun (kiri 2 tumpuk, kanan 1 besar) sesuai prompt referensi.
function ProjectCard({ p }: { p: Project }) {
  return (
    <div
      className="relative p-6 sm:p-8 backdrop-blur-xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
      style={{
        background: 'rgba(11, 18, 38, 0.94)',
        border: '1px solid rgba(99, 102, 241, 0.18)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <span
            className="text-5xl sm:text-6xl font-black leading-none"
            style={{
              color: '#F1F5F9',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {p.num}
          </span>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#818CF8' }}>
              {p.label}
            </p>
            <p className="text-base sm:text-lg font-semibold mt-0.5" style={{ color: '#E2E8F0' }}>
              {p.title}
            </p>
          </div>
        </div>
        <a
          href="#dashboard"
          className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-full transition-colors hover:bg-indigo-500/20"
          style={{
            color: '#A5B4FC',
            background: 'rgba(99,102,241,0.10)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#34D399', boxShadow: '0 0 8px #34D399' }}
          />
          Live · Testnet
        </a>
      </div>

      {/* Grid gambar bersusun: kiri 2 tumpuk · kanan 1 besar */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 items-stretch">
        <div className="flex flex-col gap-4 sm:gap-5">
          <ImageSlot
            src={p.images[0].src}
            gradient={p.images[0].gradient}
            label={p.images[0].label}
            fit={p.images[0].fit}
            style={{ height: 'clamp(130px, 16vw, 230px)' }}
          />
          <ImageSlot
            src={p.images[1].src}
            gradient={p.images[1].gradient}
            label={p.images[1].label}
            fit={p.images[1].fit}
            style={{ height: 'clamp(160px, 22vw, 340px)' }}
          />
        </div>
        <ImageSlot
          src={p.images[2].src}
          gradient={p.images[2].gradient}
          label={p.images[2].label}
          fit={p.images[2].fit}
          className="h-full"
          style={{ minHeight: 'clamp(310px, 40vw, 590px)' }}
        />
      </div>
    </div>
  )
}

// Pembungkus sticky: kartu menempel di atas (top bertingkat per index) lalu
// MENGECIL saat kartu berikutnya naik menutupinya → efek menumpuk (stack).
function StackCard({
  p,
  i,
  total,
  progress,
}: {
  p: Project
  i: number
  total: number
  progress: MotionValue<number>
}) {
  // Kartu paling bawah berakhir paling kecil; kartu teratas tetap penuh.
  const targetScale = 1 - (total - 1 - i) * 0.05
  const scale = useTransform(progress, [i / total, 1], [1, targetScale])
  // Offset top bertingkat → tepi atas kartu di bawahnya tetap mengintip.
  const top = 96 + i * 30

  return (
    <div
      className="sticky"
      // marginBottom (kecuali kartu terakhir) memberi jarak scroll antar kartu
      // dalam flow sehingga tiap kartu sempat terlihat sebelum tertutup.
      style={{ top, marginBottom: i < total - 1 ? 28 : 0 }}
    >
      <motion.div style={{ scale, transformOrigin: 'top center' }}>
        <ProjectCard p={p} />
      </motion.div>
    </div>
  )
}

export default function EconomicsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  // Progress scroll sepanjang area tumpukan → dipakai tiap StackCard untuk scale.
  const stackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="economics"
      ref={ref}
      className="relative w-full py-28 px-6 md:px-14 scroll-mt-16"
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
            Funded once,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              eternal forever.
            </span>
          </h2>
          <AnimatedText
            text="Walrus Memory bills for storage renewal. Walora pays that bill — permanently. Principal never touched, only yield spent. A small deposit sustains agent memory for decades."
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

        {/* Project cards yang MENUMPUK saat di-scroll (sticky + scale).
            Semua kartu adalah sibling LANGSUNG di dalam stackRef (container
            tinggi) agar sticky-nya bekerja: tiap kartu menempel di atas lalu
            mengecil ketika kartu berikutnya naik menutupinya. */}
        <div ref={stackRef} className="relative">
          {projects.map((p, i) => (
            <StackCard
              key={p.num}
              p={p}
              i={i}
              total={projects.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-sm mt-8"
          style={{ color: '#374151' }}
        >
          Smart contract: 18/18 tests passing · principal protection · automatic
          fee distribution on renewal.
        </motion.p>
      </div>
    </section>
  )
}
