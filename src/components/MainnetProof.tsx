import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, Vault, Coins, TrendingUp, ExternalLink } from 'lucide-react'
import {
  MAINNET,
  SCALLOP,
  EXPLORER_MAINNET_OBJECT,
  EXPLORER_MAINNET_TX,
} from '../lib/constants'

const proofs = [
  {
    icon: Rocket,
    label: 'Package deployed',
    value: 'Live on mainnet',
    sub: 'Smart contracts published with real SUI',
    href: EXPLORER_MAINNET_OBJECT(MAINNET.packageId),
  },
  {
    icon: Vault,
    label: 'Endowment vault',
    value: '0.5 SUI principal',
    sub: '0.4 SUI floor — protected, never spent',
    href: EXPLORER_MAINNET_OBJECT(MAINNET.vaultId),
  },
  {
    icon: Coins,
    label: 'Yield claimed on-chain',
    value: '0.1 SUI',
    sub: 'Principal floor untouched — verifiable',
    href: EXPLORER_MAINNET_TX(MAINNET.yieldClaimedTx),
  },
  {
    icon: TrendingUp,
    label: 'Real Scallop yield',
    value: `1 sSUI = ${SCALLOP.conversionRate} SUI`,
    sub: `~${(SCALLOP.supplyApy * 100).toFixed(2)}% live supply APY`,
    href: 'https://app.scallop.io/',
  },
]

export default function MainnetProof() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="mainnet"
      ref={ref}
      className="relative py-24 px-6 md:px-10"
      style={{ background: '#050C1A' }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide px-3.5 py-1.5 rounded-full mb-5"
            style={{
              background: 'rgba(52,211,153,0.14)',
              color: '#6EE7B7',
              border: '1px solid rgba(52,211,153,0.3)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34D399' }} />
            Real SUI · Sui Mainnet
          </span>
          <h2
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              color: '#F8FAFC',
              fontWeight: 400,
              lineHeight: 1.15,
            }}
          >
            Not a testnet promise — proven on mainnet
          </h2>
          <p
            className="mt-4 mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 620, fontSize: 17 }}
          >
            The whole economic loop runs on Sui mainnet with real SUI: an endowment
            vault, yield claimed on-chain, principal protected, and yield read live
            from Scallop. Every claim below is verifiable on Suiscan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {proofs.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #34D399 0%, #0D9488 100%)' }}
                >
                  <Icon size={20} color="#04140F" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {p.label}
                    <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </div>
                  <div className="mt-1 font-semibold" style={{ color: '#F8FAFC', fontSize: 18 }}>
                    {p.value}
                  </div>
                  <div className="mt-0.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {p.sub}
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
