import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRightCircle, Brain, Database, Infinity as InfinityIcon } from 'lucide-react'

const fadeUp = (i: number) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as number[],
    },
  },
})

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100vw',
        maxWidth: '100vw',
        marginLeft: 'calc(50% - 50vw)',
      }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background video with parallax */}
      <motion.div
        style={{ y: videoY, scale: videoScale, transformOrigin: 'right center' }}
        className="absolute top-0 bottom-0 -left-8 -right-16 md:-right-24"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/TemplateVideo.mp4"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center right',
          }}
        />
      </motion.div>

      {/* Dark blue left-to-right overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to right, rgba(4,9,26,0.97) 0%, rgba(4,9,26,0.88) 45%, rgba(4,9,26,0.55) 70%, rgba(4,9,26,0.2) 100%)',
        }}
      />

      {/* Bottom fade into the next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #050C1A 100%)',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '-5%',
            width: 600,
            height: 600,
            background:
              'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Content — pt-24 to clear fixed navbar */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-14 lg:px-20 pt-24 max-w-2xl">
        <motion.span
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold tracking-wide px-3.5 py-1.5 rounded-full mb-5"
          style={{
            background: 'rgba(99, 102, 241, 0.14)',
            color: '#818CF8',
            border: '1px solid rgba(99, 102, 241, 0.28)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#818CF8' }}
          />
          Walrus Track · Sui Overflow 2026
        </motion.span>

        <motion.h1
          variants={fadeUp(1)}
          initial="hidden"
          animate="visible"
          className="text-[1.9rem] sm:text-[2.4rem] lg:text-[2.8rem] font-bold leading-[1.15] tracking-tight"
          style={{
            color: '#F1F5F9',
            fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <span className="inline-flex items-center gap-2.5">
            <Brain size={28} style={{ color: '#818CF8' }} className="flex-shrink-0" />
            Agents that learn.
          </span>
          <br />
          <span className="inline-flex items-center gap-2.5 flex-wrap">
            Memory that lasts{' '}
            <InfinityIcon size={26} style={{ color: '#818CF8' }} className="flex-shrink-0" />
          </span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            forever.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp(2)}
          initial="hidden"
          animate="visible"
          className="mt-5 text-sm sm:text-base leading-relaxed max-w-md"
          style={{ color: '#94A3B8' }}
        >
          Walora memberi AI agent kemampuan menyimpan & memanggil kembali{' '}
          <span className="font-semibold" style={{ color: '#E2E8F0' }}>
            skill dari pengalaman
          </span>{' '}
          — tersimpan di Walrus, didanai selamanya oleh yield Scallop.
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
            className="inline-flex items-center gap-3 text-white font-semibold text-base px-7 py-3.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
              boxShadow: '0 6px 28px rgba(99, 102, 241, 0.45)',
            }}
          >
            View Live Dashboard
            <ArrowRightCircle size={20} />
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 font-semibold text-base px-7 py-3.5 rounded-full transition-colors duration-200"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#E2E8F0',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
          >
            How it Works
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeUp(4)}
          initial="hidden"
          animate="visible"
          className="mt-10 flex items-center gap-6 text-xs font-medium flex-wrap"
          style={{ color: '#475569' }}
        >
          <span className="flex items-center gap-1.5">
            <Database size={13} style={{ color: '#818CF8' }} />
            Walrus-backed storage
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: '#34D399' }}
            />
            Auto-funded vault
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: '#34D399' }}
            />
            18/18 contract tests
          </span>
        </motion.div>
      </div>
    </section>
  )
}
