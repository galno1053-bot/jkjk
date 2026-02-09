'use client';

import { useChainId } from 'wagmi';
import { megaEthChain } from '@/lib/chains';

export function NetworkBadge() {
  const chainId = useChainId();
  const isCorrectChain = chainId === megaEthChain.id;

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
      isCorrectChain 
        ? 'bg-black text-white border border-white' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isCorrectChain ? `${megaEthChain.name} • ${megaEthChain.id}` : 'Wrong Network'}
    </div>
  );
}












