'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Download, Play, Share2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const filmId = searchParams.get('film_id');

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (!orderId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/payment/confirm?order_id=${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setPayment(data);
        }
      } catch (error) {
        console.error('[v0] Error confirming payment:', error);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [orderId]);

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-6 py-16">
        {/* Success Card */}
        <Card className="bg-gradient-to-br from-green-500/10 to-accent/10 border-green-500/30 p-12 text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Your film is ready to watch instantly
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono text-foreground">{orderId}</span>
            </p>
          )}
        </Card>

        {/* Film Info */}
        {payment && (
          <Card className="bg-card border-border p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Film</p>
                <p className="text-lg font-bold">{payment.filmTitle}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Amount Paid</p>
                <p className="text-lg font-bold text-primary">
                  {payment.amountUsd} {payment.stablecoin}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Payment Method</p>
                <p className="text-lg font-bold capitalize">
                  {payment.paymentMethod === 'mpesa' ? 'M-Pesa' : payment.paymentMethod}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filmId && (
            <Link href={`/films/${filmId}`}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 gap-2" size="lg">
                <Play className="h-5 w-5" />
                Watch Film
              </Button>
            </Link>
          )}
          <Button variant="outline" className="w-full bg-transparent py-6 gap-2" size="lg">
            <Download className="h-5 w-5" />
            Download Receipt
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Access Your Film</h3>
                <p className="text-muted-foreground text-sm">
                  Instant access to watch the film on all your devices
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Check Your Dashboard</h3>
                <p className="text-muted-foreground text-sm">
                  View your purchased films and watch history
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Share & Earn</h3>
                <p className="text-muted-foreground text-sm">
                  Share your referral link and earn 20% commission on each sale
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="text-center mt-12">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
