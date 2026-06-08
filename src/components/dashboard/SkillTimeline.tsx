import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { Brain, Tag, GitBranch, Clock } from 'lucide-react'
import type { MemoryIndex } from '../../lib/types'

const cardVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

const CARD_BASE: CSSProperties = {
  background: 'rgba(11, 18, 38, 0.88)',
  border: '1px solid rgba(99, 102, 241, 0.18)',
  boxShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
  borderRadius: '1.5rem',
}

const SKILL_BASE: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '1rem',
}

export default function SkillTimeline({ index }: { index: MemoryIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{
        y: -6,
        boxShadow:
          '0 0 0 1px rgba(244, 114, 182, 0.3), 0 24px 64px rgba(244, 114, 182, 0.08), 0 8px 24px rgba(0, 0, 0, 0.6)',
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={CARD_BASE}
      className="p-7 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4 mb-7">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)',
              boxShadow: '0 4px 16px rgba(244, 114, 182, 0.35)',
            }}
          >
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight" style={{ color: '#E2E8F0' }}>
              Skill Memory
            </h3>
            <p className="text-xs" style={{ color: '#475569' }}>
              namespace{' '}
              <span className="font-mono" style={{ color: '#64748B' }}>
                {index.namespace}
              </span>{' '}
              · index v{index.index_version}
            </p>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(244, 114, 182, 0.1)',
            color: '#F472B6',
            border: '1px solid rgba(244, 114, 182, 0.2)',
          }}
        >
          {index.entries.length} skill
        </span>
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* vertical line */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{
            background:
              'linear-gradient(to bottom, rgba(244,114,182,0.5) 0%, rgba(129,140,248,0.3) 60%, transparent 100%)',
          }}
        />

        <div className="flex flex-col gap-4">
          {index.entries.map((skill, i) => (
            <motion.div
              key={skill.skill_id}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -3, x: 3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* node */}
              <span
                className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full shadow"
                style={{
                  background: 'rgba(11, 18, 38, 0.9)',
                  border: '2px solid #F472B6',
                  boxShadow: '0 0 6px rgba(244,114,182,0.4)',
                }}
              />

              <div style={SKILL_BASE} className="p-4 transition-all duration-200 hover:border-white/[0.12]">
                <div className="flex items-center justify-between gap-3">
                  <code className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>
                    {skill.name}()
                  </code>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-medium flex-shrink-0"
                    style={{ color: '#374151' }}
                  >
                    <GitBranch size={11} />v{skill.version}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mt-1.5" style={{ color: '#64748B' }}>
                  {skill.summary}
                </p>
                <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag size={11} style={{ color: '#1F2937' }} />
                    {skill.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(129, 140, 248, 0.12)',
                          color: '#818CF8',
                          border: '1px solid rgba(129,140,248,0.2)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span
                    className="inline-flex items-center gap-1 text-[11px]"
                    style={{ color: '#374151' }}
                  >
                    <Clock size={11} />
                    end epoch {skill.end_epoch}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
