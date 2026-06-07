# Waloraa — Panduan Frontend

Untuk developer FE yang join. Frontend = **dashboard read-only** yang menampilkan
state Waloraa yang sudah berjalan on-chain. **Tidak perlu menyentuh** smart
contract, keeper, atau SDK Python — cukup **membaca** data dari Sui RPC + Walrus.

> Status: inti (SC + SDK + keeper) sudah terbukti live di testnet. FE = bonus
> yang memperkuat demo. Host di **Walrus Sites** = nilai plus untuk juri.

---

## Apa yang dibangun

Dashboard Next.js yang menampilkan:

1. **Vault card** — principal, funds, claimable yield, total renewals, status.
2. **Skill memory timeline** — daftar skill agent (dari index blob di Walrus):
   nama, deskripsi, tags, versi, kapan dipelajari.
3. **Renewal log** — riwayat auto-renewal (dari event on-chain): kapan, berapa
   yield dipakai, epoch diperpanjang.
4. **Sustainability calculator** (opsional) — slider APY → estimasi tahun storage.
5. (Bonus) **Connect wallet + Create Vault** flow pakai `@mysten/dapp-kit`.

Demo utama tetap di terminal (sudah terbukti). FE memvisualkannya.

---

## File yang HANYA PERLU DIBACA (referensi shape data — JANGAN diubah)

| File | Yang didapat |
|---|---|
| `keeper/src/constants.ts` | **PACKAGE_ID, PROTOCOL_CONFIG_ID**, network, type yield. Pakai nilai yang sama. |
| `keeper/src/vault.ts` | **Cara baca vault + blob dari chain** (`readVault`, `readBlobs`, `findVaultIds`). Ini pakai `@mysten/sui` — bisa di-copy/adaptasi langsung ke Next.js. |
| `SC/sources/vault.move` (baris 57–137) | **Struct + Events** yang bisa dibaca: `VaultCreated`, `BlobRegistered`, `BlobExtended`, `YieldClaimed`, `DepositAdded`, `VaultClosed`. Ini sumber data renewal log. |
| `sdk/waloraa/index.py` (`MemoryIndex.to_json`) | **Shape index blob** (JSON di Walrus): `{namespace, index_version, entries:[{skill_id, blob_id, name, summary, tags, embedding, version, end_epoch}]}`. |
| `sdk/waloraa/skill.py` (`Skill.to_dict`) | **Shape skill blob**: `{name, content, tags, description, version, success_count, learned_from, created_at, last_refined_at, skill_id}`. |
| `sdk/waloraa/storage.py` (atas) | **Endpoint Walrus** publisher/aggregator. |
| `DEMO.md` | Alur lengkap + ID testnet untuk testing. |

## File yang TIDAK BOLEH disentuh

- `SC/` — smart contract (sudah deployed & teruji).
- `keeper/src/*` — logika keeper (boleh dibaca, jangan ubah).
- `sdk/waloraa/*` — SDK inti.

FE hidup di **folder baru `frontend/`** — terpisah, tidak mengganggu apa pun.

---

## Sumber data (semua read-only, tanpa private key)

### 1. Sui RPC (state vault + events)
```
Fullnode testnet: https://fullnode.testnet.sui.io:443
SDK: @mysten/sui  (sama seperti keeper)
```
- **State vault**: `client.getObject({ id: VAULT_ID, options:{ showContent:true }})`
  → `funds`, `principal_floor`, `keeper`, `total_renewals`, `total_yield_consumed`, dll.
  (Lihat `readVault` di `keeper/src/vault.ts` — tinggal pakai.)
- **Daftar blob vault**: walk dynamic fields tabel `blobs` (lihat `readBlobs`).
- **Renewal log / history**: `client.queryEvents({ query:{ MoveEventType: \`${PACKAGE_ID}::vault::BlobExtended\` }})`
  juga `YieldClaimed`, `BlobRegistered`. Field event ada di `vault.move`.

### 2. Walrus aggregator (isi skill memory)
```
GET https://aggregator.walrus-testnet.walrus.space/v1/blobs/{blobId}
```
- Ambil **index blob** → parse JSON (shape `MemoryIndex`) → render daftar skill.
- Untuk detail satu skill, GET blob `entries[i].blob_id` → shape `Skill`.
- `blob_id` index terbaru: ada di vault (blob terakhir didaftarkan) atau dari
  event `BlobRegistered`. Catatan: SDK menyimpan `blob_id` sebagai UTF-8 bytes
  dari string base64url; di event/tabel ia muncul sebagai hex → decode hex ke
  string ASCII untuk dapat blobId Walrus. (Contoh decode ada di `DEMO.md`.)

---

## ID testnet untuk dipakai langsung

```
PACKAGE_ID = 0x4f67960db2807fe07a6b6647525e20917bdac951100ea135e8c91cb8bbb25dfa
CONFIG_ID  = 0x7b06baa9912fb38c8205e4e285d1a60dba29934d64fe0209a1cef26e16a2fd2c
VAULT_DEMO = 0x6a7726132e7bb2fee1dac269af993dbb734a340424f3addd754287ecfe2df84c
```
Vault demo ini punya 1 skill terdaftar + sudah pernah di-renew (end_epoch 525) —
data nyata untuk dirender.

---

## Stack yang disarankan

```
Next.js 14 (App Router) + TailwindCSS
@mysten/dapp-kit + @mysten/sui   (wallet + RPC; sama versi dgn keeper)
recharts                         (chart yield/sustainability)
```

Struktur usulan:
```
frontend/
├── app/
│   ├── page.tsx              # landing
│   └── dashboard/page.tsx    # vault + skill timeline + renewal log
├── components/
│   ├── VaultCard.tsx
│   ├── SkillTimeline.tsx     # fetch index blob dari Walrus, render entries
│   ├── RenewalLog.tsx        # queryEvents BlobExtended/YieldClaimed
│   └── SustainabilityCalc.tsx
└── lib/
    ├── sui.ts                # adaptasi readVault/readBlobs dari keeper
    └── walrus.ts             # GET aggregator, parse index/skill JSON
```

---

## Bonus: host di Walrus Sites

```bash
# next.config.js: output: 'export'
npm run build
walrus site-builder publish --epochs 53 ./out
```
"Dashboard-nya sendiri pun hidup di Walrus." → poin kuat ke juri.
