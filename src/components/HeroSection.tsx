import { motion } from 'framer-motion'
import { ArrowRightCircle, Brain, Database, Infinity as InfinityIcon } from 'lucide-react'
import Navbar from './Navbar'

const fadeUp = (i: number) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as number[] },
  },
})

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4"
      />

      {/* Left gradient — pastikan teks tetap terbaca */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(232,228,220,0.92) 0%, rgba(232,228,220,0.75) 40%, rgba(232,228,220,0.15) 70%, transparent 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(232,228,220,0.95))',
        }}
      />

      <Navbar />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-14 lg:px-20 pt-20 max-w-2xl">
        <motion.span
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold tracking-wide text-violet-700 bg-violet-100 px-3.5 py-1.5 rounded-full mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Walrus Track · Sui Overflow 2026
        </motion.span>

        <motion.h1
          variants={fadeUp(1)}
          initial="hidden"
          animate="visible"
          className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] text-gray-900 tracking-tight"
          style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif' }}
        >
          <span className="inline-flex items-center gap-2.5">
            <Brain size={36} className="text-violet-600 flex-shrink-0" />
            Agents that learn.
          </span>
          <br />
          <span className="inline-flex items-center gap-2.5 flex-wrap">
            Memory that lasts{' '}
            <InfinityIcon size={34} className="text-violet-600 flex-shrink-0" />
          </span>
          <br />
          <span className="text-violet-600">forever.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp(2)}
          initial="hidden"
          animate="visible"
          className="mt-6 text-gray-600 text-base sm:text-lg leading-relaxed max-w-md"
        >
          Waloraa memberi AI agent kemampuan menyimpan & memanggil kembali{' '}
          <span className="font-semibold text-gray-800">skill dari pengalaman</span> —
          tersimpan di Walrus, didanai selamanya oleh yield Scallop.
        </motion.p>

        <motion.div
          variants={fadeUp(3)}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <motion.a
            href="#dashboard"
            whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-base px-7 py-3.5 rounded-full shadow-lg transition-colors duration-200"
          >
            View Live Dashboard
            <ArrowRightCircle size={20} />
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 bg-white/70 hover:bg-white text-gray-800 font-semibold text-base px-7 py-3.5 rounded-full border border-white/80 shadow-sm transition-colors duration-200"
          >
            How it Works
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeUp(4)}
          initial="hidden"
          animate="visible"
          className="mt-10 flex items-center gap-6 text-xs text-gray-500 font-medium flex-wrap"
        >
          <span className="flex items-center gap-1.5">
            <Database size={13} className="text-violet-500" />
            Walrus-backed storage
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Auto-funded vault
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            18/18 contract tests
          </span>
        </motion.div>
      </div>
    </section>
  )
}
