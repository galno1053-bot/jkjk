# Panduan Migrasi dari Plasma ke Monad Network

## Overview
Dokumen ini menjelaskan langkah-langkah untuk migrasi aplikasi dari jaringan Plasma ke jaringan Monad.

## Informasi Jaringan Monad

### Mainnet (ketika tersedia)
- **Chain ID**: TBD (akan diumumkan saat mainnet launch)
- **RPC URL**: TBD
- **Explorer**: TBD
- **Native Token**: MON (18 decimals)
- **Network Name**: Monad Mainnet

### Testnet (saat ini tersedia)
- **Chain ID**: TBD
- **RPC URL**: TBD
- **Explorer**: TBD
- **Network Name**: Monad Testnet

> **Catatan**: Informasi spesifik akan diupdate setelah Monad mengumumkan detail resmi untuk mainnet/testnet.

## Langkah-langkah Migrasi

### 1. Update Chain Configuration

File yang perlu diubah: `src/lib/chains.ts`

```typescript
// Ganti dari:
export const plasmaMainnetBeta = defineChain({
  id: 9745,
  name: 'Monad Mainnet Beta',
  nativeCurrency: { name: 'Monad', symbol: 'XPL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.plasma.to'] },
    public: { http: ['https://rpc.plasma.to'] },
  },
  blockExplorers: {
    default: { name: 'PlasmaScan', url: 'https://plasmascan.to/' },
  },
});

// Menjadi:
export const monadMainnet = defineChain({
  id: <CHAIN_ID_MONAD>, // Ganti dengan Chain ID Monad
  name: 'Monad Mainnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['<RPC_URL_MONAD>'] },
    public: { http: ['<RPC_URL_MONAD>'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: '<EXPLORER_URL_MONAD>' },
  },
});
```

### 2. Update Environment Variables

File `.env.local` atau environment variables di hosting:

```env
# Ganti dari:
NEXT_PUBLIC_CHAIN_ID=9745
NEXT_PUBLIC_RPC=https://rpc.plasma.to
NEXT_PUBLIC_EXPLORER=https://plasmascan.to/

# Menjadi:
NEXT_PUBLIC_CHAIN_ID=<CHAIN_ID_MONAD>
NEXT_PUBLIC_RPC=<RPC_URL_MONAD>
NEXT_PUBLIC_EXPLORER=<EXPLORER_URL_MONAD>
```

### 3. Update Utils Configuration

File: `src/lib/utils.ts`

```typescript
// Update default explorer URL
export function explorerUrl(address: string, txHash?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_EXPLORER || '<EXPLORER_URL_MONAD>';
  // ...
}

// Update PLASMA_CHAIN menjadi MONAD_CHAIN
export const MONAD_CHAIN = {
  id: <CHAIN_ID_MONAD>,
  name: 'Monad Mainnet',
  rpcUrl: '<RPC_URL_MONAD>',
  explorer: '<EXPLORER_URL_MONAD>',
};
```

### 4. Update Contract Addresses

**PENTING**: Semua kontrak pintar harus di-deploy ulang di jaringan Monad!

Update environment variables dengan alamat kontrak baru:

```env
NEXT_PUBLIC_TOKEN_FACTORY=<NEW_CONTRACT_ADDRESS_ON_MONAD>
NEXT_PUBLIC_TOKEN_LOCKER=<NEW_CONTRACT_ADDRESS_ON_MONAD>
NEXT_PUBLIC_LP_LOCKER=<NEW_CONTRACT_ADDRESS_ON_MONAD>
NEXT_PUBLIC_VESTING_FACTORY=<NEW_CONTRACT_ADDRESS_ON_MONAD>
NEXT_PUBLIC_MULTISEND=<NEW_CONTRACT_ADDRESS_ON_MONAD>
```

### 5. Update Provider Configuration

File: `src/app/providers.tsx`

```typescript
// Ganti import
import { monadMainnet } from '@/lib/chains';

// Update config
const config = getDefaultConfig({
  appName: 'Nadz Tools',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [monadMainnet], // Ganti dari plasmaMainnetBeta
  ssr: false,
});
```

### 6. Update Semua Import

Cari dan ganti semua referensi `plasmaMainnetBeta` menjadi `monadMainnet`:

- `src/components/RequireWallet.tsx`
- `src/components/NetworkBadge.tsx`
- File lainnya yang menggunakan chain configuration

### 7. Deploy Kontrak Baru

Karena kontrak di Plasma tidak bisa langsung digunakan di Monad, Anda perlu:

1. **Deploy ulang semua kontrak** di jaringan Monad:
   - TokenFactory
   - TokenLocker
   - LiquidityLocker
   - VestingFactory
   - MultiSend

2. **Verifikasi kontrak** di block explorer Monad

3. **Update ABI** jika ada perubahan (biasanya tidak perlu jika kontrak sama)

### 8. Testing Checklist

Sebelum deploy ke production:

- [ ] Test koneksi wallet ke jaringan Monad
- [ ] Test semua fungsi: create token, lock, vesting, multi-send
- [ ] Verifikasi semua transaksi muncul di explorer Monad
- [ ] Test network switching
- [ ] Test error handling untuk wrong network
- [ ] Test di testnet Monad terlebih dahulu

### 9. Update Documentation

Update README.md dengan informasi Monad:
- Chain ID
- RPC URL
- Explorer URL
- Network name

## Perbedaan Penting

### Native Token
- **Plasma**: XPL
- **Monad**: MON

### Chain ID
- **Plasma**: 9745
- **Monad**: TBD (akan diumumkan)

### Kompatibilitas
Monad adalah EVM-compatible blockchain, jadi:
- ✅ Kontrak Solidity yang sama bisa digunakan
- ✅ ABI tetap sama
- ✅ Interface tetap sama
- ⚠️ Alamat kontrak harus di-deploy ulang
- ⚠️ Data di Plasma tidak otomatis pindah ke Monad

## Catatan Penting

1. **Data Migration**: Data yang ada di Plasma (token locks, vesting schedules, dll) TIDAK otomatis pindah ke Monad. Anda perlu:
   - Membuat sistem migrasi manual jika diperlukan
   - Atau memulai fresh di Monad

2. **User Migration**: User perlu:
   - Menambahkan jaringan Monad ke wallet mereka
   - Memiliki native token MON untuk gas fees
   - Memahami bahwa data lama di Plasma tidak tersedia di Monad

3. **Timing**: Tunggu hingga Monad mainnet resmi diluncurkan sebelum melakukan migrasi penuh.

## Resources

- [Monad Documentation](https://docs.monad.xyz) (jika tersedia)
- [Monad Discord/Telegram](link) untuk update terbaru
- Testnet untuk testing sebelum mainnet

## Support

Jika ada pertanyaan tentang migrasi, buat issue di repository ini.

