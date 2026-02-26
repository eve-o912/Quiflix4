'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface User {
  id: string;
  email?: string;
  walletAddress: string;
  userType: 'filmmaker' | 'distributor' | null;
}

interface WalletContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setUserType: (type: 'filmmaker' | 'distributor') => void;
  createEmbeddedWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { 
    ready, 
    authenticated, 
    user: privyUser,
    login: privyLogin,
    logout: privyLogout,
    createWallet
  } = usePrivy();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ready && privyUser) {
      const walletAddress = privyUser?.linkedAccounts.find(
        account => account.type === 'wallet'
      )?.address || '';

      setUser({
        id: privyUser.id,
        email: privyUser.email?.address,
        walletAddress,
        userType: null, // Will be set during onboarding
      });
    } else if (ready && !authenticated) {
      setUser(null);
    }
    setIsLoading(false);
  }, [ready, authenticated, privyUser]);

  const login = async () => {
    try {
      await privyLogin();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await privyLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const createEmbeddedWallet = async () => {
    try {
      if (!authenticated) {
        throw new Error('User must be authenticated first');
      }
      
      // Privy automatically creates embedded wallets when needed
      // This function ensures a wallet exists for the user
      const embeddedWallet = privyUser?.linkedAccounts.find(
        account => account.type === 'wallet' && account.walletClientType === 'privy'
      );

      if (!embeddedWallet) {
        await createWallet();
      }
    } catch (error) {
      console.error('Failed to create embedded wallet:', error);
      throw error;
    }
  };

  const setUserType = (type: 'filmmaker' | 'distributor') => {
    if (user) {
      setUser({ ...user, userType: type });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: authenticated,
        login,
        logout,
        setUserType,
        createEmbeddedWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
