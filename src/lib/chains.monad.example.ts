/**
 * CONTOH KONFIGURASI UNTUK MONAD NETWORK
 * 
 * File ini adalah contoh. Setelah Monad mengumumkan detail resmi:
 * 1. Copy isi file ini ke chains.ts
 * 2. Ganti placeholder dengan nilai yang benar
 * 3. Update semua import dari plasmaMainnetBeta ke monadMainnet
 */

import { defineChain } from 'viem';

const MONAD_CHAIN_ID = 143;
const MONAD_RPC_URL = 'https://rpc.monad.xyz';
const MONAD_EXPLORER_URL = 'https://monadscan.com';

export const monadMainnet = defineChain({
  id: MONAD_CHAIN_ID,
  name: 'Monad Mainnet',
  nativeCurrency: { 
    name: 'Monad', 
    symbol: 'MON', // Ganti dari XPL ke MON
    decimals: 18 
  },
  rpcUrls: {
    default: { http: [MONAD_RPC_URL] },
    public: { http: [MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: { 
      name: 'Monad Explorer', 
      url: MONAD_EXPLORER_URL 
    },
  },
});

// Untuk testnet (jika diperlukan)
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { 
    name: 'Monad', 
    symbol: 'MON', 
    decimals: 18 
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { 
      name: 'Monad Testnet Explorer', 
      url: 'https://testnet.monadexplorer.com'
    },
  },
});

