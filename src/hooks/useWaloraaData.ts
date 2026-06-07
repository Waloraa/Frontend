// Orkestrasi data dashboard: coba fetch live dari Sui + Walrus,
// fallback ke demo data jika gagal supaya UI selalu render saat presentasi.
import { useCallback, useEffect, useState } from 'react'
import { fetchVault, fetchRenewalEvents, fetchLatestIndexBlobId } from '../lib/sui'
import { fetchIndex } from '../lib/walrus'
import { DEMO_VAULT, DEMO_INDEX, DEMO_EVENTS } from '../lib/demo'
import type {
  VaultState,
  MemoryIndex,
  RenewalEvent,
  DataSource,
} from '../lib/types'

export interface WaloraaData {
  vault: VaultState
  index: MemoryIndex
  events: RenewalEvent[]
  source: DataSource
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useWaloraaData(): WaloraaData {
  const [vault, setVault] = useState<VaultState>(DEMO_VAULT)
  const [index, setIndex] = useState<MemoryIndex>(DEMO_INDEX)
  const [events, setEvents] = useState<RenewalEvent[]>(DEMO_EVENTS)
  const [source, setSource] = useState<DataSource>('demo')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    const ctrl = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      let anyLive = false

      // Vault — penanda utama live/demo.
      try {
        const v = await fetchVault(undefined, ctrl.signal)
        if (!cancelled) {
          setVault(v)
          anyLive = true
        }
      } catch {
        if (!cancelled) setVault(DEMO_VAULT)
      }

      // Renewal events.
      try {
        const ev = await fetchRenewalEvents(15, ctrl.signal)
        if (!cancelled && ev.length > 0) {
          setEvents(ev)
          anyLive = true
        }
      } catch {
        if (!cancelled) setEvents(DEMO_EVENTS)
      }

      // Skill index (butuh blob_id index terbaru dari event).
      try {
        const blobId = await fetchLatestIndexBlobId(undefined, ctrl.signal)
        if (blobId) {
          const idx = await fetchIndex(blobId, ctrl.signal)
          if (!cancelled && idx?.entries?.length) {
            setIndex(idx)
            anyLive = true
          }
        }
      } catch {
        if (!cancelled) setIndex(DEMO_INDEX)
      }

      if (!cancelled) {
        setSource(anyLive ? 'live' : 'demo')
        if (!anyLive) setError('Live data tidak terjangkau — menampilkan demo data.')
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      ctrl.abort()
    }
  }, [tick])

  return { vault, index, events, source, loading, error, refresh }
}
