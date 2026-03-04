'use client';

import { useBlockchain } from '@/contexts/blockchain-context';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const BASE_SEPOLIA_CHAIN_ID = 84532;

export function NetworkSwitcher() {
  const { isConnected, isCorrectNetwork, chainId, switchToBaseSepolia, isLoading } = useBlockchain();

  if (!isConnected) {
    return null;
  }

  if (isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
        <CheckCircle2 className="h-4 w-4" />
        <span>Base Sepolia</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
      <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-200">
          Wrong Network
        </p>
        <p className="text-xs text-yellow-400/80">
          Connected to chain {chainId || 'unknown'}. Please switch to Base Sepolia.
        </p>
      </div>
      <Button
        onClick={switchToBaseSepolia}
        disabled={isLoading}
        size="sm"
        className="bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 border-yellow-500/30"
      >
        {isLoading ? 'Switching...' : 'Switch to Base Sepolia'}
      </Button>
    </div>
  );
}
