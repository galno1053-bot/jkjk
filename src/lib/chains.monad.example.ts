/**
 * CONTOH KONFIGURASI UNTUK MONAD NETWORK
 * 
 * File ini adalah contoh. Setelah Monad mengumumkan detail resmi:
 * 1. Copy isi file ini ke chains.ts
 * 2. Ganti placeholder dengan nilai yang benar
 * 3. Update semua import dari plasmaMainnetBeta ke monadMainnet
 */

import { defineChain } from 'viem';

// TODO: Ganti dengan Chain ID resmi Monad
const MONAD_CHAIN_ID = 0; // Placeholder - ganti dengan Chain ID Monad

// TODO: Ganti dengan RPC URL resmi Monad
const MONAD_RPC_URL = 'https://rpc.monad.xyz'; // Placeholder - ganti dengan RPC URL Monad

// TODO: Ganti dengan Explorer URL resmi Monad
const MONAD_EXPLORER_URL = 'https://explorer.monad.xyz'; // Placeholder - ganti dengan Explorer URL Monad

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
  id: 0, // TODO: Ganti dengan Chain ID Monad Testnet
  name: 'Monad Testnet',
  nativeCurrency: { 
    name: 'Monad', 
    symbol: 'MON', 
    decimals: 18 
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] }, // TODO: Ganti dengan RPC Testnet
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { 
      name: 'Monad Testnet Explorer', 
      url: 'https://testnet-explorer.monad.xyz' // TODO: Ganti dengan Explorer Testnet
    },
  },
});

