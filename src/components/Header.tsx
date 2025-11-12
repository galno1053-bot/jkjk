'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#8500FF]/30 bg-black/60 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/nadz-tools-logo.svg" alt="Nadz Tools" width={160} height={40} priority className="h-10 w-auto" />
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
