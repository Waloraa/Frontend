import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { History, RefreshCw, Coins, PlusCircle, ExternalLink } from 'lucide-react'
import { EXPLORER_TX } from '../../lib/constants'
import type { RenewalEvent, RenewalEventKind } from '../../lib/types'

const META: Record<
  RenewalEventKind,
  {
    icon: typeof RefreshCw
    label: string
    iconColor: string
    ringStyle: CSSProperties
  }
> = {
  BlobExtended: {
    icon: RefreshCw,
    label: 'Storage diperpanjang',
    iconColor: '#22D3EE',
    ringStyle: {
      background: 'rgba(34, 211, 238, 0.1)',
      border: '1px solid rgba(34, 211, 238, 0.2)',
    },
  },
  YieldClaimed: {
    icon: Coins,
    label: 'Yield diklaim',
    iconColor: '#818CF8',
    ringStyle: {
      background: 'rgba(129, 140, 248, 0.1)',
      border: '1px solid rgba(129, 140, 248, 0.2)',
    },
  },
  BlobRegistered: {
    icon: PlusCircle,
    label: 'Blob didaftarkan',
    iconColor: '#34D399',
    ringStyle: {
      background: 'rgba(52, 211, 153, 0.1)',
      border: '1px solid rgba(52, 211, 153, 0.2)',
    },
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

const CARD_BASE: CSSProperties = {
  background: 'rgba(11, 18, 38, 0.88)',
  border: '1px solid rgba(99, 102, 241, 0.18)',
  boxShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
  borderRadius: '1.5rem',
}

export default function RenewalLog({ events }: { events: RenewalEvent[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{
        y: -6,
        boxShadow:
          '0 0 0 1px rgba(34, 211, 238, 0.28), 0 24px 64px rgba(34, 211, 238, 0.07), 0 8px 24px rgba(0, 0, 0, 0.6)',
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={CARD_BASE}
      className="p-7 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)',
            boxShadow: '0 4px 16px rgba(34, 211, 238, 0.3)',
          }}
        >
          <History size={22} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight" style={{ color: '#E2E8F0' }}>
            Renewal Log
          </h3>
          <p className="text-xs" style={{ color: '#475569' }}>
            Event auto-renewal on-chain
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: '#374151' }}>
          Belum ada event renewal.
        </p>
      ) : (
        <ul className="flex flex-col">
          {events.map((e, i) => {
            const m = META[e.kind]
            const Icon = m.icon
            return (
              <motion.li
                key={`${e.txDigest}-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 py-3"
                style={
                  i < events.length - 1
                    ? { borderBottom: '1px solid rgba(255,255,255,0.05)' }
                    : {}
                }
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={m.ringStyle}
                >
                  <Icon size={16} style={{ color: m.iconColor }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight" style={{ color: '#CBD5E1' }}>
                    {m.label}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#374151' }}>
                    {e.endEpoch ? `→ epoch ${e.endEpoch}` : ''}
                    {e.yieldUsed && e.kind === 'YieldClaimed'
                      ? `${sui(e.yieldUsed)}`
                      : ''}
                    {e.blobId ? ` · ${e.blobId.slice(0, 10)}…` : ''}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs block" style={{ color: '#374151' }}>
                    {timeAgo(e.timestampMs)}
                  </span>
                  {e.txDigest && (
                    <a
                      href={EXPLORER_TX(e.txDigest)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 text-[11px] font-mono transition-colors"
                      style={{ color: '#1F2937' }}
                      onMouseEnter={(el) => (el.currentTarget.style.color = '#818CF8')}
                      onMouseLeave={(el) => (el.currentTarget.style.color = '#1F2937')}
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
