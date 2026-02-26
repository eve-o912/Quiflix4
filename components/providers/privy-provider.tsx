'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyWrapperProps {
  children: ReactNode;
}

export function PrivyWrapper({ children }: PrivyWrapperProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
  
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
        // Customize the login flow to be seamless
        loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord'],
        // No wallet creation prompt - seamless experience
        showWalletLoginFirst: false,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
