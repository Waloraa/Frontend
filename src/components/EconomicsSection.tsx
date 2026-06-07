import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Wallet, TrendingUp, ShieldCheck, Hourglass } from 'lucide-react'

const metrics = [
  { icon: Wallet, label: 'Deposit minimum', value: '1', unit: 'SUI' },
  { icon: TrendingUp, label: 'APY Scallop (est.)', value: '~8', unit: '%' },
  { icon: ShieldCheck, label: 'Coverage (5 SUI)', value: '~20', unit: '×' },
  { icon: Hourglass, label: 'Durasi (5 SUI)', value: '~80', unit: 'tahun' },
]

const compare = [
  { k: 'Token', testnet: 'SUI (1:1)', mainnet: 'sSUI dari Scallop' },
  { k: 'Walrus epoch', testnet: '1 hari', mainnet: '2 minggu' },
  { k: 'Scallop yield', testnet: 'Simulasi', mainnet: 'Real APY ~8%' },
  { k: 'Protocol fee', testnet: '2% dari yield', mainnet: '2% dari yield' },
  { k: 'Keeper reward', testnet: '0.1% dari yield', mainnet: '0.1% dari yield' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function EconomicsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="economics"
      ref={ref}
      className="w-full py-24 px-6 md:px-14 scroll-mt-16"
      style={{ background: '#E8E4DC' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3 bg-violet-100 px-4 py-1.5 rounded-full">
            Economic Model
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mt-2"
            style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif' }}
          >
            Didanai sekali,
            <br />
            <span className="text-violet-600">abadi selamanya.</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            Principal tidak pernah tersentuh — hanya yield yang dipakai untuk
            renewal. Satu deposit kecil mendanai storage skill selama puluhan tahun.
          </p>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {metrics.map((m, i) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.label}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-6 shadow-sm text-center"
              >
                <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mb-4 shadow-md">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900 leading-none">
                    {m.value}
                  </span>
                  <span className="text-sm text-gray-400 mb-0.5">{m.unit}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{m.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Testnet vs Mainnet */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl overflow-hidden border border-white/80 shadow-sm bg-white/60 backdrop-blur-sm"
        >
          <div className="grid grid-cols-3 text-sm">
            {/* header row */}
            <div className="px-5 py-4 font-semibold text-gray-400 bg-white/40" />
            <div className="px-5 py-4 font-semibold text-gray-700 bg-white/40 border-l border-white/70">
              Testnet
            </div>
            <div className="px-5 py-4 font-semibold text-violet-700 bg-violet-50 border-l border-white/70">
              Mainnet
            </div>

            {compare.map((row, i) => (
              <div key={row.k} className="contents">
                <div
                  className={`px-5 py-4 text-gray-500 font-medium ${
                    i % 2 ? 'bg-white/20' : ''
                  }`}
                >
                  {row.k}
                </div>
                <div
                  className={`px-5 py-4 text-gray-700 border-l border-white/70 ${
                    i % 2 ? 'bg-white/20' : ''
                  }`}
                >
                  {row.testnet}
                </div>
                <div
                  className={`px-5 py-4 text-gray-800 font-medium border-l border-white/70 ${
                    i % 2 ? 'bg-violet-50/40' : 'bg-violet-50/20'
                  }`}
                >
                  {row.mainnet}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          Smart contract: 18/18 tests passing · principal protection · fee
          distribution otomatis saat renewal.
        </motion.p>
      </div>
    </section>
  )
}
