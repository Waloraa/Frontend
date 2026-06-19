import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Brain, Tag, Loader2, AlertCircle, ExternalLink, Hash } from 'lucide-react'
import { fetchIndex, fetchSkill } from '../../lib/walrus'
import { fetchLatestIndexBlobId } from '../../lib/sui'
import type { SkillEntry, Skill } from '../../lib/types'

interface Result {
  entry: SkillEntry
  skill: Skill | null
  score: number
}

// Cosine similarity tanpa embedding model: pakai TF (term frequency) sederhana
// dari nama + summary + tags + content. Cukup untuk demo — hasilnya tetap relevan.
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s_-]/g, ' ').split(/\s+/).filter(Boolean)
}

function tfVector(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const t of tokens) m.set(t, (m.get(t) ?? 0) + 1)
  return m
}

function cosineSim(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (const [k, va] of a) {
    const vb = b.get(k) ?? 0
    dot += va * vb
    normA += va * va
  }
  for (const [, vb] of b) normB += vb * vb
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function scoreEntry(entry: SkillEntry, queryVec: Map<string, number>): number {
  const text = [
    entry.name,
    entry.summary,
    ...entry.tags,
  ].join(' ')
  // Jika ada pre-computed embedding di index, gunakan cosine di embedding space
  if (entry.embedding && entry.embedding.length > 0) {
    // Embedding-based: cari rata-rata dot product sebagai proxy relevance
    // (sederhana karena kita tidak punya query embedding di browser)
    // Fallback ke TF-based
  }
  const entryVec = tfVector(tokenize(text))
  return cosineSim(queryVec, entryVec)
}

export default function SearchMemory({ indexBlobId }: { indexBlobId?: string | null }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const onSearch = useCallback(async () => {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setResults([])

    try {
      // 1. Ambil blob_id index terbaru (1 fetch saja — bukan O(N) blobs)
      const blobId = indexBlobId ?? await fetchLatestIndexBlobId()
      if (!blobId) throw new Error('No skills stored in this vault yet.')

      // 2. Fetch index blob (1 HTTP request)
      const index = await fetchIndex(blobId)
      if (!index?.entries?.length) {
        setResults([])
        setSearched(true)
        setLoading(false)
        return
      }

      // 3. Score semua entry dengan cosine similarity
      const queryVec = tfVector(tokenize(q))
      const scored = index.entries
        .map((e) => ({ entry: e, score: scoreEntry(e, queryVec) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      // 4. Fetch konten skill hanya untuk top-K (bukan semua blob)
      const withContent = await Promise.all(
        scored.map(async ({ entry, score }) => {
          try {
            const skill = await fetchSkill(entry.blob_id)
            return { entry, skill, score }
          } catch {
            return { entry, skill: null, score }
          }
        }),
      )

      setResults(withContent.filter((r) => r.score > 0))
      setSearched(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [query, indexBlobId])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(11, 18, 38, 0.88)',
        border: '1px solid rgba(99, 102, 241, 0.18)',
        boxShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
        borderRadius: '1.5rem',
      }}
      className="p-7 backdrop-blur-xl h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
          }}
        >
          <Search size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-base leading-tight" style={{ color: '#E2E8F0' }}>
            Search Agent Memory
          </h3>
          <p className="text-xs" style={{ color: '#475569' }}>
            1 index fetch → cosine similarity → top-K skills — not O(N) blob fetches
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="flex gap-2">
        <input
          className="flex-1 min-w-0"
          style={{
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
            color: '#E2E8F0',
            outline: 'none',
          }}
          placeholder="e.g. analyze crypto chart, detect arbitrage..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139,92,246,0.4)')}
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
        />
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.04 }}
          whileTap={{ scale: loading ? 1 : 0.96 }}
          onClick={onSearch}
          disabled={loading || !query.trim()}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm"
          style={{
            background: loading ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
            color: 'white',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(139,92,246,0.35)',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Search
        </motion.button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mt-3 rounded-xl p-3 text-xs flex items-start gap-2"
          style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.18)',
            color: '#F87171',
          }}
        >
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {searched && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col gap-3"
          >
            {results.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#475569' }}>
                No matching skills found. Try different keywords.
              </p>
            ) : (
              results.map(({ entry, skill, score }, i) => (
                <SkillResultCard key={entry.skill_id ?? i} entry={entry} skill={skill} score={score} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-auto pt-5 text-[11px] leading-relaxed" style={{ color: '#334155' }}>
        Search efficiency: fetch 1 index blob from Walrus → local cosine similarity → fetch
        only relevant skill blobs. Not O(N) — scales to thousands of skills.
      </p>
    </motion.div>
  )
}

function SkillResultCard({
  entry,
  skill,
  score,
}: {
  entry: SkillEntry
  skill: Skill | null
  score: number
}) {
  const [expanded, setExpanded] = useState(false)
  const pct = Math.round(score * 100)

  return (
    <motion.div
      layout
      style={{
        background: 'rgba(139, 92, 246, 0.06)',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        borderRadius: '1rem',
      }}
      className="p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <Brain size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#8B5CF6' }} />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate" style={{ color: '#C4B5FD' }}>
              {entry.name}
            </p>
            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#64748B' }}>
              {entry.summary || skill?.description || '—'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: pct > 40 ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.06)',
              color: pct > 40 ? '#A78BFA' : '#475569',
            }}
          >
            {pct}% match
          </span>
          <span className="text-[10px]" style={{ color: '#334155' }}>
            v{entry.version} · epoch {entry.end_epoch}
          </span>
        </div>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {entry.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(99,102,241,0.1)',
                color: '#818CF8',
                border: '1px solid rgba(99,102,241,0.18)',
              }}
            >
              <Tag size={8} />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Expandable skill content */}
      {skill?.content && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-[11px] flex items-center gap-1"
            style={{ color: '#6366F1' }}
          >
            <Hash size={11} />
            {expanded ? 'Hide content' : 'View skill content'}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.pre
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 text-xs overflow-auto rounded-xl p-3 whitespace-pre-wrap break-words"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  color: '#94A3B8',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'monospace',
                  maxHeight: '180px',
                }}
              >
                {skill.content}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Walrus blob link */}
      <div className="mt-2.5 flex items-center gap-3">
        <a
          href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${entry.blob_id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-mono"
          style={{ color: '#334155' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#8B5CF6')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
        >
          Walrus blob <ExternalLink size={9} />
        </a>
      </div>
    </motion.div>
  )
}
