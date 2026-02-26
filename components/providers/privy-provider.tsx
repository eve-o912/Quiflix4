'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyWrapperProps {
  children: ReactNode;
}

export function PrivyWrapper({ children }: PrivyWrapperProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // During static generation / build without env vars, skip Privy initialization
  if (!privyAppId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#6366f1',
          logo: '/quiflix-logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord'],
        showWalletLoginFirst: false,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
