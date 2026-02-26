'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp,
  Shield,
  Zap,
  ChevronDown,
  Wallet,
  Film,
  Globe
} from 'lucide-react';

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      title: "Distribute Your Films Globally",
      subtitle: "Blockchain-powered film distribution with instant revenue sharing",
      description: "Connect with filmmakers worldwide and distribute content seamlessly while earning transparent revenue through smart contracts.",
      cta: "Get Started"
    },
    {
      title: "Earn with Digital Distribution Tokens",
      subtitle: "500 DDTs per film - Your gateway to exclusive content",
      description: "Receive Digital Distribution Tokens for approved films and earn revenue through personalized distribution links.",
      cta: "Become a Distributor"
    },
    {
      title: "Fair Revenue Distribution",
      subtitle: "70/20/10 split - Filmmakers First",
      description: "Automated revenue distribution ensures filmmakers get 70%, distributors 20%, and platform 10% of every sale.",
      cta: "Learn More"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className={`space-y-8 transition-all duration-700 transform ${
            isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                <Zap className="h-3 w-3 mr-1" />
                Powered by Blockchain
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                <Shield className="h-3 w-3 mr-1" />
                USDC Payments
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {currentSlideData.title}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-purple-200 mb-8 leading-relaxed">
              {currentSlideData.subtitle}
            </p>
            
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
              {currentSlideData.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25 px-8 py-4 text-lg font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                {currentSlideData.cta}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg"
              >
                <Film className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-800">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm text-slate-400">Active Users</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">$2.5M+</div>
                <div className="text-sm text-slate-400">Revenue Distributed</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Globe className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-slate-400">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className={`relative transition-all duration-700 delay-300 transform ${
            isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            
            {/* Main Visual */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                
                {/* Card */}
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                      <Wallet className="h-12 w-12" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white text-center mb-4">
                    Smart Wallet Integration
                  </h3>
                  
                  {/* Features */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span className="text-slate-300">Secure embedded wallets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <span className="text-slate-300">Instant blockchain transactions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-300">Real-time revenue tracking</span>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                    Connect Wallet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4">
                <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4">
                <div className="p-2 bg-pink-500/20 rounded-lg backdrop-blur-sm border border-pink-500/30">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 w-8' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-slate-400 animate-bounce">
            <ChevronDown className="h-6 w-6" />
            <span className="text-sm">Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  );
}
