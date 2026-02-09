/**
 * CONTOH KONFIGURASI UNTUK MEGAETH NETWORK
 *
 * File ini adalah contoh lama untuk Monad. Perbarui ke MegaETH:
 * 1. Copy isi file ini ke chains.ts bila perlu.
 * 2. Ganti placeholder dengan nilai MegaETH yang benar.
 * 3. Update semua import ke megaEthChain.
 */

import { defineChain } from 'viem';

const MONAD_CHAIN_ID = 4326;
const MONAD_RPC_URL = 'https://mainnet.megaeth.com/rpc';
const MONAD_EXPLORER_URL = 'https://megaeth.blockscout.com';

export const monadMainnet = defineChain({
  id: MONAD_CHAIN_ID,
  name: 'MegaETH Mainnet',
  nativeCurrency: { 
    name: 'Ether', 
    symbol: 'ETH',
    decimals: 18 
  },
  rpcUrls: {
    default: { http: [MONAD_RPC_URL] },
    public: { http: [MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: { 
      name: 'MegaETH Explorer', 
      url: MONAD_EXPLORER_URL 
    },
  },
});

// Untuk testnet (jika diperlukan)
export const monadTestnet = defineChain({
  id: 10143,
  name: 'MegaETH Testnet',
  nativeCurrency: { 
    name: 'Ether', 
    symbol: 'ETH', 
    decimals: 18 
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.megaeth.com'] },
    public: { http: ['https://testnet-rpc.megaeth.com'] },
  },
  blockExplorers: {
    default: { 
      name: 'MegaETH Testnet Explorer', 
      url: 'https://explorer.testnet.megaeth.com'
    },
  },
});

