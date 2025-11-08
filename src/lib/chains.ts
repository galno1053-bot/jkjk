import { defineChain } from 'viem';

// Monad Testnet Configuration
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
});

// Monad Mainnet Configuration (untuk nanti saat mainnet launch)
// Uncomment dan update ketika mainnet tersedia
/*
export const monadMainnet = defineChain({
  id: 0, // TODO: Ganti dengan Chain ID Monad Mainnet
  name: 'Monad Mainnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] }, // TODO: Ganti dengan RPC Mainnet
    public: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://monadexplorer.com' }, // TODO: Ganti dengan Explorer Mainnet
  },
});
*/

// Export default untuk backward compatibility (menggunakan testnet untuk sekarang)
export const monadChain = monadTestnet;
