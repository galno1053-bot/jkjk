# Panduan Switch ke Monad Mainnet

Ketika Monad Mainnet sudah launch, ikuti langkah-langkah berikut untuk switch dari Testnet ke Mainnet:

## Langkah-langkah

### 1. Update `src/lib/chains.ts`

Uncomment dan update konfigurasi mainnet:

```typescript
// Ganti dari:
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  // ...
});

// Menjadi:
export const monadMainnet = defineChain({
  id: <CHAIN_ID_MAINNET>, // Ganti dengan Chain ID Mainnet
  name: 'Monad Mainnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] }, // Ganti dengan RPC Mainnet
    public: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://monadexplorer.com' }, // Ganti dengan Explorer Mainnet
  },
});

// Update export default
export const monadChain = monadMainnet;
```

### 2. Update Import di Semua File

Ganti `monadTestnet` dengan `monadMainnet` di:
- `src/app/providers.tsx`
- `src/components/RequireWallet.tsx`
- `src/components/NetworkBadge.tsx`
- File lain yang menggunakan chain config

### 3. Update Environment Variables

```env
NEXT_PUBLIC_CHAIN_ID=<CHAIN_ID_MAINNET>
NEXT_PUBLIC_RPC=https://rpc.monad.xyz
NEXT_PUBLIC_EXPLORER=https://monadexplorer.com
```

### 4. Update `src/lib/utils.ts`

```typescript
export function explorerUrl(address: string, txHash?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_EXPLORER || 'https://monadexplorer.com';
  // ...
}

export const MONAD_CHAIN = {
  id: <CHAIN_ID_MAINNET>,
  name: 'Monad Mainnet',
  rpcUrl: 'https://rpc.monad.xyz',
  explorer: 'https://monadexplorer.com',
};
```

### 5. Deploy Kontrak Baru di Mainnet

**PENTING**: Semua kontrak harus di-deploy ulang di Mainnet!

Update environment variables dengan alamat kontrak baru:
```env
NEXT_PUBLIC_TOKEN_FACTORY=<NEW_MAINNET_ADDRESS>
NEXT_PUBLIC_TOKEN_LOCKER=<NEW_MAINNET_ADDRESS>
NEXT_PUBLIC_LP_LOCKER=<NEW_MAINNET_ADDRESS>
NEXT_PUBLIC_VESTING_FACTORY=<NEW_MAINNET_ADDRESS>
NEXT_PUBLIC_MULTISEND=<NEW_MAINNET_ADDRESS>
```

### 6. Update Teks UI

Ganti semua teks "Monad Testnet" menjadi "Monad Mainnet" di:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/RequireWallet.tsx`
- `src/components/NetworkBadge.tsx`
- File lainnya

### 7. Update README.md

Update informasi network di README.md dengan detail Mainnet.

## Catatan

- Data di Testnet tidak akan pindah ke Mainnet
- User perlu menambahkan jaringan Mainnet ke wallet mereka
- Pastikan semua kontrak sudah di-deploy dan verified di Mainnet

