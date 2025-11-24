'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-[#8500FF]/20">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo-nadztools.svg" alt="Nadz Tools" className="h-10 w-auto" />
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
