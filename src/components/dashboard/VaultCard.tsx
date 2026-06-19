import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import {
  Vault,
  Coins,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'
import { EXPLORER_OBJECT } from '../../lib/constants'
import type { VaultState } from '../../lib/types'
import TiltCard from '../ui/TiltCard'
import CountUp from '../ui/CountUp'

const sui = (n: number) =>
  `${n.toLocaleString('en-US', { maximumFractionDigits: 4 })} SUI`

const short = (addr: string) =>
  addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr

const CARD_BASE: CSSProperties = {
  background: 'rgba(11, 18, 38, 0.88)',
  border: '1px solid rgba(99, 102, 241, 0.18)',
  boxShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
  borderRadius: '1.5rem',
}

const STAT_BASE: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '1rem',
}

export default function VaultCard({ vault }: { vault: VaultState }) {
  const coverage = vault.principalFloor
    ? (vault.funds / vault.principalFloor) * 100
    : 0

  const stats = [
    {
      icon: ShieldCheck,
      label: 'Principal Floor',
      value: sui(vault.principalFloor),
      hint: 'Tidak pernah tersentuh',
      gradient: 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)',
    },
    {
      icon: TrendingUp,
      label: 'Claimable Yield',
      value: sui(vault.claimableYield),
      hint: 'Siap dipakai renewal',
      gradient: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
    },
    {
      icon: RefreshCw,
      label: 'Total Renewals',
      value: vault.totalRenewals.toLocaleString('en-US'),
      hint: `${sui(vault.totalYieldConsumed)} terpakai`,
      gradient: 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
    <TiltCard
      style={CARD_BASE}
      className="p-7 backdrop-blur-xl"
      hoverShadow="0 0 0 1px rgba(129, 140, 248, 0.35), 0 24px 64px rgba(99, 102, 241, 0.14), 0 8px 24px rgba(0, 0, 0, 0.6)"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Vault size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight" style={{ color: '#E2E8F0' }}>
              Storage Vault
            </h3>
            <a
              href={EXPLORER_OBJECT(vault.id)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#818CF8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              {short(vault.id)}
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={
            vault.status === 'active'
              ? {
                  background: 'rgba(52, 211, 153, 0.1)',
                  color: '#34D399',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                }
              : {
                  background: 'rgba(255,255,255,0.06)',
                  color: '#64748B',
                  border: '1px solid rgba(255,255,255,0.1)',
                }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: vault.status === 'active' ? '#34D399' : '#4B5563',
            }}
          />
          {vault.status === 'active' ? 'Active' : 'Closed'}
        </span>
      </div>

      {/* Funds hero */}
      <div className="mt-7 flex items-end gap-2">
        <Coins size={20} style={{ color: '#818CF8', marginBottom: 6 }} />
        <span
          className="text-4xl font-bold leading-none tracking-tight"
          style={{ color: '#F1F5F9' }}
        >
          <CountUp value={vault.funds} decimals={2} suffix=" SUI" />
        </span>
        <span className="text-sm mb-1" style={{ color: '#475569' }}>
          total funds
        </span>
      </div>

      {/* Coverage bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: '#475569' }}>
          <span>Principal protection</span>
          <span className="font-semibold" style={{ color: '#94A3B8' }}>
            {coverage.toFixed(1)}% funded
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, coverage)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
            style={{
              height: '100%',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #818CF8 0%, #34D399 100%)',
            }}
          />
        </div>
      </div>

      {/* Stat grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              style={STAT_BASE}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="p-4"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: s.gradient, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-xs font-medium" style={{ color: '#475569' }}>
                {s.label}
              </p>
              <p
                className="text-lg font-bold leading-tight mt-0.5"
                style={{ color: '#E2E8F0' }}
              >
                {s.value}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: '#374151' }}>
                {s.hint}
              </p>
            </motion.div>
          )
        })}
      </div>

      <p className="mt-5 text-xs" style={{ color: '#374151' }}>
        Keeper{' '}
        <span className="font-mono" style={{ color: '#4B5563' }}>
          {short(vault.keeper)}
        </span>{' '}
        memperpanjang storage otomatis dari yield — principal aman.
      </p>
    </TiltCard>
    </motion.div>
  )
}
