import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRightCircle, Database } from 'lucide-react'
import ParticleField from './three/ParticleField'

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
        style={{ y: videoY, scale: videoScale }}
        className="absolute -top-8 -bottom-8 left-0 right-0"
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
            objectPosition: 'center',
          }}
        />
      </motion.div>

      {/* Uniform dark-blue overlay — teks sekarang di tengah, jadi overlay merata */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'rgba(4, 9, 26, 0.78)' }}
      />
      {/* Vignette samping agar fokus ke tengah */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(4,9,26,0.55) 100%)',
        }}
      />

      {/* Bottom fade into the dashboard panel */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #050C1A 100%)',
        }}
      />

      {/* 3D particle neural network */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <ParticleField />
      </div>

      {/* Content — centered, pt utk navbar, pb besar agar dashboard panel mengintip */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-10 pt-24 pb-40 max-w-4xl mx-auto">
        <motion.span
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold tracking-wide px-3.5 py-1.5 rounded-full mb-7"
          style={{
            background: 'rgba(99, 102, 241, 0.14)',
            color: '#A5B4FC',
            border: '1px solid rgba(99, 102, 241, 0.3)',
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
          style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            color: '#F8FAFC',
            fontWeight: 400,
          }}
        >
          Agents that learn,
          <br />
          memory <em style={{ fontStyle: 'italic', margin: '0 0.06em' }}>that</em>{' '}
          lasts{' '}
          <span
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            forever
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp(2)}
          initial="hidden"
          animate="visible"
          className="mt-6 leading-relaxed mx-auto"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 18,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 662,
          }}
        >
          The economic layer for autonomous agents. Endow an agent once —
          Scallop yield pays to renew its memory on Walrus forever, with no
          human to top up. Principal protected, memory eternal. Live on mainnet.
        </motion.p>

        <motion.div
          variants={fadeUp(3)}
          initial="hidden"
          animate="visible"
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href="#dashboard"
            whileHover={{ scale: 1.03, filter: 'brightness(1.12)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 text-white px-7 py-3.5 rounded-[10px]"
            style={{
              fontFamily: 'Cabin, Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
              boxShadow: '0 6px 28px rgba(99, 102, 241, 0.45)',
            }}
          >
            View Live Dashboard
            <ArrowRightCircle size={19} />
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.03, filter: 'brightness(1.25)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px]"
            style={{
              fontFamily: 'Cabin, Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              background: '#16224A',
              color: '#F6F7F9',
              border: '1px solid rgba(129,140,248,0.22)',
            }}
          >
            How it Works
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeUp(4)}
          initial="hidden"
          animate="visible"
          className="mt-11 flex items-center justify-center gap-6 text-xs font-medium flex-wrap"
          style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}
        >
          <span className="flex items-center gap-1.5">
            <Database size={13} style={{ color: '#818CF8' }} />
            Walrus Memory storage layer
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: '#34D399' }}
            />
            Endowment vault · zero manual renewal
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
