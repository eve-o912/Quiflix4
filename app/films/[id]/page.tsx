'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Share2, Clock, Users, Globe, ArrowLeft, Heart } from 'lucide-react';

interface Film {
  id: string;
  title: string;
  director: string;
  description: string;
  genre: string;
  duration_minutes: number;
  language: string;
  location: string;
  price_usd: number;
  poster?: string;
  trailer_url?: string;
  film_hosted_link?: string;
  sales?: string;
  earnings?: string;
}

export default function FilmDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const filmId = params.id as string;
  const referralCode = searchParams.get('ref');

  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Mock film data - in production, fetch from API
    const mockFilms: Record<string, Film> = {
      '1': {
        id: '1',
        title: 'Shadow of the Sun',
        director: 'Chisom Okeke',
        description: 'A gripping drama that follows the journey of a young woman searching for her identity in modern Lagos. Through stunning cinematography and powerful performances, the film explores themes of family, ambition, and self-discovery. Set against the backdrop of Nigeria\'s bustling capital, this is a film that will resonate with audiences worldwide.',
        genre: 'Drama',
        duration_minutes: 128,
        language: 'English',
        location: 'Nigeria',
        price_usd: 4.99,
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop',
        trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        film_hosted_link: 'https://vimeo.com/example',
        sales: '8.2K',
        earnings: '$5.7K',
      },
      '2': {
        id: '2',
        title: 'Urban Hearts',
        director: 'David Mwangi',
        description: 'A romantic journey through the streets of Nairobi. Two souls collide in the most unexpected way, leading to a summer they will never forget. With beautiful cinematography capturing the essence of Kenya\'s vibrant city life.',
        genre: 'Romance',
        duration_minutes: 110,
        language: 'English',
        location: 'Kenya',
        price_usd: 3.99,
        poster: 'https://images.unsplash.com/photo-1489599849228-eb342ebb47e1?w=500&h=750&fit=crop',
        trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        sales: '4.2K',
        earnings: '$2.9K',
      },
    };

    setFilm(mockFilms[filmId] || null);
    setLoading(false);
  }, [filmId]);

  const handleBuyClick = () => {
    const checkoutUrl = referralCode 
      ? `/checkout/${filmId}?ref=${referralCode}`
      : `/checkout/${filmId}`;
    window.location.href = checkoutUrl;
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/films/${filmId}${referralCode ? `?ref=${referralCode}` : ''}`;
    await navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading film details...</p>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Link href="/films" className="flex items-center gap-2 text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4" />
              Back to Films
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">Film not found</p>
            <Link href="/films">
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Films
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/films" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to Films
          </Link>
          <Button
            onClick={handleShare}
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Trailer & Image */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trailer Player */}
            <Card className="bg-card border-border overflow-hidden">
              {showTrailer && film.trailer_url ? (
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={film.trailer_url}
                    title="Film Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div
                  className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative cursor-pointer group overflow-hidden"
                  onClick={() => setShowTrailer(true)}
                >
                  <img
                    src={film.poster}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <Play className="h-16 w-16 text-primary/80 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              )}
            </Card>

            {/* Film Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{film.title}</h1>
                <p className="text-lg text-muted-foreground">Directed by {film.director}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold">{film.duration_minutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="font-semibold">{film.language}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Genre</p>
                    <p className="font-semibold">{film.genre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">{film.location}</p>
                  </div>
                </div>
              </div>

              <Card className="bg-primary/10 border-primary/30 p-6">
                <h3 className="font-bold mb-3 text-lg">About This Film</h3>
                <p className="text-muted-foreground leading-relaxed">{film.description}</p>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Sales</p>
                  <p className="text-2xl font-bold text-primary">{film.sales}</p>
                </Card>
                <Card className="bg-card border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-primary">{film.earnings}</p>
                </Card>
              </div>
            </div>
          </div>

          {/* Right: Purchase Card */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-8 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <p className="text-muted-foreground text-sm mb-2">Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${film.price_usd}</span>
                  <span className="text-muted-foreground text-sm">USD</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">~KES {(film.price_usd / 0.0077).toFixed(0)}</p>
              </div>

              {/* Payment Methods */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm font-semibold mb-3">Pay with:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    M-Pesa (Kenyan Shillings)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    USDC on Base Network
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    USDT on Base Network
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    Credit/Debit Card
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBuyClick}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold"
                  size="lg"
                >
                  Buy Now
                </Button>

                <Button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  variant="outline"
                  className={`w-full gap-2 py-6 text-base ${
                    isWishlisted
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-transparent border-border'
                  }`}
                  size="lg"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Info */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secured by Pretium. Instant access after purchase.
              </p>

              {/* Referral Info */}
              {referralCode && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2 text-center">You came through a referral link</p>
                  <p className="text-xs text-primary text-center font-semibold">Distributor earnings may apply</p>
                </div>
              )}
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-card border-border p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🎬</span>
                  <div>
                    <p className="font-semibold text-sm">Verified Film</p>
                    <p className="text-xs text-muted-foreground">Authentic content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🔒</span>
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">Encrypted transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <p className="font-semibold text-sm">Instant Access</p>
                    <p className="text-xs text-muted-foreground">Watch immediately</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 text-center text-muted-foreground text-sm mt-24">
        <p>© 2024 Quiflix. All rights reserved.</p>
      </footer>
    </div>
  );
}
