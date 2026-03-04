'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Film, 
  Users, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

interface FilmListing {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  year: number;
  country: string;
  language: string;
  thumbnail: string;
  filmmaker: {
    name: string;
    walletAddress: string;
  };
  stats: {
    totalViews: number;
    totalEarnings: number;
    distributorCount: number;
    remainingDDTs: number;
  };
  price: {
    usd: number;
    kes: number;
  };
  status: 'available' | 'applied' | 'approved' | 'full';
  requirements: string[];
}

const mockFilms: FilmListing[] = [
  {
    id: '1',
    title: 'The African Dream',
    description: 'A powerful documentary following three entrepreneurs building businesses across Kenya, showcasing innovation and resilience in East Africa.',
    genre: 'Documentary',
    duration: '1h 45m',
    year: 2024,
    country: 'Kenya',
    language: 'Swahili, English',
    thumbnail: '/placeholder-film-1.jpg',
    filmmaker: {
      name: 'Sarah Kamau',
      walletAddress: '0x1234...5678'
    },
    stats: {
      totalViews: 12500,
      totalEarnings: 8500,
      distributorCount: 8,
      remainingDDTs: 492
    },
    price: {
      usd: 4.99,
      kes: 645
    },
    status: 'available',
    requirements: [
      'Minimum 1000 social media followers',
      'Experience in film promotion',
      'Active in Kenyan film community'
    ]
  },
  {
    id: '2',
    title: 'Nairobi Nights',
    description: 'A gripping thriller set in the bustling streets of Nairobi, exploring themes of corruption, justice, and redemption.',
    genre: 'Thriller',
    duration: '2h 10m',
    year: 2023,
    country: 'Kenya',
    language: 'English',
    thumbnail: '/placeholder-film-2.jpg',
    filmmaker: {
      name: 'James Ochieng',
      walletAddress: '0x8765...4321'
    },
    stats: {
      totalViews: 8900,
      totalEarnings: 6200,
      distributorCount: 12,
      remainingDDTs: 488
    },
    price: {
      usd: 5.99,
      kes: 775
    },
    status: 'available',
    requirements: [
      'Established distribution network',
      'Marketing experience required',
      'Previous film sales track record'
    ]
  },
  {
    id: '3',
    title: 'Mama Africa',
    description: 'A heartwarming story of a mother\'s sacrifice and love, set against the backdrop of rural Tanzania.',
    genre: 'Drama',
    duration: '1h 55m',
    year: 2024,
    country: 'Tanzania',
    language: 'Swahili',
    thumbnail: '/placeholder-film-3.jpg',
    filmmaker: {
      name: 'Amina Hassan',
      walletAddress: '0xabcd...efgh'
    },
    stats: {
      totalViews: 15200,
      totalEarnings: 9800,
      distributorCount: 6,
      remainingDDTs: 494
    },
    price: {
      usd: 3.99,
      kes: 515
    },
    status: 'applied',
    requirements: [
      'Tanzanian market knowledge',
      'Swahili language skills',
      'Community engagement experience'
    ]
  },
  {
    id: '4',
    title: 'Tech Titans of Lagos',
    description: 'An inspiring documentary about Nigeria\'s booming tech ecosystem and the innovators driving change.',
    genre: 'Documentary',
    duration: '1h 30m',
    year: 2024,
    country: 'Nigeria',
    language: 'English',
    thumbnail: '/placeholder-film-4.jpg',
    filmmaker: {
      name: 'Chidi Okonkwo',
      walletAddress: '0x2468...1357'
    },
    stats: {
      totalViews: 22100,
      totalEarnings: 15400,
      distributorCount: 25,
      remainingDDTs: 475
    },
    price: {
      usd: 6.99,
      kes: 905
    },
    status: 'full',
    requirements: [
      'Nigerian tech community access',
      'Digital marketing expertise',
      'Corporate partnership connections'
    ]
  },
  {
    id: '5',
    title: 'River of Gold',
    description: 'An environmental documentary exploring the impact of gold mining on Ghana\'s rivers and communities.',
    genre: 'Documentary',
    duration: '1h 40m',
    year: 2023,
    country: 'Ghana',
    language: 'English, Twi',
    thumbnail: '/placeholder-film-5.jpg',
    filmmaker: {
      name: 'Kwame Asante',
      walletAddress: '0x9876...5432'
    },
    stats: {
      totalViews: 7800,
      totalEarnings: 5200,
      distributorCount: 4,
      remainingDDTs: 496
    },
    price: {
      usd: 4.49,
      kes: 580
    },
    status: 'available',
    requirements: [
      'Environmental advocacy experience',
      'Ghana market knowledge',
      'Educational distribution channels'
    ]
  },
  {
    id: '6',
    title: 'Rhythm of the Streets',
    description: 'A vibrant musical journey through the dance and music scenes of Johannesburg\'s townships.',
    genre: 'Music Documentary',
    duration: '1h 35m',
    year: 2024,
    country: 'South Africa',
    language: 'English, Zulu',
    thumbnail: '/placeholder-film-6.jpg',
    filmmaker: {
      name: 'Thandiwe Nkosi',
      walletAddress: '0x1357...2468'
    },
    stats: {
      totalViews: 18900,
      totalEarnings: 12300,
      distributorCount: 15,
      remainingDDTs: 485
    },
    price: {
      usd: 5.49,
      kes: 710
    },
    status: 'approved',
    requirements: [
      'Music industry connections',
      'South African market access',
      'Event promotion experience'
    ]
  }
];

