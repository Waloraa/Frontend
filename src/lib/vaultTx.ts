// Builder transaksi create_and_share_vault — argumen direplikasi persis dari
// tx pembuatan vault demo yang sudah terbukti sukses (digest GTQpuGoXP1...).
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, MIST_PER_SUI } from './constants'

export const CLOCK_ID = '0x6'
export const SUI_TYPE = '0x2::sui::SUI'

// Argumen create_and_share_vault(coin, principal_floor, access_kind,
//   allowed_addrs, p5, vault_type, label, &Clock, &mut TxContext)
const ACCESS_KIND_PUBLIC = 0
const PARAM5 = 0 // demo memakai 0
const VAULT_TYPE_TESTNET = 1 // 1 = SUI testnet (lihat README generic <Y>)
// principal_floor = 90% deposit → menyisakan headroom yield (sama seperti demo).
const FLOOR_NUMERATOR = 9n
const FLOOR_DENOMINATOR = 10n

// Register blob yang sudah diupload ke Walrus ke dalam vault on-chain.
// Argumen: vault::register_blob(vault, blob_id, size_bytes, end_epoch, is_encrypted, &Clock)
export function buildRegisterBlobTx(
  vaultId: string,
  blobId: string,
  sizeBytes: number,
  endEpoch: number,
  isEncrypted = false,
): Transaction {
  const blobIdBytes = Array.from(new TextEncoder().encode(blobId))
  const tx = new Transaction()
  tx.moveCall({
    target: `${PACKAGE_ID}::vault::register_blob`,
    typeArguments: [SUI_TYPE],
    arguments: [
      tx.object(vaultId),
      tx.pure.vector('u8', blobIdBytes),
      tx.pure.u64(sizeBytes),
      tx.pure.u64(endEpoch),
      tx.pure.bool(isEncrypted),
      tx.object(CLOCK_ID),
    ],
  })
  return tx
}

export function buildCreateVaultTx(depositSui: number, label: string): Transaction {
  const depositMist = BigInt(Math.round(depositSui * MIST_PER_SUI))
  const floorMist = (depositMist * FLOOR_NUMERATOR) / FLOOR_DENOMINATOR
  const labelBytes = Array.from(
    new TextEncoder().encode((label || 'my-skill-memory').trim()),
  )

  const tx = new Transaction()
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(depositMist)])
  tx.moveCall({
    target: `${PACKAGE_ID}::vault::create_and_share_vault`,
    typeArguments: [SUI_TYPE],
    arguments: [
      coin,
      tx.pure.u64(floorMist),
      tx.pure.u8(ACCESS_KIND_PUBLIC),
      tx.makeMoveVec({ type: 'address', elements: [] }),
      tx.pure.u64(PARAM5),
      tx.pure.u8(VAULT_TYPE_TESTNET),
      tx.pure.vector('u8', labelBytes),
      tx.object(CLOCK_ID),
    ],
  })
  return tx
}
