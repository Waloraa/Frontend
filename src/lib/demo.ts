// Fallback data — dipakai saat fetch live gagal (RPC/aggregator down saat demo).
// Konsisten dengan fakta vault demo: skill terdaftar + end_epoch 525, sudah di-renew.
import type { MemoryIndex, VaultState, RenewalEvent } from './types'

export const DEMO_VAULT: VaultState = {
  id: '0x6a77…df84c',
  funds: 5.18,
  principalFloor: 5.0,
  keeper: '0x9c2f…a41e',
  totalRenewals: 3,
  totalYieldConsumed: 0.41,
  claimableYield: 0.18,
  status: 'active',
}

export const DEMO_INDEX: MemoryIndex = {
  namespace: 'trading-agent',
  index_version: 4,
  entries: [
    {
      skill_id: 'skl_rsi_001',
      blob_id: 'demo-rsi',
      name: 'analyze_rsi',
      summary:
        'Deteksi kondisi overbought/oversold dari divergensi RSI pada pair crypto volatil.',
      tags: ['trading', 'technical-analysis', 'rsi'],
      version: 2,
      end_epoch: 525,
    },
    {
      skill_id: 'skl_vol_002',
      blob_id: 'demo-vol',
      name: 'size_position_by_volatility',
      summary:
        'Hitung ukuran posisi optimal berdasarkan ATR dan toleransi risiko per trade.',
      tags: ['trading', 'risk', 'position-sizing'],
      version: 1,
      end_epoch: 525,
    },
    {
      skill_id: 'skl_news_003',
      blob_id: 'demo-news',
      name: 'summarize_market_news',
      summary:
        'Ringkas sentimen berita pasar jadi sinyal bullish/bearish yang bisa dieksekusi.',
      tags: ['research', 'sentiment', 'nlp'],
      version: 3,
      end_epoch: 525,
    },
    {
      skill_id: 'skl_arb_004',
      blob_id: 'demo-arb',
      name: 'detect_dex_arbitrage',
      summary:
        'Bandingkan harga lintas DEX untuk menemukan peluang arbitrase di atas threshold gas.',
      tags: ['defi', 'arbitrage', 'sui'],
      version: 1,
      end_epoch: 525,
    },
  ],
}

const now = Date.now()
const day = 86_400_000

export const DEMO_EVENTS: RenewalEvent[] = [
  {
    kind: 'BlobExtended',
    blobId: 'demo-rsi',
    endEpoch: 525,
    timestampMs: now - 1 * day,
    txDigest: 'DemoTx3xK…',
  },
  {
    kind: 'YieldClaimed',
    yieldUsed: 0.14,
    timestampMs: now - 1 * day - 3600_000,
    txDigest: 'DemoTx2yR…',
  },
  {
    kind: 'BlobRegistered',
    blobId: 'demo-arb',
    endEpoch: 463,
    timestampMs: now - 9 * day,
    txDigest: 'DemoTx1aQ…',
  },
  {
    kind: 'BlobExtended',
    blobId: 'demo-rsi',
    endEpoch: 463,
    timestampMs: now - 16 * day,
    txDigest: 'DemoTx0bM…',
  },
]
