import { useState } from 'react'
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
            /* object changes opsional */
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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-3xl p-7 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <PlusCircle size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold text-lg leading-tight">
              Create Your Vault
            </h3>
            <p className="text-xs text-gray-500">
              Deposit SUI → endowment skill memory milikmu
            </p>
          </div>
        </div>
        <div className="[&_button]:!rounded-full">
          <ConnectButton />
        </div>
      </div>

      {!account ? (
        <div className="rounded-2xl bg-white/60 border border-white/70 p-6 text-center">
          <Wallet size={26} className="mx-auto text-amber-500 mb-2" />
          <p className="text-sm text-gray-600">
            Connect wallet Sui untuk membuat vault.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Pastikan wallet berada di jaringan{' '}
            <span className="font-semibold text-gray-600">Testnet</span> & punya
            gas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">
            Terhubung sebagai{' '}
            <span className="font-mono text-gray-700">
              {short(account.address)}
            </span>
          </p>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500">
                Deposit (SUI)
              </span>
              <input
                type="number"
                min={ECONOMICS.minDeposit}
                step={0.5}
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value) || 0)}
                className="rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500">
                Label / namespace
              </span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="my-skill-memory"
                className="rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            Principal floor otomatis <span className="font-semibold">{floor} SUI</span>{' '}
            (90% diproteksi) · vault_type 1 · public access
          </div>

          <motion.button
            whileHover={{ scale: status === 'pending' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'pending' ? 1 : 0.98 }}
            onClick={onCreate}
            disabled={status === 'pending' || deposit < ECONOMICS.minDeposit}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md transition-colors"
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
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                <CheckCircle2 size={16} />
                Vault berhasil dibuat!
              </div>
              {vaultId && (
                <div className="mt-2 text-xs text-gray-600">
                  Vault ID:{' '}
                  <a
                    href={EXPLORER_OBJECT(vaultId)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-emerald-700 hover:underline"
                  >
                    {short(vaultId)} <ExternalLink size={11} />
                  </a>
                  <p className="text-gray-400 mt-1">
                    Tip: set <code>VAULT_DEMO</code> di{' '}
                    <code>lib/constants.ts</code> ke ID ini untuk merender vault-mu
                    di dashboard.
                  </p>
                </div>
              )}
              {digest && (
                <a
                  href={EXPLORER_TX(digest)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-700 mt-1 font-mono"
                >
                  tx {short(digest)} <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}

          {status === 'error' && error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span className="break-words">{error}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
