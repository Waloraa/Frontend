import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Upload,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Tag,
  FileText,
} from 'lucide-react'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { uploadBlob } from '../../lib/walrus'
import { buildRegisterBlobTx } from '../../lib/vaultTx'
import { VAULT_DEMO } from '../../lib/constants'
import type { Skill } from '../../lib/types'

type Status = 'idle' | 'uploading' | 'registering' | 'success' | 'error'

const short = (s: string) => `${s.slice(0, 10)}…${s.slice(-6)}`

const INPUT: CSSProperties = {
  borderRadius: '0.75rem',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  color: '#E2E8F0',
  width: '100%',
  outline: 'none',
}

const TEXTAREA: CSSProperties = {
  ...INPUT,
  minHeight: '90px',
  resize: 'vertical',
  fontFamily: 'inherit',
}

export default function StoreMemoryCard({ onStored }: { onStored?: () => void }) {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const [status, setStatus] = useState<Status>('idle')
  const [blobId, setBlobId] = useState<string | null>(null)
  const [digest, setDigest] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setName(''); setContent(''); setDescription(''); setTags('')
    setStatus('idle'); setBlobId(null); setDigest(null); setError(null)
  }

  const onStore = async () => {
    if (!account || !name.trim() || !content.trim()) return
    setStatus('uploading')
    setError(null)

    try {
      // 1. Build skill object (format sama dengan Python SDK skill.py)
      const skill: Skill = {
        skill_id: `skl_${Date.now()}`,
        name: name.trim(),
        content: content.trim(),
        description: description.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        version: 1,
        success_count: 0,
        learned_from: `stored via Waloraa frontend (${account.address.slice(0, 8)}…)`,
        created_at: new Date().toISOString(),
      }

      // 2. Upload ke Walrus (permanent=true — data lives forever)
      const blob = await uploadBlob(JSON.stringify(skill))
      setBlobId(blob.blobId)

      // 3. Register blob ke vault on-chain
      setStatus('registering')
      const tx = buildRegisterBlobTx(VAULT_DEMO, blob.blobId, blob.sizeBytes, blob.endEpoch)

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (res) => {
            await client.waitForTransaction({ digest: res.digest })
            setDigest(res.digest)
            setStatus('success')
            onStored?.()
          },
          onError: (e) => {
            setError(e instanceof Error ? e.message : String(e))
            setStatus('error')
          },
        },
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  const busy = status === 'uploading' || status === 'registering'
  const canSubmit = account && name.trim() && content.trim() && !busy

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
      className="p-7 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-base leading-tight" style={{ color: '#E2E8F0' }}>
            Store Skill Memory
          </h3>
          <p className="text-xs" style={{ color: '#475569' }}>
            Upload ke Walrus → register on-chain → disimpan selamanya
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-5 text-center"
            style={{
              background: 'rgba(52, 211, 153, 0.07)',
              border: '1px solid rgba(52, 211, 153, 0.2)',
            }}
          >
            <CheckCircle2 size={28} className="mx-auto mb-2" style={{ color: '#34D399' }} />
            <p className="font-semibold text-sm" style={{ color: '#34D399' }}>
              Skill disimpan ke Walrus & terdaftar on-chain!
            </p>
            {blobId && (
              <p className="mt-2 text-xs font-mono break-all" style={{ color: '#64748B' }}>
                Blob ID: {blobId}
              </p>
            )}
            {digest && (
              <a
                href={`https://suiscan.xyz/testnet/tx/${digest}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono mt-2"
                style={{ color: '#34D399' }}
              >
                Tx {short(digest)} <ExternalLink size={11} />
              </a>
            )}
            <button
              onClick={reset}
              className="mt-4 text-xs px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(52, 211, 153, 0.12)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.25)',
              }}
            >
              Simpan skill lain
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" className="flex flex-col gap-4">
            {!account && (
              <div
                className="rounded-xl p-3 text-xs text-center"
                style={{
                  background: 'rgba(251, 191, 36, 0.07)',
                  border: '1px solid rgba(251, 191, 36, 0.18)',
                  color: '#FBBF24',
                }}
              >
                Connect wallet untuk menyimpan skill.
              </div>
            )}

            {/* Name */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#475569' }}>
                <FileText size={12} /> Nama Skill
              </span>
              <input
                style={INPUT}
                placeholder="contoh: analyze_rsi, summarize_news, detect_arbitrage"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.4)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </label>

            {/* Content */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#475569' }}>
                <Brain size={12} /> Konten Skill
              </span>
              <textarea
                style={TEXTAREA}
                placeholder="Deskripsikan skill ini secara detail. Agent akan me-load ini saat butuh mengeksekusi tugas serupa."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.4)')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </label>

            {/* Description + Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium" style={{ color: '#475569' }}>
                  Deskripsi singkat
                </span>
                <input
                  style={INPUT}
                  placeholder="Satu kalimat tentang skill ini"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#475569' }}>
                  <Tag size={12} /> Tags (pisah koma)
                </span>
                <input
                  style={INPUT}
                  placeholder="trading, defi, sui"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                />
              </label>
            </div>

            {/* Status progress */}
            {busy && (
              <div
                className="rounded-xl p-3 text-xs flex items-center gap-2"
                style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  color: '#818CF8',
                }}
              >
                <Loader2 size={13} className="animate-spin flex-shrink-0" />
                {status === 'uploading'
                  ? 'Mengupload skill ke Walrus (permanent)…'
                  : 'Mendaftarkan blob ke vault on-chain…'}
              </div>
            )}

            {/* Error */}
            {status === 'error' && error && (
              <div
                className="rounded-xl p-3 text-xs flex items-start gap-2"
                style={{
                  background: 'rgba(239,68,68,0.07)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#F87171',
                }}
              >
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: busy ? 1 : 1.02 }}
              whileTap={{ scale: busy ? 1 : 0.97 }}
              onClick={onStore}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-all"
              style={{
                background: busy || !canSubmit
                  ? 'rgba(99,102,241,0.35)'
                  : 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
                color: 'white',
                boxShadow: busy || !canSubmit ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
                cursor: !canSubmit ? 'not-allowed' : 'pointer',
                opacity: !account ? 0.5 : 1,
              }}
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {status === 'uploading' ? 'Upload ke Walrus…' : 'Register on-chain…'}
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Simpan ke Walrus
                </>
              )}
            </motion.button>

            <p className="text-[11px] leading-relaxed" style={{ color: '#334155' }}>
              Skill disimpan sebagai blob permanent di Walrus testnet (53 epochs) dan
              terdaftar di vault on-chain. Yield dari Scallop otomatis memperbarui storage selamanya.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
