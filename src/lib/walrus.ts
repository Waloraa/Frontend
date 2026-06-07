// Walrus aggregator client — read-only fetch isi skill memory.
import { WALRUS_AGGREGATOR } from './constants'
import type { MemoryIndex, Skill } from './types'

// SDK menyimpan blob_id sebagai UTF-8 bytes dari string base64url.
// Di event/tabel on-chain ia muncul sebagai hex → decode ke string ASCII.
export function hexToBlobId(hex: string): string {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex
  let out = ''
  for (let i = 0; i < clean.length; i += 2) {
    out += String.fromCharCode(parseInt(clean.slice(i, i + 2), 16))
  }
  return out
}

// blob_id dari parsedJson event bisa berupa: array byte (vector<u8>),
// string hex, atau string blobId apa adanya. Normalisasi ke blobId Walrus.
export function decodeBlobId(raw: unknown): string {
  if (Array.isArray(raw)) {
    return raw.map((b) => String.fromCharCode(Number(b))).join('')
  }
  if (typeof raw === 'string') {
    const isHex = /^(0x)?[0-9a-fA-F]+$/.test(raw)
    const evenLen = raw.replace(/^0x/, '').length % 2 === 0
    if (isHex && evenLen && raw.replace(/^0x/, '').length > 0) {
      return hexToBlobId(raw)
    }
    return raw
  }
  return ''
}

async function fetchBlobJson<T>(blobId: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`, { signal })
  if (!res.ok) throw new Error(`Walrus aggregator ${res.status}`)
  return (await res.json()) as T
}

export const fetchIndex = (blobId: string, signal?: AbortSignal) =>
  fetchBlobJson<MemoryIndex>(blobId, signal)

export const fetchSkill = (blobId: string, signal?: AbortSignal) =>
  fetchBlobJson<Skill>(blobId, signal)
