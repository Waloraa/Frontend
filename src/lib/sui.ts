// Sui JSON-RPC client (read-only) via fetch — tanpa @mysten/sui.
import {
  SUI_RPC,
  PACKAGE_ID,
  VAULT_DEMO,
  MIST_PER_SUI,
} from './constants'
import { decodeBlobId } from './walrus'
import type { VaultState, RenewalEvent, RenewalEventKind } from './types'

async function rpc<T>(
  method: string,
  params: unknown[],
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(SUI_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal,
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message ?? 'RPC error')
  return json.result as T
}

const toNum = (v: unknown): number => (v == null ? 0 : Number(v))
const mistToSui = (v: unknown): number => toNum(v) / MIST_PER_SUI

// Field name on-chain bisa berbeda antar versi kontrak — kita toleran:
// coba beberapa kandidat nama agar tetap kebaca.
const pick = (obj: Record<string, unknown>, ...keys: string[]): unknown => {
  for (const k of keys) if (obj[k] != null) return obj[k]
  return undefined
}

export async function fetchVault(
  vaultId = VAULT_DEMO,
  signal?: AbortSignal,
): Promise<VaultState> {
  const result = await rpc<any>(
    'sui_getObject',
    [vaultId, { showContent: true, showType: true }],
    signal,
  )
  const fields: Record<string, unknown> = result?.data?.content?.fields ?? {}

  const funds = mistToSui(pick(fields, 'funds', 'balance', 'total_funds'))
  const principalFloor = mistToSui(
    pick(fields, 'principal_floor', 'principal', 'floor'),
  )
  const totalYieldConsumed = mistToSui(
    pick(fields, 'total_yield_consumed', 'yield_consumed'),
  )

  return {
    id: vaultId,
    funds,
    principalFloor,
    keeper: String(pick(fields, 'keeper', 'keeper_address') ?? ''),
    totalRenewals: toNum(pick(fields, 'total_renewals', 'renewals')),
    totalYieldConsumed,
    claimableYield: Math.max(0, funds - principalFloor),
    status: pick(fields, 'closed', 'is_closed') ? 'closed' : 'active',
  }
}

const EVENT_KINDS: RenewalEventKind[] = [
  'BlobExtended',
  'YieldClaimed',
  'BlobRegistered',
]

export async function fetchRenewalEvents(
  limit = 15,
  signal?: AbortSignal,
): Promise<RenewalEvent[]> {
  const batches = await Promise.all(
    EVENT_KINDS.map(async (kind) => {
      try {
        const res = await rpc<any>(
          'suix_queryEvents',
          [
            { MoveEventType: `${PACKAGE_ID}::vault::${kind}` },
            null,
            limit,
            true, // descending — terbaru dulu
          ],
          signal,
        )
        const data: any[] = res?.data ?? []
        return data.map((e): RenewalEvent => {
          const pj: Record<string, unknown> = e.parsedJson ?? {}
          const rawBlob = pick(pj, 'blob_id', 'blobId', 'blob')
          return {
            kind,
            blobId: rawBlob != null ? decodeBlobId(rawBlob) : undefined,
            endEpoch: toNum(pick(pj, 'end_epoch', 'endEpoch', 'new_end_epoch')),
            yieldUsed: mistToSui(
              pick(pj, 'yield_used', 'amount', 'yield_amount'),
            ),
            timestampMs: e.timestampMs ? Number(e.timestampMs) : undefined,
            txDigest: e.id?.txDigest ?? '',
          }
        })
      } catch {
        return [] as RenewalEvent[]
      }
    }),
  )

  return batches
    .flat()
    .sort((a, b) => (b.timestampMs ?? 0) - (a.timestampMs ?? 0))
    .slice(0, limit)
}

// blob_id index terbaru dari event BlobRegistered (untuk fetch skill index).
export async function fetchLatestIndexBlobId(
  vaultId = VAULT_DEMO,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const res = await rpc<any>(
      'suix_queryEvents',
      [
        { MoveEventType: `${PACKAGE_ID}::vault::BlobRegistered` },
        null,
        25,
        true,
      ],
      signal,
    )
    const data: any[] = res?.data ?? []
    const match = data.find((e) => {
      const v = e.parsedJson?.vault_id ?? e.parsedJson?.vault
      return !v || v === vaultId
    })
    const raw = match?.parsedJson?.blob_id ?? match?.parsedJson?.blob
    return raw != null ? decodeBlobId(raw) : null
  } catch {
    return null
  }
}
