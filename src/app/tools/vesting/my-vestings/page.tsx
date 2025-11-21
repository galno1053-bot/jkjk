'use client';

import { useMemo, useState } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import vestingAbi from '@/lib/abis/vestingFactory.json';
import { formatUnits, type Abi } from 'viem';

const vestingFactoryAbi = vestingAbi as Abi;

type Schedule = {
  token: `0x${string}`;
  beneficiary: `0x${string}`;
  totalAmount: bigint;
  released: bigint;
  start: bigint;
  cliffMonths: bigint; // legacy in ABI, ignored for display
  durationMonths: bigint; // legacy in ABI, ignored for display
  mode?: number;
  isActive: boolean;
};

export default function MyVestingsPage() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  const { data: ids } = useReadContract({
    address: process.env.NEXT_PUBLIC_VESTING_FACTORY as `0x${string}`,
    abi: vestingFactoryAbi,
    functionName: 'getUserSchedules',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!process.env.NEXT_PUBLIC_VESTING_FACTORY },
  });

  const scheduleIds = (ids as unknown as bigint[]) ?? [];

  const { data: schedulesData, isLoading: schedulesLoading } = useReadContracts({
    contracts: scheduleIds.map((id) => ({
      address: process.env.NEXT_PUBLIC_VESTING_FACTORY as `0x${string}`,
      abi: vestingFactoryAbi,
      functionName: 'schedules',
      args: [id],
    })),
    query: {
      enabled: scheduleIds.length > 0 && !!process.env.NEXT_PUBLIC_VESTING_FACTORY,
    },
  });

  const schedules = useMemo(() => {
    if (!schedulesData || schedulesData.length === 0) return [] as Array<{ id: bigint; s: Schedule }>;
    return schedulesData
      .map((entry, idx) => {
        const schedule = (entry?.result ?? null) as Schedule | null;
        if (!schedule) return null;
        return { id: scheduleIds[idx], s: schedule };
      })
      .filter((item): item is { id: bigint; s: Schedule } => !!item);
  }, [scheduleIds, schedulesData]);

  const uniqueTokens = useMemo(() => {
    const set = new Set<string>();
    schedules.forEach(({ s }) => {
      set.add(s.token.toLowerCase() as `0x${string}`);
    });
    return Array.from(set);
  }, [schedules]);

  const { data: decimalsData } = useReadContracts({
    contracts: uniqueTokens.map((token) => ({
      address: token as `0x${string}`,
      abi: [
        {
          inputs: [],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint8' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'decimals',
    })),
    query: {
      enabled: uniqueTokens.length > 0,
    },
  });

  const decimalsMap = useMemo(() => {
    if (!decimalsData) return {} as Record<string, number>;
    const map: Record<string, number> = {};
    uniqueTokens.forEach((token, idx) => {
      const value = decimalsData[idx]?.result as number | undefined;
      map[token] = value ?? 18;
    });
    return map;
  }, [decimalsData, uniqueTokens]);

  const claim = async (id: bigint) => {
    try {
      setIsLoading(true);
      await writeContract({
        address: process.env.NEXT_PUBLIC_VESTING_FACTORY as `0x${string}`,
        abi: vestingFactoryAbi,
        functionName: 'claim',
        args: [id],
      });
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 relative z-0 pointer-events-auto">
      <h1 className="text-2xl font-bold text-white mb-4">My Vestings</h1>
      {schedulesLoading ? (
        <p className="text-gray-300">Loading vesting schedules...</p>
      ) : schedules.length === 0 ? (
        <p className="text-gray-300">No vesting schedules found.</p>
      ) : (
        <div className="space-y-3">
          {schedules.map(({ id, s }) => {
            const dec = decimalsMap[s.token.toLowerCase()] ?? 18;
            const total = formatUnits((s.totalAmount ?? (0 as unknown as bigint)), dec);
            const released = formatUnits((s.released ?? (0 as unknown as bigint)), dec);
            return (
              <div key={id.toString()} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">#{id.toString()}</div>
                  <div className="font-medium">Token: {s.token}</div>
                  <div className="text-sm">Total: {total}</div>
                  <div className="text-sm">Released: {released}</div>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => claim(id)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Claiming...' : 'Claim'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



