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
      className="w-full py-24 px-6 md:px-14 scroll-mt-16"
      style={{ background: '#DEDAD1' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3 bg-violet-100 px-4 py-1.5 rounded-full">
            Live Dashboard
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mt-2"
            style={{
              fontFamily:
                '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            Memory yang hidup,
            <br />
            <span className="text-violet-600">on-chain & terverifikasi.</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            State Waloraa yang berjalan di Sui testnet — vault, skill memory, dan
            riwayat auto-renewal, dibaca langsung dari chain & Walrus.
          </p>

          {/* Status badge */}
          <div className="mt-6 inline-flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full ${
                source === 'live'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Radio
                size={13}
                className={
                  source === 'live'
                    ? 'text-green-500 animate-pulse'
                    : 'text-amber-500'
                }
              />
              {loading
                ? 'Memuat data…'
                : source === 'live'
                ? 'Live · Sui testnet'
                : 'Demo data'}
            </span>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-violet-600 transition-colors"
            >
              <RefreshCw
                size={13}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>

          {error && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-600">
              <AlertCircle size={13} />
              {error}
            </p>
          )}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-6">
            <VaultCard vault={vault} />
            <RenewalLog events={events} />
          </div>
          <div className="flex flex-col gap-6">
            <SkillTimeline index={index} />
            <SustainabilityCalc />
          </div>
        </div>

        {/* Bonus: connect wallet + create vault (write flow) */}
        <div className="mt-6">
          <CreateVaultCard />
        </div>
      </div>
    </section>
  )
}
