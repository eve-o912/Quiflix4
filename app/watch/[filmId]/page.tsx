'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/contexts/wallet-context';
import { Film, Play, DollarSign, Clock, User, Shield } from 'lucide-react';

interface FilmDetails {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: string;
  price: string;
  filmmaker: string;
  releaseYear: string;
  posterUrl: string;
  trailerUrl: string;
  filmHash: string;
}

export default function WatchFilm() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, login } = useWallet();
  const [film, setFilm] = useState<FilmDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [distributorId, setDistributorId] = useState<string>('');
  const [refAddress, setRefAddress] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setDistributorId(urlParams.get('distributor') || '');
    setRefAddress(urlParams.get('ref') || '');

    // Mock film data - replace with actual API call
    const mockFilm: FilmDetails = {
      id: parseInt(params.filmId as string),
      title: 'The Digital Revolution',
      description: 'A groundbreaking documentary about how technology is reshaping our world, featuring interviews with leading tech innovators and thought leaders.',
      genre: 'Documentary',
      duration: '90 minutes',
      price: '9.99',
      filmmaker: 'John Doe',
      releaseYear: '2024',
      posterUrl: '/api/placeholder/400/600',
      trailerUrl: 'https://example.com/trailer.mp4',
      filmHash: 'QmExample123...',
    };

    setTimeout(() => {
      setFilm(mockFilm);
      setLoading(false);
    }, 1000);
  }, [params.filmId]);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      await login();
      return;
    }

    if (!buyerEmail || !film) return;

    setPurchasing(true);
    try {
      // Process payment (integrate with payment provider like Stripe)
      const paymentResult = await processPayment(film.price, buyerEmail);
      
      if (paymentResult.success) {
        // Record sale on blockchain
        const saleResponse = await fetch('/api/sales/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filmId: film.id,
            distributorId: distributorId || null,
            saleAmount: film.price,
            buyerEmail: buyerEmail,
            refAddress: refAddress,
          }),
        });

        if (saleResponse.ok) {
          // Grant access to film
          alert('Purchase successful! You now have access to watch this film.');
          // Redirect to film player or show access modal
        } else {
          throw new Error('Failed to record sale');
        }
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const processPayment = async (amount: string, email: string) => {
    // Mock payment processing - integrate with actual payment provider
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading film details...</p>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Film Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The film you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/films')}>
              Browse Films
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Film Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{film.genre}</Badge>
                <Badge variant="outline">{film.releaseYear}</Badge>
                {distributorId && (
                  <Badge className="bg-blue-600">Distributed by Partner</Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{film.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{film.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {film.duration}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {film.filmmaker}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  ${film.price}
                </div>
              </div>
            </div>

            {/* Film Preview */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={film.posterUrl}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button size="lg" className="bg-white/90 hover:bg-white text-black">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Trailer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Film Information */}
            <Card>
              <CardHeader>
                <CardTitle>Film Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Synopsis</h4>
                  <p className="text-muted-foreground">{film.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Genre</h4>
                    <p className="text-muted-foreground">{film.genre}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Duration</h4>
                    <p className="text-muted-foreground">{film.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Release Year</h4>
                    <p className="text-muted-foreground">{film.releaseYear}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Filmmaker</h4>
                    <p className="text-muted-foreground">{film.filmmaker}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Purchase Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold mb-2">${film.price}</p>
                  <p className="text-sm text-muted-foreground">One-time purchase</p>
                </div>

                {!isAuthenticated ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Connect your wallet to purchase this film
                    </p>
                    <Button onClick={login} className="w-full">
                      Connect Wallet to Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-email">Email Address</Label>
                      <Input
                        id="buyer-email"
                        type="email"
                        placeholder="Enter your email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      onClick={handlePurchase}
                      disabled={purchasing || !buyerEmail}
                      className="w-full"
                    >
                      {purchasing ? (
                        'Processing...'
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Purchase Film
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Revenue Distribution Info */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
                    Revenue Distribution
                  </h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Filmmaker (70%):</span>
                      <span>${(parseFloat(film.price) * 0.7).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Distributor (20%):</span>
                      <span>${(parseFloat(film.price) * 0.2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Quiflix (10%):</span>
                      <span>${(parseFloat(film.price) * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <h5 className="font-medium text-green-900 dark:text-green-100 text-sm">
                      Blockchain Secured
                    </h5>
                  </div>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    This purchase is recorded on-chain, ensuring transparent revenue distribution and immutable ownership records.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Choose Quiflix?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Blockchain Protected</p>
                    <p className="text-xs text-muted-foreground">Every transaction is secured on-chain</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Fair Revenue Split</p>
                    <p className="text-xs text-muted-foreground">70% to filmmakers, 20% to distributors</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Support Filmmakers</p>
                    <p className="text-xs text-muted-foreground">Directly support content creators</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
