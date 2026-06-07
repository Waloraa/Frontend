import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Search, PiggyBank, TrendingUp, Database, Code2 } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Skill Memory',
    desc: 'Agent membuat skill dari pengalaman — prosedur yang bisa dieksekusi ulang, bukan sekadar teks. Simpan sekali, panggil kembali selamanya.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Search,
    title: 'Efficient Search',
    desc: 'Pre-computed index + embedding. Cari skill relevan tanpa fetch semua blob — cukup 1 index fetch + top-K skill, bukan O(N).',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: PiggyBank,
    title: 'Auto-Funding Vault',
    desc: 'Deposit SUI sekali. Keeper memperpanjang storage MemWal otomatis dari yield — tanpa pembayaran storage manual.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Scallop Yield',
    desc: 'Principal diproteksi dan tak pernah tersentuh. Hanya yield (~8% APY) yang dipakai untuk renewal — endowment yang abadi.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Database,
    title: 'Walrus Storage',
    desc: 'Setiap skill & index tersimpan sebagai blob di Walrus. Storage selalu terbayar, jadi skill yang dipelajari tak pernah hilang.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Code2,
    title: '5-Line SDK',
    desc: 'Developer manapun bisa memberi agent-nya skill memory hanya dengan beberapa baris Python — save_skill, search, get_context.',
    color: 'from-indigo-500 to-violet-500',
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

export default function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="how"
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
            How it Works
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mt-2"
            style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif' }}
          >
            Tiga layer,
            <br />
            <span className="text-violet-600">satu memory abadi.</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            Skill layer untuk belajar, memory layer untuk search efisien, funding
            layer untuk membayar storage selamanya — semua di atas Walrus.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-md`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
