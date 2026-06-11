import { motion } from 'framer-motion'
import { Radio, RefreshCw, AlertCircle } from 'lucide-react'
import { useWaloraaData } from '../hooks/useWaloraaData'
import VaultCard from './dashboard/VaultCard'
import SkillTimeline from './dashboard/SkillTimeline'
import RenewalLog from './dashboard/RenewalLog'
import SustainabilityCalc from './dashboard/SustainabilityCalc'
import CreateVaultCard from './dashboard/CreateVaultCard'

export default function DashboardSection() {
  const { vault, index, events, source, loading, error, refresh } =
    useWaloraaData()

  return (
    <section
      id="dashboard"
      className="relative z-10 w-full -mt-24 pt-10 md:pt-12 pb-28 px-6 md:px-14 scroll-mt-16 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #040912 0%, #071020 45%, #04091A 100%)',
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '10%',
            width: 480,
            height: 480,
            background:
              'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            right: '8%',
            width: 560,
            height: 560,
            background:
              'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            Live Dashboard
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold leading-tight mt-2"
            style={{
              color: '#E2E8F0',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            Memory yang hidup,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              on-chain & terverifikasi.
            </span>
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: '#64748B' }}>
            State Walora yang berjalan di Sui testnet — vault, skill memory, dan
            riwayat auto-renewal, dibaca langsung dari chain & Walrus.
          </p>

          {/* Status badge */}
          <div className="mt-7 inline-flex items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full"
              style={
                source === 'live'
                  ? {
                      background: 'rgba(52, 211, 153, 0.1)',
                      color: '#34D399',
                      border: '1px solid rgba(52, 211, 153, 0.2)',
                    }
                  : {
                      background: 'rgba(251, 191, 36, 0.1)',
                      color: '#FBBF24',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                    }
              }
            >
              <Radio
                size={13}
                className={source === 'live' ? 'animate-pulse' : ''}
              />
              {loading
                ? 'Memuat data…'
                : source === 'live'
                ? 'Live · Sui testnet'
                : 'Demo data'}
            </span>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = '#818CF8')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = '#475569')
              }
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {error && (
            <p
              className="mt-3 inline-flex items-center gap-1.5 text-xs"
              style={{ color: '#FBBF24' }}
            >
              <AlertCircle size={13} />
              {error}
            </p>
          )}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col gap-5">
            <VaultCard vault={vault} />
            <RenewalLog events={events} />
          </div>
          <div className="flex flex-col gap-5">
            <SkillTimeline index={index} />
            <SustainabilityCalc />
          </div>
        </div>

        <div className="mt-5">
          <CreateVaultCard />
        </div>
      </div>
    </section>
  )
}
