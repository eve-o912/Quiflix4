'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, ExternalLink, Film, DollarSign } from 'lucide-react';
import { useWallet } from '@/contexts/wallet-context';

interface DistributionLinkProps {
  filmId: number;
  filmTitle: string;
  filmPrice: string;
  distributorId: number;
  hasDDT: boolean;
}

export function DistributionLink({ 
  filmId, 
  filmTitle, 
  filmPrice, 
  distributorId, 
  hasDDT 
}: DistributionLinkProps) {
  const { user } = useWallet();
  const [link, setLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState('0');

  useEffect(() => {
    if (hasDDT && user?.walletAddress) {
      // Generate personalized distribution link
      const baseUrl = window.location.origin;
      const distributionLink = `${baseUrl}/watch/${filmId}?distributor=${distributorId}&ref=${user.walletAddress}`;
      setLink(distributionLink);
      
      // Fetch sales data for this distributor
      fetchSalesData();
    }
  }, [filmId, distributorId, hasDDT, user?.walletAddress]);

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`/api/sales/record?distributorId=${distributorId}&filmId=${filmId}`);
      const data = await response.json();
      
      if (data.sales) {
        setSales(data.sales);
        const revenue = data.sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.sale_amount), 0);
        setTotalRevenue(revenue.toFixed(2));
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Watch "${filmTitle}" on Quiflix`,
          text: `Check out this amazing film: ${filmTitle}`,
          url: link,
        });
      } catch (error) {
        console.error('Failed to share link:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  if (!hasDDT) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">DDT Required</h3>
          <p className="text-muted-foreground">
            You need a Digital Distribution Token (DDT) for this film to generate a personalized distribution link.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Distribution Link for "{filmTitle}"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Link Generation */}
        <div className="space-y-2">
          <Label htmlFor="distribution-link">Your Personalized Distribution Link</Label>
          <div className="flex gap-2">
            <Input
              id="distribution-link"
              value={link}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {isCopied ? (
                <div className="h-4 w-4 text-green-600">✓</div>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={shareLink}
              className="shrink-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this link with buyers. Every sale through this link will be tracked and revenue will be automatically distributed.
          </p>
        </div>

        {/* Film Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Film Price</p>
              <p className="text-lg font-bold">${filmPrice}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Your Commission (20%)</p>
              <p className="text-lg font-bold text-green-600">${(parseFloat(filmPrice) * 0.2).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Sales Stats */}
        <div className="space-y-3">
          <h4 className="font-semibold">Your Sales Performance</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-card border rounded-lg">
              <p className="text-2xl font-bold text-primary">{sales.length}</p>
              <p className="text-sm text-muted-foreground">Total Sales</p>
            </div>
            <div className="text-center p-3 bg-card border rounded-lg">
              <p className="text-2xl font-bold text-green-600">${totalRevenue}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>

          {sales.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Recent Sales</h5>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {sales.slice(0, 5).map((sale, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-medium">${sale.sale_amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Revenue Split Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Revenue Distribution</h5>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800 dark:text-blue-200">Filmmaker (70%):</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">
                ${(parseFloat(filmPrice) * 0.7).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800 dark:text-blue-200">You (20%):</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">
                ${(parseFloat(filmPrice) * 0.2).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800 dark:text-blue-200">Quiflix (10%):</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">
                ${(parseFloat(filmPrice) * 0.1).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Test Link
            </a>
          </Button>
          <Button variant="outline" onClick={fetchSalesData}>
            Refresh Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
