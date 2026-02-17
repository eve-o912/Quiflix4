'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  DollarSign,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface WithdrawalForm {
  amount: number;
  stablecoin: 'USDC' | 'USDT';
  mpesaPhone: string;
  mpesaName: string;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  amountKes: number;
  stablecoin: string;
  mpesaPhone: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export default function WithdrawalPage() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState({ usdc: 0, usdt: 0 });
  const [exchangeRate, setExchangeRate] = useState(0.0077);
  const [form, setForm] = useState<WithdrawalForm>({
    amount: 0,
    stablecoin: 'USDC',
    mpesaPhone: '',
    mpesaName: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<WithdrawalHistory[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchExchangeRate();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = '/auth/login';
      return;
    }

    setUser(user);
    fetchBalance(user.id);
    setLoading(false);
  };

  const fetchBalance = async (userId: string) => {
    const supabase = createClient();

    try {
      // Get total earnings from revenue payouts
      const { data: payouts } = await supabase
        .from('revenue_payouts')
        .select('filmmaker_share, distributor_share')
        .or(`filmmaker_id.eq.${userId},distributor_id.eq.${userId}`);

      if (payouts) {
        const total = payouts.reduce((sum, p) => {
          const amount = p.filmmaker_share || p.distributor_share || 0;
          return sum + amount;
        }, 0);

        // For demo, split evenly between USDC and USDT
        setBalance({
          usdc: total / 2,
          usdt: total / 2,
        });
      }

      // Get withdrawal history
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (withdrawals) {
        setHistory(withdrawals);
      }
    } catch (error) {
      console.error('[v0] Error fetching balance:', error);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('/api/payment/exchange-rate');
      if (response.ok) {
        const data = await response.json();
        setExchangeRate(data.rate);
      }
    } catch (error) {
      console.error('[v0] Error fetching exchange rate:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate inputs
      if (!form.amount || form.amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      if (!form.mpesaPhone || form.mpesaPhone.length < 10) {
        alert('Please enter a valid M-Pesa phone number');
        return;
      }

      if (!form.mpesaName) {
        alert('Please enter M-Pesa account name');
        return;
      }

      const selectedBalance = form.stablecoin === 'USDC' ? balance.usdc : balance.usdt;
      if (form.amount > selectedBalance) {
        alert('Insufficient balance');
        return;
      }

      // Create withdrawal request
      const response = await fetch('/api/withdrawal/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: form.amount,
          stablecoin: form.stablecoin,
          amountKes: form.amount / exchangeRate,
          mpesaPhone: form.mpesaPhone,
          mpesaName: form.mpesaName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setForm({
          amount: 0,
          stablecoin: 'USDC',
          mpesaPhone: '',
          mpesaName: '',
        });

        // Refresh history
        fetchBalance(user.id);

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create withdrawal request');
      }
    } catch (error) {
      console.error('[v0] Error submitting withdrawal:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const amountInKes = form.amount / exchangeRate;
  const totalBalance = balance.usdc + balance.usdt;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center">
          <Link href="/earnings" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to Earnings
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Withdraw Earnings</h1>
          <p className="text-lg text-muted-foreground">
            Convert your stablecoins to Kenyan Shillings and withdraw via M-Pesa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success Message */}
            {success && (
              <Card className="bg-green-500/10 border-green-500/30 p-6">
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Withdrawal Request Submitted!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your withdrawal will be processed within 2-4 business hours
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Balance Overview */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-6">
              <p className="text-muted-foreground text-sm mb-2">Total Balance</p>
              <p className="text-4xl font-bold text-primary mb-4">
                ${(totalBalance / 100).toFixed(2)}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">USDC</p>
                  <p className="font-semibold">${(balance.usdc / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">USDT</p>
                  <p className="font-semibold">${(balance.usdt / 100).toFixed(2)}</p>
                </div>
              </div>
            </Card>

            {/* Withdrawal Form */}
            <Card className="bg-card border-border p-8">
              <h2 className="text-2xl font-bold mb-6">Withdrawal Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stablecoin Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Stablecoin to Withdraw
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['USDC', 'USDT'].map(coin => (
                      <button
                        key={coin}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, stablecoin: coin as any }))}
                        className={`p-4 border-2 rounded-lg font-medium transition-colors ${
                          form.stablecoin === coin
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {coin}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Amount ({form.stablecoin})
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="number"
                      name="amount"
                      value={form.amount || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: ${(
                      (form.stablecoin === 'USDC' ? balance.usdc : balance.usdt) / 100
                    ).toFixed(2)}
                  </p>
                </div>

                {/* KES Conversion Display */}
                {form.amount > 0 && (
                  <Card className="bg-background border-border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">You will receive in KES</p>
                        <p className="text-2xl font-bold">
                          KES {amountInKes.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Exchange Rate</p>
                        <p className="text-sm font-semibold">1 USD = {(1 / exchangeRate).toFixed(0)} KES</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* M-Pesa Phone Number */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    name="mpesaPhone"
                    value={form.mpesaPhone}
                    onChange={handleInputChange}
                    placeholder="254712345678"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Include country code (e.g., 254 for Kenya)
                  </p>
                </div>

                {/* M-Pesa Account Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    M-Pesa Account Name
                  </label>
                  <input
                    type="text"
                    name="mpesaName"
                    value={form.mpesaName}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Warning */}
                <Card className="bg-amber-500/10 border-amber-500/30 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Processing Information</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>Minimum withdrawal: $1 USD</li>
                        <li>Processing time: 2-4 business hours</li>
                        <li>M-Pesa fee: KES 50</li>
                        <li>Ensure account name matches M-Pesa registration</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting || !form.amount || !form.mpesaPhone || !form.mpesaName}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold gap-2 disabled:opacity-50"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Clock className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Request Withdrawal
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Withdrawal History */}
          <div className="space-y-6">
            <Card className="bg-card border-border p-6">
              <h3 className="font-bold text-lg mb-4">Recent Withdrawals</h3>

              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No withdrawals yet
                </p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 5).map(withdrawal => (
                    <div key={withdrawal.id} className="pb-3 border-b border-border last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">
                          KES {withdrawal.amountKes.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            withdrawal.status === 'completed'
                              ? 'bg-green-500/10 text-green-500'
                              : withdrawal.status === 'failed'
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {withdrawal.status.charAt(0).toUpperCase() +
                            withdrawal.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Help Section */}
            <Card className="bg-card border-border p-6">
              <h3 className="font-bold mb-3">Need Help?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Withdrawals processed daily</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Check M-Pesa in 2-4 hours</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Contact support for issues</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
