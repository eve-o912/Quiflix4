'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PremiumCard, PremiumStats } from '@/components/ui/premium-card';
import { HeroSection } from '@/components/ui/hero-section';
import { 
  Film, 
  Play, 
  Zap, 
  TrendingUp, 
  Users, 
  Globe,
  Star,
  Shield,
  ArrowRight,
  DollarSign,
  PlayCircle,
  Target,
  Award,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';
import { AuthButton } from '@/components/auth/auth-button';

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/quiflix-logo.png"
              alt="Quiflix"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quiflix</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/films" className="text-sm hover:text-primary transition-colors">
              Browse Films
            </Link>
            <Link href="/apply/filmmaker" className="text-sm hover:text-primary transition-colors">
              <Film className="mr-1 h-4 w-4" />
              For Filmmakers
            </Link>
            <Link href="/apply/distributor" className="text-sm hover:text-primary transition-colors">
              <Target className="mr-1 h-4 w-4" />
              For Distributors
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quiflix</span>?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The future of film distribution is here. Blockchain-powered transparency, 
              instant revenue sharing, and global reach for independent filmmakers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PremiumCard
              title="Smart Wallet Integration"
              description="Embedded wallets with no seed phrases. Secure, simple, and blockchain-ready."
              icon={<Shield className="h-8 w-8" />}
              badge="Web3 Native"
              features={[
                "No seed phrases required",
                "Auto-generated wallets",
                "Multi-chain support",
                "Bank-grade security"
              ]}
              gradient
            />
            
            <PremiumCard
              title="Instant Revenue Distribution"
              description="Automated 70/20/10 splits. Filmmakers get paid instantly when sales happen."
              icon={<DollarSign className="h-8 w-8" />}
              badge="USDC Powered"
              features={[
                "Real-time payments",
                "Transparent accounting",
                "Multi-currency support",
                "Automated tax reporting"
              ]}
              cta={{
                text: "View Revenue Model",
                action: () => console.log('View revenue model')
              }}
            />
            
            <PremiumCard
              title="Global Distribution Network"
              description="Reach audiences worldwide. Personalized links, analytics, and marketing tools."
              icon={<Globe className="h-8 w-8" />}
              badge="Premium"
              features={[
                "Personalized links",
                "Advanced analytics",
                "Social sharing tools",
                "Performance tracking"
              ]}
              cta={{
                text: "Explore Network",
                action: () => console.log('Explore network')
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by <span className="text-purple-400">10,000+</span> Creators
            </h2>
            <p className="text-lg text-slate-300 mb-12">
              Join the growing community of filmmakers and distributors earning more with blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumStats
              title="Total Revenue"
              value="$2.5M+"
              change="+25% this month"
              changeType="increase"
              icon={<DollarSign className="h-6 w-6 text-green-400" />}
            />
            
            <PremiumStats
              title="Active Films"
              value="500+"
              change="+45% this month"
              changeType="increase"
              icon={<Film className="h-6 w-6 text-purple-400" />}
            />
            
            <PremiumStats
              title="Distributors"
              value="1,200+"
              change="+18% this month"
              changeType="increase"
              icon={<Users className="h-6 w-6 text-blue-400" />}
            />
            
            <PremiumStats
              title="Countries"
              value="85+"
              change="+12% this month"
              changeType="increase"
              icon={<Globe className="h-6 w-6 text-yellow-400" />}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quiflix</span> Works
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              From film submission to revenue distribution - everything is transparent and automated
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Submit Film</h3>
              <p className="text-slate-300 leading-relaxed">
                Filmmakers submit their projects for review. Smart contracts ensure fair terms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Approved</h3>
              <p className="text-slate-300 leading-relaxed">
                Approved films get 500 DDTs minted. Distributors can apply for exclusive rights.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Earn Revenue</h3>
              <p className="text-slate-300 leading-relaxed">
                Automated 70/20/10 splits. USDC payments. Real-time tracking and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Transform</span> Your Film Career?
          </h2>
          <p className="text-xl text-purple-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join thousands of filmmakers and distributors already earning more with Quiflix's 
            blockchain-powered distribution platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-purple-900 hover:bg-slate-100 border-0 px-8 py-4 text-lg font-semibold shadow-lg"
              asChild
            >
              <Link href="/apply/filmmaker" className="flex items-center">
                <Film className="mr-2 h-5 w-5" />
                Apply as Filmmaker
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-purple-400 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg"
              asChild
            >
              <Link href="/apply/distributor" className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Apply as Distributor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Quiflix</Link></li>
                <li><Link href="/how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Creators</h3>
              <ul className="space-y-2">
                <li><Link href="/apply/filmmaker" className="text-slate-400 hover:text-white transition-colors">For Filmmakers</Link></li>
                <li><Link href="/apply/distributor" className="text-slate-400 hover:text-white transition-colors">For Distributors</Link></li>
                <li><Link href="/resources" className="text-slate-400 hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Quiflix. All rights reserved. Built with ❤️ for independent filmmakers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
