import { motion } from 'framer-motion'
import {
  Radio,
  RefreshCw,
  AlertCircle,
  Search,
  LayoutDashboard,
  Vault as VaultIcon,
  Brain,
  History,
  Calculator,
  Bell,
} from 'lucide-react'
import { useWaloraaData } from '../hooks/useWaloraaData'
import VaultCard from './dashboard/VaultCard'
import SkillTimeline from './dashboard/SkillTimeline'
import RenewalLog from './dashboard/RenewalLog'
import SustainabilityCalc from './dashboard/SustainabilityCalc'
import CreateVaultCard from './dashboard/CreateVaultCard'
import StoreMemoryCard from './dashboard/StoreMemoryCard'
import SearchMemory from './dashboard/SearchMemory'
import AgentChat from './dashboard/AgentChat'

// Sidebar ala app window — Overview aktif, sisanya dekoratif (hover only).
const NAV = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: VaultIcon, label: 'Vault' },
  { icon: Brain, label: 'Skill Memory' },
  { icon: History, label: 'Renewals' },
  { icon: Calculator, label: 'Sustainability' },
]

export default function DashboardSection() {
  const { vault, index, events, source, loading, error, refresh } =
    useWaloraaData()

  return (
    <section
      id="dashboard"
      className="relative z-10 w-full -mt-36 pb-28 px-4 sm:px-6 md:px-10 scroll-mt-16"
      style={{ background: 'transparent' }}
    >
      <div className="relative max-w-6xl mx-auto">
        {/* App window frame — dashboard panel ala referensi */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden backdrop-blur-xl"
          style={{
            background: 'rgba(7, 12, 28, 0.97)',
            border: '1px solid rgba(99, 102, 241, 0.22)',
            borderRadius: '20px',
            boxShadow:
              '0 0 0 1px rgba(99,102,241,0.06), 0 40px 120px rgba(0,0,0,0.65), 0 0 80px rgba(99,102,241,0.07)',
          }}
        >
          {/* Window header bar */}
          <div
            className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4"
            style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.14)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <h2
                className="text-base sm:text-lg font-semibold truncate"
                style={{ color: '#E2E8F0', fontFamily: 'Inter, sans-serif' }}
              >
                Dashboard Overview
              </h2>
              <span
                className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full flex-shrink-0"
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
                  size={11}
                  className={source === 'live' ? 'animate-pulse' : ''}
                />
                {loading
                  ? 'Memuat…'
                  : source === 'live'
                  ? 'Live · Sui testnet'
                  : 'Demo data'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Search pill — dekoratif, melengkapi tampilan app window */}
              <div
                className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#475569',
                }}
              >
                <Search size={13} />
                Search anything…
              </div>
              <button
                onClick={refresh}
                title="Refresh data"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-indigo-500/20"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#818CF8',
                }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748B',
                }}
              >
                <Bell size={14} />
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
                }}
              >
                W
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <aside
              className="hidden lg:flex flex-col w-56 flex-shrink-0 p-4 gap-1"
              style={{ borderRight: '1px solid rgba(99, 102, 241, 0.14)' }}
            >
              <p
                className="text-[10px] font-semibold tracking-widest uppercase px-3 mb-2"
                style={{ color: '#475569' }}
              >
                General
              </p>
              {NAV.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors"
                    style={
                      item.active
                        ? {
                            background: 'rgba(99, 102, 241, 0.18)',
                            color: '#C7D2FE',
                            border: '1px solid rgba(99, 102, 241, 0.28)',
                          }
                        : { color: '#64748B', border: '1px solid transparent' }
                    }
                    onMouseEnter={(e) => {
                      if (!item.active)
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                    onMouseLeave={(e) => {
                      if (!item.active)
                        e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                )
              })}

              <div className="mt-auto pt-6">
                <p
                  className="text-[11px] leading-relaxed px-3"
                  style={{ color: '#374151' }}
                >
                  State dibaca langsung dari Sui testnet & Walrus.
                </p>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 p-4 sm:p-5 md:p-6">
              {error && (
                <p
                  className="mb-4 inline-flex items-center gap-1.5 text-xs"
                  style={{ color: '#FBBF24' }}
                >
                  <AlertCircle size={13} />
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                <div className="flex flex-col gap-5">
                  <VaultCard vault={vault} />
                  <RenewalLog events={events} />
                </div>
                <div className="flex flex-col gap-5">
                  <SkillTimeline index={index} />
                  <SustainabilityCalc />
                </div>
              </div>

              {/* Agent Demo — working system dengan Walrus memory */}
              <div className="mt-5">
                <AgentChat />
              </div>

              {/* Store + Search Memory */}
              <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-5">
                <StoreMemoryCard onStored={refresh} />
                <SearchMemory indexBlobId={null} />
              </div>

              <div className="mt-5">
                <CreateVaultCard />
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
