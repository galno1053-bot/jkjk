'use client';

import { useChainId } from 'wagmi';
import { monadChain } from '@/lib/chains';

export function NetworkBadge() {
  const chainId = useChainId();
  const isCorrectChain = chainId === monadChain.id;

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
      isCorrectChain 
        ? 'bg-black text-white border border-white' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isCorrectChain ? `${monadChain.name} • ${monadChain.id}` : 'Wrong Network'}
    </div>
  );
}












