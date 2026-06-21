import { motion } from 'framer-motion'
import { Github, Twitter } from 'lucide-react'

const links = {
  Product: ['How it Works', 'Dashboard', 'Economics', 'SDK'],
  Resources: ['README', 'Demo Guide', 'Smart Contracts', 'Audit'],
  Network: ['Sui Mainnet', 'Walrus', 'Scallop', 'MemWal'],
  Legal: ['MIT License', 'Privacy', 'Terms'],
}

const socials = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/Waloraa' },
  { icon: Twitter, label: 'Twitter', href: '#' },
]

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{ background: '#040912', borderTop: '1px solid rgba(99,102,241,0.12)' }}
    >
      {/* CTA Banner */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{
                color: '#E2E8F0',
                fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              Make your agent's memory
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                self-sustaining.
              </span>
            </h3>
            <p className="mt-3 text-sm max-w-sm" style={{ color: '#374151' }}>
              Walrus Memory stores it. Walora funds it — forever.
              No subscriptions, no manual renewals. Just 5 lines of code.
            </p>
          </div>
          <motion.a
            href="#dashboard"
            whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 text-white font-semibold px-8 py-4 rounded-full text-base"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
              boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
            }}
          >
            View Live Dashboard
          </motion.a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Walora"
              className="w-9 h-9 object-contain"
              style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' }}
            />
            <span className="text-white font-semibold text-sm">Walora</span>
          </div>
          <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: '#374151' }}>
            The endowment vault that funds Walrus Memory forever — deposit once, yield pays renewal automatically.
          </p>
          <div className="flex items-center gap-3 mt-1">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(129,140,248,0.12)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
                }
              >
                <Icon size={15} style={{ color: '#374151' }} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([heading, items]) => (
          <div key={heading} className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: '#64748B' }}
            >
              {heading}
            </p>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: '#1F2937' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#1F2937' }}>
          <span>© {new Date().getFullYear()} Walora · Walrus Track, Sui Overflow 2026 · MIT</span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
              style={{ background: '#34D399' }}
            />
            Live on Sui testnet
          </span>
        </div>
      </div>
    </footer>
  )
}
