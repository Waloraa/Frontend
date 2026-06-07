import { motion } from 'framer-motion'
import { History, RefreshCw, Coins, PlusCircle, ExternalLink } from 'lucide-react'
import { EXPLORER_TX } from '../../lib/constants'
import type { RenewalEvent, RenewalEventKind } from '../../lib/types'

const META: Record<
  RenewalEventKind,
  { icon: typeof RefreshCw; label: string; color: string; ring: string }
> = {
  BlobExtended: {
    icon: RefreshCw,
    label: 'Storage diperpanjang',
    color: 'text-cyan-600',
    ring: 'bg-cyan-100',
  },
  YieldClaimed: {
    icon: Coins,
    label: 'Yield diklaim',
    color: 'text-violet-600',
    ring: 'bg-violet-100',
  },
  BlobRegistered: {
    icon: PlusCircle,
    label: 'Blob didaftarkan',
    color: 'text-emerald-600',
    ring: 'bg-emerald-100',
  },
}

const sui = (n: number) =>
  `${n.toLocaleString('en-US', { maximumFractionDigits: 4 })} SUI`

const timeAgo = (ms?: number) => {
  if (!ms) return '—'
  const diff = Date.now() - ms
  const d = Math.floor(diff / 86_400_000)
  if (d > 0) return `${d}h lalu`
  const h = Math.floor(diff / 3_600_000)
  if (h > 0) return `${h}j lalu`
  const m = Math.floor(diff / 60_000)
  return `${Math.max(1, m)}m lalu`
}

export default function RenewalLog({ events }: { events: RenewalEvent[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-3xl p-7 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
          <History size={22} className="text-white" />
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold text-lg leading-tight">
            Renewal Log
          </h3>
          <p className="text-xs text-gray-500">Event auto-renewal on-chain</p>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">
          Belum ada event renewal.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-200/60">
          {events.map((e, i) => {
            const m = META[e.kind]
            const Icon = m.icon
            return (
              <motion.li
                key={`${e.txDigest}-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-3"
              >
                <span
                  className={`w-9 h-9 rounded-xl ${m.ring} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={16} className={m.color} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {m.label}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {e.endEpoch ? `→ epoch ${e.endEpoch}` : ''}
                    {e.yieldUsed && e.kind === 'YieldClaimed'
                      ? `${sui(e.yieldUsed)}`
                      : ''}
                    {e.blobId ? ` · ${e.blobId.slice(0, 10)}…` : ''}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-gray-400 block">
                    {timeAgo(e.timestampMs)}
                  </span>
                  {e.txDigest && (
                    <a
                      href={EXPLORER_TX(e.txDigest)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 text-[11px] text-gray-300 hover:text-violet-600 transition-colors font-mono"
                    >
                      tx <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}
    </motion.div>
  )
}
