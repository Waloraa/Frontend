# Waloraa

**Persistent Skill Memory Infrastructure for AI Agents on Walrus**

> "Agents that learn. Memory that lasts forever."

Waloraa adalah infrastruktur yang memberi agent AI kemampuan untuk membuat, menyimpan, dan memanggil kembali **skill dari pengalaman masa lalu** — semua tersimpan di Walrus via MemWal, didanai selamanya oleh Waloraa vault melalui yield Scallop.

Terinspirasi dari [Hermes Agent (Nous Research)](https://github.com/NousResearch/hermes-agent) — agent yang tumbuh dan belajar dari pengalaman. Waloraa mengambil inti dari visi tersebut dan membangunnya di atas Walrus sebagai infrastruktur terbuka yang bisa dipakai developer manapun.

**Track:** Walrus Track — Sui Overflow 2026

---

## Masalah

Agent AI tidak belajar secara kumulatif. Setiap sesi dimulai dari nol — tidak ada skill yang tersimpan, tidak ada pengetahuan yang terakumulasi. Solusi yang ada membutuhkan pembayaran storage manual, dan mengambil memory yang relevan dari banyak blob membutuhkan fetch semua blob lalu embed semuanya — mahal di token dan lambat.

## Solusi

```
SKILL LAYER   — Agent buat skill dari pengalaman, simpan & panggil kembali
MEMORY LAYER  — Pre-computed index + embedding, search efisien tanpa fetch semua blob
FUNDING LAYER — Waloraa vault → Scallop yield → bayar MemWal renewal otomatis
```

Developer cukup 5 baris kode untuk memberi agent mereka kemampuan ini:

```python
from waloraa import WaloraaMemory

memory = WaloraaMemory(vault_id="0x123...", memwal_key="...")
memory.save_skill("analyze_rsi", content="...", tags=["trading"])
skills = memory.search("analisis chart crypto", top_k=3)
context = memory.get_context("strategi trading volatile market")
```

---

## Cara Kerja

### Skill Memory

Skill adalah pengetahuan yang bisa dieksekusi ulang — prosedur yang agent pelajari dari pengalaman, bukan sekadar teks.

```
Session 1: agent selesaikan tugas kompleks → buat skill baru → simpan ke Walrus
Session 2: user minta hal serupa → agent cari skill relevan → load → eksekusi
Session 3: agent refine skill dari feedback → simpan versi baru ke Walrus
```

### Efficient Search (bukan fetch semua blob)

```
SAAT SIMPAN (sekali):
  hitung embedding → simpan ke index blob → simpan skill ke MemWal

SAAT CARI (cepat):
  fetch 1 index blob → embed query → cosine similarity lokal → fetch top-K blob
```

Bukan O(N) fetch — hanya 1 index fetch + K skill fetch yang relevan.

### Auto-funding via Waloraa Vault

```
User deposit SUI sekali → Scallop generate yield → Keeper renew MemWal blob otomatis
```

Skill yang sudah dipelajari tidak pernah hilang karena storage-nya selalu terbayar.

---

## Struktur Repositori

```
waloraa/
├── SC/                          # Sui Move smart contracts (sudah selesai)
│   └── sources/
│       ├── vault.move           # StorageVault — custody dana, blob registry
│       ├── renewal.move         # execute_renewal — fee distribution
│       ├── walrus_adapter.move  # confirm_extension — epoch bookkeeping
│       ├── access.move          # AccessPolicy
│       └── waloraa.move         # ProtocolConfig — treasury, fees
├── sdk/                         # Waloraa Python SDK
│   └── waloraa/
│       ├── memory.py            # WaloraaMemory — antarmuka utama
│       ├── index.py             # IndexManager — index blob management
│       ├── skill.py             # SkillStore — simpan/load/refine skill
│       ├── search.py            # MemorySearch — embedding + cosine similarity
│       ├── memwal.py            # MemWal HTTP client
│       └── vault.py             # Vault client — register blob on-chain
├── examples/
│   └── trading_agent.py         # Demo: trading agent dengan skill memory
├── keeper/                      # Keeper bot — MemWal renewal automation
└── README.md
```

---

## Smart Contracts

18/18 tests passing. Lihat `SC/AUDIT.md` untuk detail audit.

SC **tidak perlu diubah** — semua intelligence berjalan off-chain di SDK. SC hanya mengurus:
- Custody dana endowment dengan principal protection
- Registry blob MemWal yang terdaftar ke vault
- Fee distribution saat renewal (2% protocol, 0.1% keeper)
- Validasi epoch Walrus untuk perpanjangan storage

### Generic `<Y>` — testnet dan mainnet

| | Testnet | Mainnet |
|---|---|---|
| Token | SUI (1:1) | sSUI dari Scallop |
| Walrus epoch | 1 hari | 2 minggu |
| Scallop yield | Simulasi | Real APY ~8% |

---

## Setup

### 1. Deploy Smart Contract

```bash
cd SC
sui move test          # pastikan 18/18 passing
sui client publish --gas-budget 100000000 --json | tee deploy.json

export PACKAGE_ID=$(cat deploy.json | jq -r '.objectChanges[] | select(.type=="published") | .packageId')
export CONFIG_ID=$(cat deploy.json | jq -r '.objectChanges[] | select(.objectType | contains("ProtocolConfig")) | .objectId')
```

### 2. Install SDK

```bash
cd sdk
pip install -e .
# atau langsung:
pip install -r requirements.txt
```

### 3. Setup Environment

```bash
cp .env.example .env
# Isi:
# MEMWAL_DELEGATE_KEY  — dari https://memwal.xyz
# PACKAGE_ID           — dari deploy SC
# VAULT_ID             — setelah buat vault
# LLM_PROVIDER + API key
```

### 4. Buat Vault

```bash
python examples/create_vault.py --deposit 5  # deposit 5 SUI
```

### 5. Jalankan Demo Agent

```bash
python examples/trading_agent.py
```

### 6. Jalankan Keeper

```bash
cd keeper && npm install && npm run start
```

---

## Model Ekonomi

| Parameter | Nilai |
|---|---|
| Deposit minimum | 1 SUI |
| APY Scallop (estimasi) | ~8% |
| Protocol fee | 2% dari yield |
| Keeper reward | 0.1% dari yield |
| Coverage ratio (5 SUI deposit) | ~20x biaya storage |
| Estimasi durasi (5 SUI, 8% APY) | ~80 tahun |

Principal tidak pernah tersentuh — hanya yield yang dipakai untuk renewal.

---

## Lisensi

MIT