export function FilmSelection() {
  const { user, authenticated } = usePrivy();
  const [films, setFilms] = useState<FilmListing[]>(mockFilms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedFilm, setSelectedFilm] = useState<FilmListing | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Filter films
  const filteredFilms = films.filter(film => {
    const matchesSearch = film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.filmmaker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || film.genre === selectedGenre;
    const matchesCountry = selectedCountry === 'all' || film.country === selectedCountry;
    
    return matchesSearch && matchesGenre && matchesCountry;
  });

  const genres = ['all', ...Array.from(new Set(films.map(f => f.genre)))];
  const countries = ['all', ...Array.from(new Set(films.map(f => f.country)))];

  const handleApply = async (film: FilmListing) => {
    setSelectedFilm(film);
    setApplicationMessage('');
    setSubmitError('');
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    if (!selectedFilm) return;
    if (!applicationMessage.trim()) {
      setSubmitError('Please tell us why you want to distribute this film');
      return;
    }
    
    setIsApplying(true);
    setSubmitError('');
    
    try {
      // Get user data from Privy
      const walletAddress = user?.wallet?.address || '';
      const email = user?.email?.address || '';
      
      // Prepare application data
      const applicationData = {
        firstName: user?.google?.name?.split(' ')[0] || email.split('@')[0] || 'Anonymous',
        lastName: user?.google?.name?.split(' ')[1] || 'User',
        email: email,
        phone: '',
        country: 'Unknown',
        companyName: '',
        companyWebsite: '',
        socialMedia: '',
        followerCount: '',
        filmTitle: selectedFilm.title,
        walletAddress: walletAddress,
        experience: '',
        whyThisFilm: applicationMessage,
      };

      // Call the API
      const response = await fetch('/api/applications/distributor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      // Update film status locally
      setFilms(prev => prev.map(f => 
        f.id === selectedFilm.id 
          ? { ...f, status: 'applied' as const }
          : f
      ));
      
      alert(`Application submitted for "${selectedFilm.title}"! You'll receive a notification once approved.`);
      setShowApplicationModal(false);
      setSelectedFilm(null);
      setApplicationMessage('');
    } catch (error) {
      console.error('Application error:', error);
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>;
      case 'applied':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Applied</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Approved</Badge>;
      case 'full':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Full</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!authenticated) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <Film className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect to Browse Films</h3>
          <p className="text-slate-400 mb-4">Please sign in to view available films and apply for distribution rights</p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Available Films</h1>
          <p className="text-slate-400">Browse and apply to distribute premium African content</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            {films.filter(f => f.status === 'available').length} Available
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Available Films</p>
                <p className="text-2xl font-bold text-white">{films.filter(f => f.status === 'available').length}</p>
              </div>
              <Film className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Distributors</p>
                <p className="text-2xl font-bold text-white">
                  {films.reduce((acc, f) => acc + f.stats.distributorCount, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${films.reduce((acc, f) => acc + f.stats.totalEarnings, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg. Film Price</p>
                <p className="text-2xl font-bold text-white">
                  ${(films.reduce((acc, f) => acc + f.price.usd, 0) / films.length).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search films, filmmakers, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Genres</option>
                {genres.filter(g => g !== 'all').map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Countries</option>
                {countries.filter(c => c !== 'all').map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Films Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFilms.map((film) => (
          <Card key={film.id} className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
            {/* Film Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <Film className="h-16 w-16 text-slate-600" />
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {getStatusBadge(film.status)}
              </div>
              
              {/* Price Badge */}
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-slate-900/80 text-white border-slate-600">
                  ${film.price.usd} / KES {film.price.kes}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              {/* Title and Genre */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {film.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                    {film.genre}
                  </Badge>
                  <span>•</span>
                  <span>{film.duration}</span>
                  <span>•</span>
                  <span>{film.year}</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {film.description}
              </p>
              
              {/* Filmmaker */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {film.filmmaker.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-slate-300">{film.filmmaker.name}</span>
                <span className="text-xs text-slate-500 font-mono">
                  {film.filmmaker.walletAddress}
                </span>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="p-2 bg-slate-700/50 rounded">
                  <p className="text-sm font-semibold text-white">{film.stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Views</p>
                </div>
                <div className="p-2 bg-slate-700/50 rounded">
                  <p className="text-sm font-semibold text-white">{film.stats.distributorCount}</p>
                  <p className="text-xs text-slate-400">Distributors</p>
                </div>
                <div className="p-2 bg-slate-700/50 rounded">
                  <p className="text-sm font-semibold text-white">{film.stats.remainingDDTs}</p>
                  <p className="text-xs text-slate-400">DDTs Left</p>
                </div>
              </div>
              
              {/* Location and Language */}
              <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{film.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{film.language}</span>
                </div>
              </div>
              
              {/* Apply Button */}
              <Button
                onClick={() => handleApply(film)}
                disabled={film.status !== 'available'}
                className={`w-full ${
                  film.status === 'available'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : film.status === 'applied'
                    ? 'bg-yellow-600/50 text-yellow-200 cursor-not-allowed'
                    : film.status === 'approved'
                    ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {film.status === 'available' ? (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Become Distributor
                  </>
                ) : film.status === 'applied' ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Application Pending
                  </>
                ) : film.status === 'approved' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Already Approved
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Distributors Full
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFilms.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Films Found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedFilm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="bg-slate-900 border-slate-700 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Apply for Distribution Rights</CardTitle>
              <CardDescription className="text-slate-400">
                {selectedFilm.title} by {selectedFilm.filmmaker.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Film Details */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Price</span>
                  <span className="text-white font-semibold">
                    ${selectedFilm.price.usd} / KES {selectedFilm.price.kes}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">DDTs Available</span>
                  <span className="text-white font-semibold">{selectedFilm.stats.remainingDDTs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Distributors</span>
                  <span className="text-white font-semibold">{selectedFilm.stats.distributorCount}</span>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-white font-medium mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {selectedFilm.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Message */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Why do you want to distribute this film? <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your distribution network, audience reach, and marketing strategy..."
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md p-3 resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                {submitError && (
                  <p className="text-red-400 text-sm mt-2">{submitError}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowApplicationModal(false)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                  disabled={isApplying}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitApplication}
                  disabled={isApplying || !applicationMessage.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
