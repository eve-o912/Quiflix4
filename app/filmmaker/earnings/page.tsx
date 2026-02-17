'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  LogOut,
  Film,
  BarChart3,
  Wallet,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FilmEarnings {
  filmId: string;
  filmTitle: string;
  totalSales: number;
  filmmakerShare: number;
  distributorCount: number;
  lastSale?: string;
}

interface EarningsStats {
  totalEarnings: number;
  totalStablecoin: string;
  thisMonthEarnings: number;
  activeDistributors: number;
  totalSales: number;
}

export default function FilmmakerEarningsDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<EarningsStats>({
    totalEarnings: 0,
    totalStablecoin: 'USDC',
    thisMonthEarnings: 0,
    activeDistributors: 0,
    totalSales: 0,
  });
  const [filmEarnings, setFilmEarnings] = useState<FilmEarnings[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = '/auth/login';
      return;
    }

    setUser(user);
    fetchEarningsData(user.id);
  };

  const fetchEarningsData = async (userId: string) => {
    const supabase = createClient();

    try {
      // Get filmmaker's films
      const { data: films } = await supabase
        .from('films')
        .select('id, title, total_sales_value')
        .eq('filmmaker_email', user?.email || '');

      if (!films) {
        setLoading(false);
        return;
      }

      // Get all revenue payouts for filmmaker's films
      const { data: payouts } = await supabase
        .from('revenue_payouts')
        .select('*')
        .in('film_id', films.map(f => f.id));

      if (payouts) {
        // Calculate totals
        const totalFilmmakerShare = payouts.reduce((sum, p) => sum + p.filmmaker_share, 0);
        const thisMonth = payouts
          .filter(p => {
            const date = new Date(p.created_at);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          })
          .reduce((sum, p) => sum + p.filmmaker_share, 0);

        setStats({
          totalEarnings: totalFilmmakerShare,
          totalStablecoin: 'USDC + USDT',
          thisMonthEarnings: thisMonth,
          activeDistributors: payouts.length,
          totalSales: payouts.reduce((sum, p) => sum + p.total_sale_amount, 0),
        });

        // Calculate per-film earnings
        const filmEarningsData: FilmEarnings[] = films.map(film => {
          const filmPayouts = payouts.filter(p => p.film_id === film.id);
          return {
            filmId: film.id,
            filmTitle: film.title,
            totalSales: filmPayouts.reduce((sum, p) => sum + p.total_sale_amount, 0),
            filmmakerShare: filmPayouts.reduce((sum, p) => sum + p.filmmaker_share, 0),
            distributorCount: new Set(filmPayouts.map(p => p.distributor_id)).size,
            lastSale: filmPayouts.length > 0 ? filmPayouts[0].created_at : undefined,
          };
        });

        setFilmEarnings(filmEarningsData.sort((a, b) => b.filmmakerShare - a.filmmakerShare));
      }
    } catch (error) {
      console.error('[v0] Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const exportReport = () => {
    const csv = [
      ['Film', 'Total Sales', 'Your Share (70%)', 'Distributors'],
      ...filmEarnings.map(f => [
        f.filmTitle,
        `$${(f.totalSales / 100).toFixed(2)}`,
        `$${(f.filmmakerShare / 100).toFixed(2)}`,
        f.distributorCount,
      ]),
    ];

    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filmmaker-earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading earnings...</p>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Quiflix Filmmaker</span>
          </Link>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Earnings Dashboard</h1>
          <p className="text-muted-foreground">
            Track your 70% filmmaker share from all sales
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-primary">
                  ${(stats.totalEarnings / 100).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">This Month</p>
                <p className="text-3xl font-bold">
                  ${(stats.thisMonthEarnings / 100).toFixed(2)}
                </p>
              </div>
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Sales</p>
                <p className="text-3xl font-bold">
                  ${(stats.totalSales / 100).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Stablecoin</p>
                <p className="text-3xl font-bold">{stats.totalStablecoin}</p>
              </div>
              <Wallet className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Active Sales</p>
                <p className="text-3xl font-bold">{stats.activeDistributors}</p>
              </div>
              <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </Card>
        </div>

        {/* Film Earnings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Earnings by Film</h2>
            <Button
              onClick={exportReport}
              variant="outline"
              className="gap-2 bg-transparent"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {filmEarnings.length === 0 ? (
            <Card className="bg-card border-border p-12 text-center">
              <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No earnings yet</h3>
              <p className="text-muted-foreground mb-4">
                Your earnings will appear here once distributors start selling your films
              </p>
              <Link href="/filmmaker-dashboard">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Film className="h-4 w-4" />
                  Go to My Films
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {filmEarnings.map(film => (
                <Card key={film.filmId} className="bg-card border-border p-6 hover:border-primary/50 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Film Title */}
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground text-sm mb-1">Film</p>
                      <p className="text-lg font-bold">{film.filmTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {film.distributorCount} active distributor{film.distributorCount !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Total Sales */}
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Total Sales</p>
                      <p className="text-xl font-bold">
                        ${(film.totalSales / 100).toFixed(2)}
                      </p>
                    </div>

                    {/* Your Share (70%) */}
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Your Share (70%)</p>
                      <p className="text-xl font-bold text-primary">
                        ${(film.filmmakerShare / 100).toFixed(2)}
                      </p>
                    </div>

                    {/* View Details */}
                    <div className="flex items-end">
                      <Link href={`/filmmaker/film/${film.filmId}/analytics`} className="w-full">
                        <Button variant="outline" className="w-full bg-transparent">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <Card className="bg-card border-border p-6 border-primary/30">
          <h3 className="font-semibold mb-3">Earnings Breakdown</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between">
              <span>Your share (Filmmaker):</span>
              <span className="text-foreground font-semibold">70%</span>
            </li>
            <li className="flex justify-between">
              <span>Distributor share:</span>
              <span className="text-foreground font-semibold">20%</span>
            </li>
            <li className="flex justify-between">
              <span>Platform fee (Quiflix):</span>
              <span className="text-foreground font-semibold">10%</span>
            </li>
            <li className="pt-3 border-t border-border mt-3">
              <span>All earnings are in stablecoins (USDC/USDT) on Base network</span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
