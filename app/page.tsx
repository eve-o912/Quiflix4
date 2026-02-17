'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Film, Play, Zap, TrendingUp, Users, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-[#0a0a0a] text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#d4af37]/20 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent group-hover:from-[#fcf6ba] group-hover:to-[#d4af37] transition-all duration-300">
              Quiflix
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/films" className="text-sm font-medium hover:text-[#d4af37] transition-colors">
              Browse Films
            </Link>
            <Link href="/apply/filmmaker" className="text-sm font-medium hover:text-[#d4af37] transition-colors">
              For Filmmakers
            </Link>
            <Link href="/apply/distributor" className="text-sm font-medium hover:text-[#d4af37] transition-colors">
              For Distributors
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm hover:text-[#d4af37]">Log In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#fcf6ba] hover:to-[#d4af37] text-black font-semibold border-2 border-[#d4af37]/30 shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 transition-all duration-300">
                  Sign Up & Get Wallet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section with Cinematic Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/70 to-[#0a0a0a]/95 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1485095329183-d0ddc50893fe?w=1920&h=1080&fit=crop"
              alt="Cinematic background"
              className="w-full h-full object-cover opacity-30 animate-slow-zoom"
            />
          </div>
          
          <div className="mx-auto max-w-4xl px-6 py-24 relative z-20 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/5 backdrop-blur-md animate-slideDown hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 transition-all duration-300 group">
              <Zap className="h-5 w-5 text-[#d4af37] animate-pulse" />
              <span className="text-sm font-medium text-[#d4af37]/90">Premium Film Distribution Reimagined</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-tight animate-slideUp text-balance">
              Your Film, Your Token,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#b38728] animate-glow">Your Revenue</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#e8e8e8]/80 max-w-2xl mb-12 leading-relaxed animate-fadeIn font-light" style={{ animationDelay: '0.2s' }}>
              Distribute films globally, earn instantly in stablecoins, and withdraw in local currency. One platform for filmmakers, distributors, and film lovers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#fcf6ba] hover:to-[#d4af37] text-black font-bold px-8 py-6 text-lg border-2 border-[#d4af37]/30 shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 transition-all duration-300 group">
                  <span>Create Wallet & Sign Up</span>
                </Button>
              </Link>
              <Link href="/films">
                <Button size="lg" variant="outline" className="bg-transparent px-8 py-6 text-lg border-2 border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 transition-all duration-300">
                  <Play className="h-5 w-5 mr-2" />
                  Browse Films
                </Button>
              </Link>
            </div>

            <div className="mt-20 pt-20 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-center gap-12 text-sm animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 text-[#e8e8e8]/70">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#fcf6ba] animate-pulse shadow-lg shadow-[#d4af37]/50" />
                <span className="font-medium">500+ Filmmakers Active</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[#e8e8e8]/70">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#fcf6ba] animate-pulse shadow-lg shadow-[#d4af37]/50" />
                <span className="font-medium">2M+ Films Distributed</span>
              </div>
              <div className="flex items-center gap-3 text-[#e8e8e8]/70">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#fcf6ba] animate-pulse shadow-lg shadow-[#d4af37]/50" />
                <span className="font-medium">Crypto + M-Pesa Payments</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 border-b border-[#d4af37]/10 bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]/80">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-balance">Why Quiflix</h2>
              <p className="text-lg text-[#e8e8e8]/70 max-w-2xl mx-auto font-light">
                Everything you need to distribute globally and earn instantly in cryptocurrency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-[#d4af37]/10 to-[#b38728]/5 border border-[#d4af37]/20 backdrop-blur-md rounded-xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/10 hover:-translate-y-2 animate-slideUp group" style={{ animationDelay: '0.1s' }}>
                <Globe className="h-12 w-12 text-[#d4af37] mb-4 animate-float group-hover:animate-glow" />
                <h3 className="text-2xl font-bold mb-3 text-[#e8e8e8]">Global Network</h3>
                <p className="text-[#e8e8e8]/70 font-light">Access distributors and platforms in 100+ countries instantly</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-[#d4af37]/10 to-[#b38728]/5 border border-[#d4af37]/20 backdrop-blur-md rounded-xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/10 hover:-translate-y-2 animate-slideUp group" style={{ animationDelay: '0.2s' }}>
                <TrendingUp className="h-12 w-12 text-[#d4af37] mb-4 animate-float group-hover:animate-glow" style={{ animationDelay: '0.5s' }} />
                <h3 className="text-2xl font-bold mb-3 text-[#e8e8e8]">Live Earnings</h3>
                <p className="text-[#e8e8e8]/70 font-light">Watch your balance grow in USDC/USDT, withdraw anytime</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-[#d4af37]/10 to-[#b38728]/5 border border-[#d4af37]/20 backdrop-blur-md rounded-xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/10 hover:-translate-y-2 animate-slideUp group" style={{ animationDelay: '0.3s' }}>
                <Zap className="h-12 w-12 text-[#d4af37] mb-4 animate-pulse-glow group-hover:animate-glow" />
                <h3 className="text-2xl font-bold mb-3 text-[#e8e8e8]">Instant Setup</h3>
                <p className="text-[#e8e8e8]/70 font-light">Create wallet, upload film, start earning in minutes</p>
              </div>
            </div>
          </div>
        </section>



        {/* Stats Section */}
        <section className="py-24 border-b border-[#d4af37]/10 bg-gradient-to-b from-[#0a0a0a]/80 to-[#0a0a0a]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Active Filmmakers', value: '500+', delay: '0s' },
                { label: 'Films Distributed', value: '2M+', delay: '0.1s' },
                { label: 'Crypto Payments', value: '100%', delay: '0.2s' },
                { label: 'Instant Payout', value: '24hrs', delay: '0.3s' },
              ].map((stat) => (
                <div key={stat.label} className="text-center animate-slideUp" style={{ animationDelay: stat.delay }}>
                  <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fcf6ba] mb-3 animate-glow" style={{ animationDelay: stat.delay }}>{stat.value}</p>
                  <p className="text-[#e8e8e8]/70 font-light">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent pointer-events-none" />
          <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-balance">Ready to Join?</h2>
            <p className="text-lg text-[#e8e8e8]/80 mb-12 font-light">
              Start distributing your films today. Get automatic wallet creation, instant earnings, and withdraw in local currency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#fcf6ba] hover:to-[#d4af37] text-black font-bold px-10 py-6 text-lg border-2 border-[#d4af37]/30 shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 transition-all duration-300">
                  Create Account & Wallet
                </Button>
              </Link>
              <Link href="/films">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent px-10 py-6 text-lg border-2 border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 transition-all duration-300">
                  Explore Films First
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#d4af37]/10 py-12 text-center text-[#e8e8e8]/50 text-sm bg-[#0a0a0a]">
        <p>© 2024 Quiflix. Distributed on the blockchain. All rights reserved.</p>
      </footer>
    </div>
  );
}
