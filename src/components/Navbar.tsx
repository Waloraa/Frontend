import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Layers } from 'lucide-react'

const navLinks = [
  { label: 'How it Works', href: '#how' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Economics', href: '#economics' },
  { label: 'Docs', href: 'https://github.com/NousResearch/hermes-agent' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      {/* Logo */}
      <motion.a
        href="#"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md">
          <Layers size={16} className="text-white" />
        </div>
        <span className="font-semibold text-gray-800 text-sm tracking-tight hidden sm:block">
          Waloraa
        </span>
      </motion.a>

      {/* Desktop Nav Links */}
      <motion.ul
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex items-center gap-8"
      >
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          </li>
        ))}
      </motion.ul>

      {/* CTA + Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3"
      >
        <motion.a
          href="#dashboard"
          whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.96 }}
          className="hidden md:flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md transition-colors duration-200"
        >
          Launch Dashboard
        </motion.a>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-black/5 transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-5 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium text-base hover:text-violet-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-2 bg-violet-600 text-white font-semibold py-3 rounded-full text-center"
            >
              Launch Dashboard
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
