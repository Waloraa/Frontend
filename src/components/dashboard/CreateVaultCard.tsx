import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  PlusCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit'
import { buildCreateVaultTx } from '../../lib/vaultTx'
import { EXPLORER_OBJECT, EXPLORER_TX, ECONOMICS } from '../../lib/constants'

type Status = 'idle' | 'pending' | 'success' | 'error'

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

const CARD_BASE: CSSProperties = {
  background: 'rgba(11, 18, 38, 0.88)',
  border: '1px solid rgba(99, 102, 241, 0.18)',
  boxShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
  borderRadius: '1.5rem',
}

const INPUT_STYLE: CSSProperties = {
  borderRadius: '0.75rem',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  color: '#E2E8F0',
  width: '100%',
  outline: 'none',
}

export default function CreateVaultCard() {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [deposit, setDeposit] = useState<number>(ECONOMICS.minDeposit)
  const [label, setLabel] = useState('my-skill-memory')
  const [status, setStatus] = useState<Status>('idle')
  const [vaultId, setVaultId] = useState<string | null>(null)
  const [digest, setDigest] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const floor = (deposit * 0.9).toFixed(3)

  const onCreate = () => {
    if (!account || deposit < ECONOMICS.minDeposit) return
    setStatus('pending')
    setError(null)
    setVaultId(null)
    setDigest(null)

    const tx = buildCreateVaultTx(deposit, label)
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async (res) => {
          try {
            const tb = await client.waitForTransaction({
              digest: res.digest,
              options: { showObjectChanges: true },
            })
            const created = tb.objectChanges?.find(
              (c) =>
                c.type === 'created' &&
                c.objectType.includes('::vault::StorageVault'),
            )
            setVaultId(created && 'objectId' in created ? created.objectId : null)
          } catch {
            /* object changes optional */
          }
          setDigest(res.digest)
          setStatus('success')
        },
        onError: (e) => {
          setError(e instanceof Error ? e.message : String(e))
          setStatus('error')
        },
      },
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{
        y: -6,
        boxShadow:
          '0 0 0 1px rgba(251, 191, 36, 0.3), 0 24px 64px rgba(251, 146, 60, 0.1), 0 8px 24px rgba(0, 0, 0, 0.6)',
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={CARD_BASE}
      className="p-7 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
            }}
          >
            <PlusCircle size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight" style={{ color: '#E2E8F0' }}>
              Create Your Vault
            </h3>
            <p className="text-xs" style={{ color: '#475569' }}>
              Deposit SUI → endowment skill memory milikmu
            </p>
          </div>
        </div>
        <div className="[&_button]:!rounded-full">
          <ConnectButton />
        </div>
      </div>

      {!account ? (
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Wallet size={26} className="mx-auto mb-2" style={{ color: '#F59E0B' }} />
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            Connect wallet Sui untuk membuat vault.
          </p>
          <p className="text-xs mt-1" style={{ color: '#374151' }}>
            Pastikan wallet berada di jaringan{' '}
            <span className="font-semibold" style={{ color: '#64748B' }}>
              Testnet
            </span>{' '}
            & punya gas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-xs" style={{ color: '#374151' }}>
            Terhubung sebagai{' '}
            <span className="font-mono" style={{ color: '#64748B' }}>
              {short(account.address)}
            </span>
          </p>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium" style={{ color: '#475569' }}>
                Deposit (SUI)
              </span>
              <input
                type="number"
                min={ECONOMICS.minDeposit}
                step={0.5}
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value) || 0)}
                style={INPUT_STYLE}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 0 0 2px rgba(129, 140, 248, 0.4)')
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium" style={{ color: '#475569' }}>
                Label / namespace
              </span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="my-skill-memory"
                style={INPUT_STYLE}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 0 0 2px rgba(129, 140, 248, 0.4)')
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color: '#374151' }}>
            <ShieldCheck size={14} style={{ color: '#34D399' }} />
            Principal floor otomatis{' '}
            <span className="font-semibold" style={{ color: '#64748B' }}>
              {floor} SUI
            </span>{' '}
            (90% diproteksi) · vault_type 1 · public access
          </div>

          <motion.button
            whileHover={{ scale: status === 'pending' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'pending' ? 1 : 0.97 }}
            onClick={onCreate}
            disabled={status === 'pending' || deposit < ECONOMICS.minDeposit}
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-all"
            style={{
              background:
                status === 'pending'
                  ? 'rgba(245,158,11,0.5)'
                  : 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
              color: 'white',
              boxShadow:
                status === 'pending'
                  ? 'none'
                  : '0 4px 20px rgba(245, 158, 11, 0.35)',
              opacity: deposit < ECONOMICS.minDeposit ? 0.5 : 1,
              cursor:
                status === 'pending' || deposit < ECONOMICS.minDeposit
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {status === 'pending' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Menunggu approval di wallet…
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                Create Vault · {deposit} SUI
              </>
            )}
          </motion.button>

          {/* Result */}
          {status === 'success' && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(52, 211, 153, 0.08)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
              }}
            >
              <div
                className="flex items-center gap-2 font-semibold text-sm"
                style={{ color: '#34D399' }}
              >
                <CheckCircle2 size={16} />
                Vault berhasil dibuat!
              </div>
              {vaultId && (
                <div className="mt-2 text-xs" style={{ color: '#64748B' }}>
                  Vault ID:{' '}
                  <a
                    href={EXPLORER_OBJECT(vaultId)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono hover:underline"
                    style={{ color: '#34D399' }}
                  >
                    {short(vaultId)} <ExternalLink size={11} />
                  </a>
                  <p className="mt-1" style={{ color: '#374151' }}>
                    Tip: set <code style={{ color: '#818CF8' }}>VAULT_DEMO</code> di{' '}
                    <code style={{ color: '#818CF8' }}>lib/constants.ts</code> ke ID ini.
                  </p>
                </div>
              )}
              {digest && (
                <a
                  href={EXPLORER_TX(digest)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono mt-1 transition-colors"
                  style={{ color: '#374151' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#34D399')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#374151')}
                >
                  tx {short(digest)} <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}

          {status === 'error' && error && (
            <div
              className="rounded-2xl p-4 text-sm flex items-start gap-2"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#F87171',
              }}
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span className="break-words">{error}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
