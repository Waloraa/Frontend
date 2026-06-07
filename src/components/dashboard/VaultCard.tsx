import { motion } from 'framer-motion'
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

const sui = (n: number) =>
  `${n.toLocaleString('en-US', { maximumFractionDigits: 4 })} SUI`

const short = (addr: string) =>
  addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr

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
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: TrendingUp,
      label: 'Claimable Yield',
      value: sui(vault.claimableYield),
      hint: 'Siap dipakai renewal',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: RefreshCw,
      label: 'Total Renewals',
      value: vault.totalRenewals.toLocaleString('en-US'),
      hint: `${sui(vault.totalYieldConsumed)} terpakai`,
      color: 'from-cyan-500 to-blue-600',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-3xl p-7 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md">
            <Vault size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold text-lg leading-tight">
              Storage Vault
            </h3>
            <a
              href={EXPLORER_OBJECT(vault.id)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 transition-colors font-mono"
            >
              {short(vault.id)}
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
            vault.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              vault.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          {vault.status === 'active' ? 'Active' : 'Closed'}
        </span>
      </div>

      {/* Funds hero */}
      <div className="mt-6 flex items-end gap-2">
        <Coins size={20} className="text-violet-500 mb-1.5" />
        <span className="text-4xl font-bold text-gray-900 leading-none tracking-tight">
          {sui(vault.funds)}
        </span>
        <span className="text-sm text-gray-400 mb-1">total funds</span>
      </div>

      {/* Coverage bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Principal protection</span>
          <span className="font-semibold text-gray-700">
            {coverage.toFixed(1)}% funded
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-200/70 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, coverage)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400"
          />
        </div>
      </div>

      {/* Stat grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-2xl bg-white/60 border border-white/70 p-4"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}
              >
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">
                {s.value}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.hint}</p>
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-xs text-gray-400">
        Keeper{' '}
        <span className="font-mono text-gray-500">{short(vault.keeper)}</span>{' '}
        memperpanjang storage otomatis dari yield — principal aman.
      </p>
    </motion.div>
  )
}
