'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { QuiflixContract } from '@/lib/blockchain/contract-interactions';

// Base Sepolia Chain ID
const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_RPC = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org';

interface BlockchainContextType {
  // Provider and Signer
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  
  // Connection State
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Contract
  contract: QuiflixContract | null;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBaseSepolia: () => Promise<void>;
  
  // Data
  balance: string | null;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [contract, setContract] = useState<QuiflixContract | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!provider && !!signer && !!address;
  const isCorrectNetwork = chainId === BASE_SEPOLIA_CHAIN_ID;

  // Initialize provider when wallet is available
  useEffect(() => {
    const initProvider = async () => {
      if (!wallets || wallets.length === 0) {
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setContract(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get the embedded wallet from Privy
        const wallet = wallets.find(w => w.walletClientType === 'privy') || wallets[0];
        
        if (!wallet) {
          throw new Error('No wallet found');
        }

        // Create ethers provider from the wallet's EIP-1193 provider
        const ethersProvider = new ethers.BrowserProvider(wallet as any);
        const ethersSigner = await ethersProvider.getSigner();
        const signerAddress = await ethersSigner.getAddress();
        const network = await ethersProvider.getNetwork();
        
        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setAddress(signerAddress);
        setChainId(Number(network.chainId));

        // Create contract instance
        const quiflixContract = new QuiflixContract(ethersSigner);
        setContract(quiflixContract);

        // Get balance
        const bal = await ethersProvider.getBalance(signerAddress);
        setBalance(ethers.formatEther(bal));

        // Listen for chain changes
        if (wallet.provider?.on) {
          wallet.provider.on('chainChanged', (newChainId: string) => {
            setChainId(Number(newChainId));
          });

          wallet.provider.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              disconnectWallet();
            } else {
              setAddress(accounts[0]);
            }
          });
        }

      } catch (err) {
        console.error('[Quiflix] Failed to initialize provider:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      } finally {
        setIsLoading(false);
      }
    };

    if (authenticated) {
      initProvider();
    } else {
      disconnectWallet();
    }
  }, [authenticated, wallets]);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Privy handles the connection, just refresh wallets
      const wallet = wallets.find(w => w.walletClientType === 'privy') || wallets[0];
      
      if (!wallet) {
        throw new Error('Please connect your wallet using the Privy button');
      }

      // Switch to Base Sepolia if needed
      await switchToBaseSepolia();
      
    } catch (err) {
      console.error('[Quiflix] Wallet connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [wallets]);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setContract(null);
    setChainId(null);
    setBalance(null);
    setError(null);
  }, []);

  const switchToBaseSepolia = useCallback(async () => {
    if (!wallets || wallets.length === 0) {
      throw new Error('No wallet connected');
    }

    const wallet = wallets[0];
    
    try {
      // Try to switch to Base Sepolia
      await wallet.switchChain(BASE_SEPOLIA_CHAIN_ID);
    } catch (switchError: any) {
      // If the chain is not added, add it
      if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain')) {
        try {
          await wallet.addChain({
            chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}`,
            chainName: 'Base Sepolia',
            nativeCurrency: {
              name: 'Sepolia Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [BASE_SEPOLIA_RPC],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
          });
          await wallet.switchChain(BASE_SEPOLIA_CHAIN_ID);
        } catch (addError) {
          console.error('[Quiflix] Failed to add Base Sepolia:', addError);
          throw new Error('Failed to add Base Sepolia network');
        }
      } else {
        throw switchError;
      }
    }
  }, [wallets]);

  const value: BlockchainContextType = {
    provider,
    signer,
    address,
    chainId,
    isConnected,
    isCorrectNetwork,
    isLoading,
    error,
    contract,
    balance,
    connectWallet,
    disconnectWallet,
    switchToBaseSepolia,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}
