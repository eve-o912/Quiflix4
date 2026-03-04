'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useBlockchain } from '@/contexts/blockchain-context';
import { NetworkSwitcher } from '@/components/blockchain/network-switcher';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  User,
  Film,
  CreditCard,
  Send,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { ethers } from 'ethers';

// USDC Contract ABI (minimal for balance and transfers)
const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Base Mainnet USDC Contract Address
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Mock KES conversion rate (would come from API in production)
const KES_RATE = 129.5; // 1 USDC = 129.5 KES (example rate)

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning' | 'sale';
  amount: number;
  currency: 'USDC' | 'KES';
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  description: string;
  txHash?: string;
}

interface UserStats {
  totalEarnings: number;
  pendingEarnings: number;
  totalFilms: number;
  totalDistributors: number;
  monthlyGrowth: number;
}

export function WalletDashboard() {
  const { user, authenticated, ready } = usePrivy();
  const { balance: chainBalance, address, isConnected, isCorrectNetwork, provider, switchToBaseSepolia } = useBlockchain();
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState('0.00');
  const [kesBalance, setKesBalance] = useState('0.00');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawMode, setWithdrawMode] = useState<'kes' | 'wallet'>('kes');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earning',
      amount: 150.00,
      currency: 'USDC',
      status: 'completed',
      timestamp: '2024-03-15T10:30:00Z',
      description: 'Film: The African Dream - Sales revenue',
      txHash: '0x1234...5678'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 50.00,
      currency: 'KES',
      status: 'completed',
      timestamp: '2024-03-14T15:20:00Z',
      description: 'Withdrawal to M-Pesa',
      txHash: '0x8765...4321'
    },
    {
      id: '3',
      type: 'sale',
      amount: 25.00,
      currency: 'USDC',
      status: 'completed',
      timestamp: '2024-03-13T09:15:00Z',
      description: 'Film: Nairobi Nights - Direct sale',
      txHash: '0xabcd...efgh'
    }
  ]);

  const [stats, setStats] = useState<UserStats>({
    totalEarnings: 225.50,
    pendingEarnings: 45.00,
    totalFilms: 3,
    totalDistributors: 12,
    monthlyGrowth: 23.5
  });

  // Fetch USDC balance from blockchain
  useEffect(() => {
    if (isConnected && provider && address) {
      fetchUSDCBalance();
    }
  }, [isConnected, provider, address]);

  const fetchUSDCBalance = async () => {
    try {
      if (!provider || !address) return;
      
      // USDC contract on Base Sepolia
      const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
      const USDC_ABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)'
      ];
      
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
      const rawBalance = await usdcContract.balanceOf(address);
      const decimals = await usdcContract.decimals();
      const formattedBalance = ethers.formatUnits(rawBalance, decimals);
      
      setBalance(parseFloat(formattedBalance).toFixed(2));
      setKesBalance((parseFloat(formattedBalance) * KES_RATE).toFixed(2));
    } catch (error) {
      console.error('[Quiflix] Error fetching USDC balance:', error);
      // Fallback to ETH balance if USDC fails
      if (chainBalance) {
        setBalance(parseFloat(chainBalance).toFixed(4));
        setKesBalance((parseFloat(chainBalance) * KES_RATE).toFixed(2));
      }
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (withdrawMode === 'wallet' && !recipientAddress) {
      alert('Please enter recipient wallet address');
      return;
    }

    if (!isCorrectNetwork) {
      alert('Please switch to Base Sepolia network first');
      await switchToBaseSepolia();
      return;
    }

    setIsLoading(true);

    try {
      if (withdrawMode === 'wallet') {
        // On-chain USDC transfer
        const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
        const USDC_ABI = [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function decimals() view returns (uint8)'
        ];
        
        const signer = await provider!.getSigner();
        const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
        const decimals = await usdcContract.decimals();
        const amountInWei = ethers.parseUnits(withdrawAmount, decimals);
        
        const tx = await usdcContract.transfer(recipientAddress, amountInWei);
        const receipt = await tx.wait();
        
        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'withdrawal',
          amount: parseFloat(withdrawAmount),
          currency: 'USDC',
          status: 'completed',
          timestamp: new Date().toISOString(),
          description: `Transfer to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`,
          txHash: receipt?.hash || tx.hash
        };

        setTransactions(prev => [newTransaction, ...prev]);
        
        // Update balance
        await fetchUSDCBalance();
        
        alert('Transfer successful! Transaction confirmed on-chain.');
      } else {
        // M-Pesa withdrawal - simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'withdrawal',
          amount: parseFloat(withdrawAmount),
          currency: 'KES',
          status: 'pending',
          timestamp: new Date().toISOString(),
          description: 'Withdrawal to M-Pesa',
          txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...'
        };

        setTransactions(prev => [newTransaction, ...prev]);
        
        // Update balance
        const newBalance = (parseFloat(balance) - parseFloat(withdrawAmount)).toFixed(2);
        setBalance(newBalance);
        setKesBalance((parseFloat(newBalance) * KES_RATE).toFixed(2));

        alert('Withdrawal request submitted! You will receive funds within 24 hours.');
      }

      // Reset form
      setWithdrawAmount('');
      setRecipientAddress('');
    } catch (error) {
      console.error('[Quiflix] Withdrawal error:', error);
      alert('Withdrawal failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case 'earning':
        return <TrendingUp className="h-4 w-4 text-purple-400" />;
      case 'sale':
        return <DollarSign className="h-4 w-4 text-blue-400" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <Wallet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-slate-400 mb-4">Please sign in to access your dashboard and wallet</p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <NetworkSwitcher />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.email?.address || 'Filmmaker'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-400">+{stats.monthlyGrowth}% this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-white">${stats.pendingEarnings.toFixed(2)}</p>
                <p className="text-xs text-yellow-400">Processing</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Your Films</p>
                <p className="text-2xl font-bold text-white">{stats.totalFilms}</p>
                <p className="text-xs text-blue-400">Active</p>
              </div>
              <Film className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Distributors</p>
                <p className="text-2xl font-bold text-white">{stats.totalDistributors}</p>
                <p className="text-xs text-green-400">Active</p>
              </div>
              <User className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallet">Wallet & Withdraw</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-200">USDC Balance</p>
                    <p className="text-3xl font-bold text-white">${balance} USDC</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-200">KES Equivalent</p>
                    <p className="text-xl font-semibold text-white">KES {kesBalance}</p>
                    <p className="text-xs text-purple-300">Rate: 1 USDC = {KES_RATE} KES</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setActiveTab('wallet')}
                    className="flex-1 bg-white text-purple-900 hover:bg-slate-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-purple-400 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  asChild
                >
                  <a href="/filmmaker-dashboard">
                    <Film className="h-4 w-4 mr-2" />
                    Manage Films
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  asChild
                >
                  <a href="/distributor-dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Distributor Portal
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <p className="text-white font-medium">{tx.description}</p>
                        <p className="text-sm text-slate-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount} {tx.currency}
                      </p>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balance Display */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Current Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-white mb-2">${balance} USDC</p>
                  <p className="text-xl text-slate-400">≈ KES {kesBalance}</p>
                  <p className="text-sm text-slate-500 mt-2">Base Network</p>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Form */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Withdraw Funds</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose your withdrawal method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Withdrawal Mode Selection */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={withdrawMode === 'kes' ? 'default' : 'outline'}
                    className={`flex-1 ${withdrawMode === 'kes' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'border-slate-600 text-slate-300'}`}
                    onClick={() => setWithdrawMode('kes')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    M-Pesa (KES)
                  </Button>
                  <Button
                    type="button"
                    variant={withdrawMode === 'wallet' ? 'default' : 'outline'}
                    className={`flex-1 ${withdrawMode === 'wallet' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'border-slate-600 text-slate-300'}`}
                    onClick={() => setWithdrawMode('wallet')}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Wallet Transfer
                  </Button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount (USDC)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white pr-16"
                      max={balance}
                      step="0.01"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">USDC</span>
                  </div>
                  {withdrawAmount && (
                    <p className="text-sm text-slate-400 mt-1">
                      ≈ KES {(parseFloat(withdrawAmount) * KES_RATE).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Recipient Address (for wallet transfers) */}
                {withdrawMode === 'wallet' && (
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Recipient Address</label>
                    <Input
                      type="text"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                )}

                {/* M-Pesa Number (for KES withdrawals) */}
                {withdrawMode === 'kes' && (
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">M-Pesa Number</label>
                    <Input
                      type="tel"
                      placeholder="2547XX..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your M-Pesa registered phone number
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleWithdraw}
                  disabled={isLoading || !withdrawAmount}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      {withdrawMode === 'kes' ? 'Withdraw to M-Pesa' : 'Send to Wallet'}
                    </>
                  )}
                </Button>

                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-200">
                    {withdrawMode === 'kes' 
                      ? 'M-Pesa withdrawals are processed within 24 hours. Minimum withdrawal: $10 USDC'
                      : 'Wallet transfers are processed immediately on the Base network. Gas fees apply.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-600 rounded-full">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{tx.description}</p>
                        <p className="text-sm text-slate-400">
                          {new Date(tx.timestamp).toLocaleDateString()} at {new Date(tx.timestamp).toLocaleTimeString()}
                        </p>
                        {tx.txHash && (
                          <a 
                            href={`https://basescan.org/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            View on BaseScan
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount} {tx.currency}
                      </p>
                      <div className="mt-1">{getStatusBadge(tx.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Email</label>
                  <Input 
                    value={user?.email?.address || ''} 
                    disabled 
                    className="bg-slate-700 border-slate-600 text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Wallet Address</label>
                  <Input 
                    value={user?.wallet?.address || ''} 
                    disabled 
                    className="bg-slate-700 border-slate-600 text-slate-400 font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Display Name</label>
                  <Input 
                    placeholder="Enter your name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Company Name</label>
                  <Input 
                    placeholder="Your company (optional)"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Bio</label>
                <textarea 
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md p-3 resize-none"
                />
              </div>

              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">{stats.totalFilms}</p>
                  <p className="text-sm text-slate-400">Films</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">{stats.totalDistributors}</p>
                  <p className="text-sm text-slate-400">Distributors</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">${stats.totalEarnings}</p>
                  <p className="text-sm text-slate-400">Total Earned</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">{transactions.length}</p>
                  <p className="text-sm text-slate-400">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
