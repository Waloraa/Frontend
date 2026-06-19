import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  Save,
  User,
  AlertCircle,
  Database,
} from 'lucide-react'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { fetchIndex, uploadBlob } from '../../lib/walrus'
import { fetchLatestIndexBlobId } from '../../lib/sui'
import { buildRegisterBlobTx } from '../../lib/vaultTx'
import { VAULT_DEMO } from '../../lib/constants'
import type { Skill } from '../../lib/types'

// ── cosine similarity (sama dengan SearchMemory) ──────────────────────────
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s_-]/g, ' ').split(/\s+/).filter(Boolean)
}
function tfVec(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const t of tokens) m.set(t, (m.get(t) ?? 0) + 1)
  return m
}
function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, na = 0, nb = 0
  for (const [k, v] of a) { dot += v * (b.get(k) ?? 0); na += v * v }
  for (const [, v] of b) nb += v * v
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0
}
async function searchMemory(query: string, top = 3): Promise<string> {
  const blobId = await fetchLatestIndexBlobId()
  if (!blobId) return ''
  const index = await fetchIndex(blobId)
  if (!index?.entries?.length) return ''
  const qv = tfVec(tokenize(query))
  return index.entries
    .map(e => ({ e, s: cosine(qv, tfVec(tokenize(`${e.name} ${e.summary} ${e.tags.join(' ')}`))) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, top)
    .map(({ e, s }) =>
      `▸ ${e.name} (relevansi ${Math.round(s * 100)}%)\n  ${e.summary}\n  Tags: ${e.tags.join(', ')}`,
    )
    .join('\n\n')
}

// ── types ─────────────────────────────────────────────────────────────────
interface Msg {
  role: 'user' | 'agent'
  text: string
  memoryUsed?: string   // snippet konteks yang dipakai
  suggestedSkill?: string | null
  saving?: boolean
  saved?: boolean
}

const STARTERS = [
  'Bagaimana cara analisis RSI untuk crypto?',
  'Deteksi peluang arbitrase di DEX Sui',
  'Strategi sizing posisi saat pasar volatil',
  'Ringkas sentimen berita pasar hari ini',
]

export default function AgentChat() {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const send = async (text?: string) => {
    const q = (text ?? input).trim()
    if (!q || loading) return
    setInput('')
    setError(null)
    setMsgs(p => [...p, { role: 'user', text: q }])
    setLoading(true)

    try {
      // 1. Cari skill relevan di Walrus (1 index fetch)
      const memoryContext = await searchMemory(q)

      // 2. Kirim ke Claude via Edge Function
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, memoryContext, agentName: 'Walora Agent' }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error ?? res.statusText)
      }
      const { reply, suggestedSkill } = await res.json()

      setMsgs(p => [...p, {
        role: 'agent',
        text: reply,
        memoryUsed: memoryContext || undefined,
        suggestedSkill,
      }])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const saveSkill = async (msgIdx: number, content: string) => {
    if (!account) return
    setMsgs(p => p.map((m, i) => i === msgIdx ? { ...m, saving: true } : m))
    try {
      const name = `agent_skill_${Date.now()}`
      const skill: Skill = {
        skill_id: `skl_${Date.now()}`,
        name,
        content,
        description: content.slice(0, 80),
        tags: ['agent-generated'],
        version: 1,
        success_count: 0,
        learned_from: `Walora Agent chat (${account.address.slice(0, 8)}…)`,
        created_at: new Date().toISOString(),
      }
      const blob = await uploadBlob(JSON.stringify(skill))
      const tx = buildRegisterBlobTx(VAULT_DEMO, blob.blobId, blob.sizeBytes, blob.endEpoch)
      signAndExecute({ transaction: tx }, {
        onSuccess: async (r) => {
          await client.waitForTransaction({ digest: r.digest })
          setMsgs(p => p.map((m, i) => i === msgIdx ? { ...m, saving: false, saved: true } : m))
        },
        onError: () => setMsgs(p => p.map((m, i) => i === msgIdx ? { ...m, saving: false } : m)),
      })
    } catch {
      setMsgs(p => p.map((m, i) => i === msgIdx ? { ...m, saving: false } : m))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(11, 18, 38, 0.92)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
        borderRadius: '1.5rem',
      }}
      className="flex flex-col backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(99,102,241,0.14)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
            }}
          >
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>
              Walora Agent
            </p>
            <p className="text-[11px] flex items-center gap-1.5" style={{ color: '#475569' }}>
              <Database size={10} style={{ color: '#6366F1' }} />
              Memory dari Walrus · Vault on-chain
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.2)',
            color: '#34D399',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#34D399' }}
          />
          Live · Claude + Walrus
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 min-h-0" style={{ maxHeight: '340px' }}>
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-6">
            <Sparkles size={28} style={{ color: '#6366F1' }} />
            <p className="text-sm text-center max-w-xs" style={{ color: '#475569' }}>
              Tanya apa saja — agent akan cari skill relevan dari Walrus memory sebelum menjawab.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-xs px-3 py-2 rounded-xl transition-colors"
                  style={{
                    background: 'rgba(99,102,241,0.07)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    color: '#818CF8',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.14)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.07)')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg,#F59E0B,#EA580C)'
                    : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                }}
              >
                {m.role === 'user'
                  ? <User size={13} className="text-white" />
                  : <Brain size={13} className="text-white" />}
              </div>

              <div className={`flex flex-col gap-1.5 max-w-[78%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Memory badge */}
                {m.role === 'agent' && m.memoryUsed && (
                  <div
                    className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      color: '#818CF8',
                    }}
                  >
                    <Database size={9} />
                    Menggunakan skill dari Walrus memory
                  </div>
                )}

                {/* Bubble */}
                <div
                  className="text-sm leading-relaxed px-4 py-3 rounded-2xl whitespace-pre-wrap break-words"
                  style={
                    m.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.2))',
                          border: '1px solid rgba(99,102,241,0.25)',
                          color: '#C7D2FE',
                          borderBottomRightRadius: '4px',
                        }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#CBD5E1',
                          borderBottomLeftRadius: '4px',
                        }
                  }
                >
                  {m.text}
                </div>

                {/* Save skill button */}
                {m.role === 'agent' && m.suggestedSkill && (
                  <button
                    onClick={() => !m.saved && !m.saving && saveSkill(i, m.suggestedSkill!)}
                    disabled={m.saving || m.saved || !account}
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full transition-all"
                    style={{
                      background: m.saved
                        ? 'rgba(52,211,153,0.1)'
                        : 'rgba(99,102,241,0.1)',
                      border: m.saved
                        ? '1px solid rgba(52,211,153,0.25)'
                        : '1px solid rgba(99,102,241,0.22)',
                      color: m.saved ? '#34D399' : '#818CF8',
                      cursor: m.saved || !account ? 'default' : 'pointer',
                    }}
                  >
                    {m.saving
                      ? <><Loader2 size={11} className="animate-spin" /> Menyimpan ke Walrus…</>
                      : m.saved
                      ? <><Save size={11} /> Tersimpan di Walrus ✓</>
                      : <><Save size={11} /> Simpan insight ini ke Walrus{!account ? ' (connect wallet)' : ''}</>}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2.5"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
            >
              <Brain size={13} className="text-white" />
            </div>
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#475569',
                borderBottomLeftRadius: '4px',
              }}
            >
              <Loader2 size={13} className="animate-spin" style={{ color: '#6366F1' }} />
              Searching Walrus memory…
            </div>
          </motion.div>
        )}

        {error && (
          <div
            className="text-xs flex items-start gap-2 p-3 rounded-xl"
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

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex gap-2 px-5 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}
      >
        <input
          className="flex-1 min-w-0 text-sm"
          style={{
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.04)',
            padding: '0.6rem 1rem',
            color: '#E2E8F0',
            outline: 'none',
          }}
          placeholder="Tanya agent — dia cari skill di Walrus dulu…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.35)')}
          onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.06 }}
          whileTap={{ scale: loading ? 1 : 0.94 }}
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: loading || !input.trim()
              ? 'rgba(99,102,241,0.2)'
              : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
            boxShadow: loading || !input.trim() ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? <Loader2 size={15} className="text-white animate-spin" />
            : <Send size={15} className="text-white" />}
        </motion.button>
      </div>
    </motion.div>
  )
}
