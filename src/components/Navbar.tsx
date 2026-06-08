import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu, X, Layers } from 'lucide-react'

const navLinks = [
  { label: 'How it Works', href: '#how' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Economics', href: '#economics' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 70], [0, 1])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
    >
      {/* Frosted bg — fades in after scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: bgOpacity,
          background: 'rgba(4, 9, 26, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
        }}
      />

      {/* Logo */}
      <motion.a
        href="#"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center gap-2 cursor-pointer"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #818CF8 0%, #3B82F6 100%)',
            boxShadow: '0 0 14px rgba(99, 102, 241, 0.45)',
          }}
        >
          <Layers size={16} className="text-white" />
        </div>
        <span className="font-semibold text-white text-sm tracking-tight hidden sm:block">
          Walora
        </span>
      </motion.a>

      {/* Desktop links */}
      <motion.ul
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden md:flex items-center gap-8"
      >
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: '#64748B' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#E2E8F0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
            >
              {link.label}
            </a>
          </li>
        ))}
      </motion.ul>

      {/* CTA + mobile toggle */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center gap-3"
      >
        <motion.a
          href="#dashboard"
          whileHover={{ scale: 1.04, filter: 'brightness(1.12)' }}
          whileTap={{ scale: 0.96 }}
          className="hidden md:flex items-center text-white text-sm font-semibold px-5 py-2.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
          }}
        >
          Launch Dashboard
        </motion.a>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: '#64748B' }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-4 right-4 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 md:hidden"
            style={{
              background: 'rgba(8, 15, 35, 0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-base transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E2E8F0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-white font-semibold py-3 rounded-full text-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)' }}
            >
              Launch Dashboard
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
