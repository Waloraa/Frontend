import { motion } from 'framer-motion'
import { Brain, Tag, GitBranch, Clock } from 'lucide-react'
import type { MemoryIndex } from '../../lib/types'

const cardVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function SkillTimeline({ index }: { index: MemoryIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-3xl p-7 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold text-lg leading-tight">
              Skill Memory
            </h3>
            <p className="text-xs text-gray-500">
              namespace{' '}
              <span className="font-mono text-gray-600">{index.namespace}</span>{' '}
              · index v{index.index_version}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1.5 rounded-full">
          {index.entries.length} skill
        </span>
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-pink-300 via-violet-300 to-transparent" />

        <div className="flex flex-col gap-4">
          {index.entries.map((skill, i) => (
            <motion.div
              key={skill.skill_id}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              {/* node */}
              <span className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-pink-400 shadow" />

              <div className="rounded-2xl bg-white/60 border border-white/70 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-3">
                  <code className="text-sm font-semibold text-gray-900">
                    {skill.name}()
                  </code>
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium flex-shrink-0">
                    <GitBranch size={11} />v{skill.version}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mt-1.5">
                  {skill.summary}
                </p>
                <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag size={11} className="text-gray-300" />
                    {skill.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium text-violet-600 bg-violet-100/70 px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
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
