import { defineChain } from 'viem';

// MegaETH mainnet configuration
export const megaEthMainnet = defineChain({
  id: 4326,
  name: 'MegaETH',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.megaeth.com/rpc'] },
    public: { http: ['https://mainnet.megaeth.com/rpc'] },
  },
  blockExplorers: {
    default: { name: 'MegaETH Explorer', url: 'https://megaeth.blockscout.com' },
  },
});

// Chain utama yang dipakai aplikasi (mainnet)
export const megaEthChain = megaEthMainnet;
