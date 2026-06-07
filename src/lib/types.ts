// Shape data Waloraa — diturunkan dari FRONTEND.md & README.md.

// Index blob di Walrus (sdk/waloraa/index.py — MemoryIndex.to_json).
export interface SkillEntry {
  skill_id: string
  blob_id: string
  name: string
  summary: string
  tags: string[]
  embedding?: number[]
  version: number
  end_epoch: number
}

export interface MemoryIndex {
  namespace: string
  index_version: number
  entries: SkillEntry[]
}

// Skill blob (sdk/waloraa/skill.py — Skill.to_dict).
export interface Skill {
  skill_id: string
  name: string
  content: string
  description: string
  tags: string[]
  version: number
  success_count: number
  learned_from?: string
  created_at: string
  last_refined_at?: string
}

// State vault on-chain (SC/sources/vault.move — StorageVault).
export interface VaultState {
  id: string
  funds: number // SUI
  principalFloor: number // SUI
  keeper: string
  totalRenewals: number
  totalYieldConsumed: number // SUI
  claimableYield: number // SUI (funds - principalFloor)
  status: 'active' | 'closed'
}

// Event on-chain untuk renewal log.
export type RenewalEventKind = 'BlobExtended' | 'YieldClaimed' | 'BlobRegistered'

export interface RenewalEvent {
  kind: RenewalEventKind
  blobId?: string
  endEpoch?: number
  yieldUsed?: number // SUI
  timestampMs?: number
  txDigest: string
}

// Penanda asal data untuk badge "live / demo".
export type DataSource = 'live' | 'demo'
