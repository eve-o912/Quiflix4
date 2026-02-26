'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/wallet-context';
import { Loader2, Wallet } from 'lucide-react';

export function AuthButton() {
  const { isAuthenticated, isLoading, login, logout, user } = useWallet();

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user.email || user.walletAddress.slice(0, 6) + '...' + user.walletAddress.slice(-4)}
        </span>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} className="bg-primary text-primary-foreground hover:bg-primary/90">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
