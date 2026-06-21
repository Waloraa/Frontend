// Waloraa — konfigurasi jaringan & ID testnet.
// Sumber: FRONTEND.md (semua read-only, tanpa private key).

export const SUI_RPC = 'https://fullnode.testnet.sui.io:443'
export const WALRUS_AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space'
export const WALRUS_PUBLISHER = 'https://publisher.walrus-testnet.walrus.space'

// Walrus storage: $0.023/GB/month, paid in WAL. Epoch = 1 day testnet / 2 weeks mainnet.
// Max prepay = 53 epochs mainnet (~2 years). SDK default = 53 epochs.
export const WALRUS_EPOCHS_DEFAULT = 53

export const PACKAGE_ID =
  '0x4f67960db2807fe07a6b6647525e20917bdac951100ea135e8c91cb8bbb25dfa'
export const CONFIG_ID =
  '0x7b06baa9912fb38c8205e4e285d1a60dba29934d64fe0209a1cef26e16a2fd2c'
// Vault demo: punya 1 skill terdaftar + sudah pernah di-renew (end_epoch 525).
export const VAULT_DEMO =
  '0x6a7726132e7bb2fee1dac269af993dbb734a340424f3addd754287ecfe2df84c'

// MIST per SUI (9 desimal).
export const MIST_PER_SUI = 1_000_000_000

// Model ekonomi (README.md).
export const ECONOMICS = {
  minDeposit: 1, // SUI
  apy: 0.08, // ~8% estimasi Scallop
  protocolFee: 0.02, // 2% dari yield
  keeperReward: 0.001, // 0.1% dari yield
  // SUI/tahun untuk renew storage. 5 SUI / 0.0625 = 80 tahun (worst-case 0% yield,
  // sesuai headline README); dengan yield Scallop jadi perpetual.
  storageCostPerYear: 0.0625,
} as const

export const EXPLORER_OBJECT = (id: string) =>
  `https://suiscan.xyz/testnet/object/${id}`
export const EXPLORER_TX = (digest: string) =>
  `https://suiscan.xyz/testnet/tx/${digest}`

// ── LIVE ON SUI MAINNET (real SUI, deployed 2026-06-21) ──────────────────────
// The economic loop is proven on mainnet, not just testnet: a real SUI-funded
// endowment vault, yield claimed on-chain, principal protected.
export const MAINNET = {
  packageId: '0x6ea861c0a3587ad2d1fcfe0a4cc5edc3384338aec76e415655883ec190f4ac39',
  configId: '0x43ee69b9f263b7c2fa83352db3c16073cf4ae700d5dd05fd93b1a2bb25cb83b4',
  // Real SUI endowment vault: 0.5 SUI principal, 0.4 SUI protected floor.
  vaultId: '0x1a9f3667a4fe6578fa28d69fba96070bdd74431caff3d548dc28ae7afc03f6ab',
  publishTx: 'EEi83G9bL5pW5c6ndZ3t18hRYVJfwfWpoAavzSQKReN4',
  // execute_renewal: claimed 0.1 SUI of yield, principal floor untouched.
  yieldClaimedTx: '4VQjJtcZmUcFFducftqEo27Huc2hMMdgD3xV4Q9Pzeop',
} as const

// Real Scallop lending yield, read live from mainnet (1 sSUI → SUI conversion
// rate; growth above principal IS the yield). Snapshot 2026-06-21.
export const SCALLOP = {
  coin: 'sui',
  conversionRate: 1.1056, // 1 sSUI = 1.1056 SUI → ~10.6% accrued
  supplyApy: 0.0288, // ~2.88% live supply APY
} as const

export const EXPLORER_MAINNET_OBJECT = (id: string) =>
  `https://suiscan.xyz/mainnet/object/${id}`
export const EXPLORER_MAINNET_TX = (digest: string) =>
  `https://suiscan.xyz/mainnet/tx/${digest}`
