import { motion } from 'framer-motion'
import { Github, Twitter, Layers } from 'lucide-react'

const links = {
  Product: ['How it Works', 'Dashboard', 'Economics', 'SDK'],
  Resources: ['README', 'Demo Guide', 'Smart Contracts', 'Audit'],
  Network: ['Sui Testnet', 'Walrus', 'Scallop', 'MemWal'],
  Legal: ['MIT License', 'Privacy', 'Terms'],
}

const socials = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/NousResearch/hermes-agent' },
  { icon: Twitter, label: 'Twitter', href: '#' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#1C1917' }} className="w-full text-gray-400">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="text-3xl sm:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Arial, sans-serif' }}
            >
              Beri agent-mu memory
              <br />
              yang tak pernah hilang.
            </h3>
            <p className="mt-3 text-gray-400 text-sm max-w-sm">
              Skill memory abadi untuk AI agent — di atas Walrus, didanai oleh
              yield. Cukup 5 baris kode.
            </p>
          </div>
          <motion.a
            href="#dashboard"
            whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-colors text-base"
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Layers size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm">Waloraa</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
            Persistent skill memory infrastructure for AI agents on Walrus.
          </p>
          <div className="flex items-center gap-3 mt-1">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Icon size={15} className="text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([heading, items]) => (
          <div key={heading} className="flex flex-col gap-3">
            <p className="text-white text-xs font-semibold uppercase tracking-wider">{heading}</p>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-200 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Waloraa · Walrus Track, Sui Overflow 2026 · MIT</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Live on Sui testnet
          </span>
        </div>
      </div>
    </footer>
  )
}
