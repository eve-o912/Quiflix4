'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/wallet-context';
import { Loader2, Wallet, User } from 'lucide-react';
import Link from 'next/link';

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
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <User className="h-4 w-4" />
            {user.email || (user.walletAddress ? user.walletAddress.slice(0, 6) + '...' + user.walletAddress.slice(-4) : 'Dashboard')}
          </Button>
        </Link>
        <Button variant="outline" onClick={logout} size="sm">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} className="bg-primary text-primary-foreground hover:bg-primary/90">
      <Wallet className="mr-2 h-4 w-4" />
      Sign In / Sign Up
    </Button>
  );
}

export function AuthButtonSmall() {
  const { isAuthenticated, isLoading, login, user } = useWallet();

  if (isLoading) {
    return (
      <Button disabled size="sm">
        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-3 w-3" />
          My Account
        </Button>
      </Link>
    );
  }

  return (
    <Button onClick={login} size="sm" variant="outline">
      Sign In
    </Button>
  );
}
