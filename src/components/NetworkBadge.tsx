'use client';

import { useChainId } from 'wagmi';
import { monadTestnet } from '@/lib/chains';

export function NetworkBadge() {
  const chainId = useChainId();
  const isCorrectChain = chainId === monadTestnet.id;

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
      isCorrectChain 
        ? 'bg-[#f0ebf5] text-[#8500FF] border border-[#8500FF]' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isCorrectChain ? (
        `Monad Testnet • ${monadTestnet.id}`
      ) : (
        'Wrong Network'
      )}
    </div>
  );
}
