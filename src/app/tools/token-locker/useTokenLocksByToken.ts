'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import type { Abi } from 'viem';
import { parseAbiItem } from 'viem';
import tokenLockerAbi from '@/lib/abis/tokenLocker.json';
import { isValidAddress } from '@/lib/utils';

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_LOCKER || '0xEb929E58B57410DC4f22cCDBaEE142Cb441B576C') as `0x${string}`;
const DEPLOY_BLOCK = BigInt(process.env.NEXT_PUBLIC_TOKEN_LOCKER_DEPLOY_BLOCK ?? '2289855');

const LOCKED_EVENT = parseAbiItem(
  'event Locked(uint256 indexed lockId, address indexed owner, address indexed token, uint256 amount, uint256 lockUntil)'
);

type RawLock = {
  token: `0x${string}`;
  amount: bigint;
  withdrawn: bigint;
  lockUntil: bigint;
  owner: `0x${string}`;
};

export type TokenLockDetails = RawLock & {
  lockId: bigint;
  withdrawable: bigint;
};

export type TokenLockState = {
  locks: TokenLockDetails[];
  symbol: string;
  decimals: number;
  isLoading: boolean;
  error: string | null;
  totals: {
    locked: bigint;
    withdrawn: bigint;
    remaining: bigint;
  };
  refreshedAt: number | null;
};

const defaultState: TokenLockState = {
  locks: [],
  symbol: '',
  decimals: 18,
  isLoading: false,
  error: null,
  totals: {
    locked: BigInt(0),
    withdrawn: BigInt(0),
    remaining: BigInt(0),
  },
  refreshedAt: null,
};

export function useTokenLocksByToken(tokenAddress?: string) {
  const client = usePublicClient();
  const [state, setState] = useState<TokenLockState>(defaultState);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!client) {
        setState(defaultState);
        return;
      }
      if (!tokenAddress) {
        setState((prev) => ({ ...defaultState, isLoading: false }));
        return;
      }
      if (!isValidAddress(tokenAddress)) {
        setState({
          ...defaultState,
          error: 'Invalid token address',
        });
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const normalized = tokenAddress.toLowerCase() as `0x${string}`;
        const abi = tokenLockerAbi as unknown as Abi;

        const logs = (await client.getLogs({
          address: CONTRACT_ADDRESS,
          event: LOCKED_EVENT,
          args: { token: normalized },
          fromBlock: DEPLOY_BLOCK,
          toBlock: 'latest',
        })) as Array<{ args: { lockId: bigint } }>;

        let lockIds = logs.map((log) => log.args.lockId);

        if (lockIds.length === 0) {
          const maxId = (await client.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'nextLockId',
          })) as bigint;

          const allIds: bigint[] = [];
          for (let i = BigInt(1); i < maxId; i = i + BigInt(1)) {
            allIds.push(i);
          }
          lockIds = allIds;
        }

        const locksRaw = await Promise.all(
          lockIds.map(async (lockId) => {
            const info = (await client.readContract({
              address: CONTRACT_ADDRESS,
              abi,
              functionName: 'locks',
              args: [lockId],
            })) as unknown;

            const structured: RawLock = ((): RawLock => {
              if (info && typeof info === 'object' && !Array.isArray(info) && 'owner' in (info as Record<string, unknown>)) {
                const obj = info as Record<string, unknown>;
                return {
                  token: obj.token as `0x${string}`,
                  amount: obj.amount as bigint,
                  withdrawn: obj.withdrawn as bigint,
                  lockUntil: obj.lockUntil as bigint,
                  owner: obj.owner as `0x${string}`,
                };
              }
              const arr = info as unknown as Array<unknown>;
              return {
                token: arr?.[0] as `0x${string}`,
                amount: arr?.[1] as bigint,
                withdrawn: arr?.[2] as bigint,
                lockUntil: arr?.[3] as bigint,
                owner: arr?.[4] as `0x${string}`,
              };
            })();

            if (!structured || structured.token?.toLowerCase() !== normalized) {
              return null;
            }

            let withdrawable = BigInt(0);
            try {
              withdrawable = (await client.readContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'withdrawable',
                args: [lockId],
              })) as bigint;
            } catch {
              withdrawable = BigInt(0);
            }

            return {
              ...structured,
              lockId,
              withdrawable,
            } satisfies TokenLockDetails;
          })
        );

        const locks = locksRaw.filter(Boolean) as TokenLockDetails[];

        let decimals = 18;
        try {
          decimals = Number(
            await client.readContract({
              address: normalized,
              abi: [
                { inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
              ] as unknown as Abi,
              functionName: 'decimals',
            })
          );
        } catch {
          decimals = 18;
        }

        let symbol = '';
        try {
          symbol = (await client.readContract({
            address: normalized,
            abi: [
              { inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
            ] as unknown as Abi,
            functionName: 'symbol',
          })) as string;
        } catch {
          symbol = '';
        }

        const totals = locks.reduce(
          (acc, lock) => {
            acc.locked += lock.amount;
            acc.withdrawn += lock.withdrawn;
            acc.remaining += lock.amount - lock.withdrawn;
            return acc;
          },
          { locked: BigInt(0), withdrawn: BigInt(0), remaining: BigInt(0) }
        );

        if (!cancelled) {
          setState({
            locks,
            symbol,
            decimals,
            isLoading: false,
            error: null,
            totals,
            refreshedAt: Date.now(),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            ...defaultState,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [client, tokenAddress]);

  return state;
}


