'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const PrivyWrapper = dynamic(
  () => import('@/components/providers/privy-provider').then(mod => mod.PrivyWrapper),
  { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return <PrivyWrapper>{children}</PrivyWrapper>;
}
