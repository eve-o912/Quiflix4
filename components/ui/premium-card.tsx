'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Star, 
  Users, 
  DollarSign, 
  PlayCircle,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface PremiumCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  stats?: Array<{
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  features?: string[];
  cta?: {
    text: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  gradient?: boolean;
  className?: string;
}

export function PremiumCard({
  title,
  description,
  icon,
  badge,
  badgeVariant = 'default',
  stats,
  features,
  cta,
  gradient = false,
  className = ''
}: PremiumCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${gradient ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-slate-900'} ${className}`}>
      {/* Gradient Overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-900/20 to-transparent opacity-50" />
      )}
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                {title}
              </CardTitle>
              {badge && (
                <Badge variant={badgeVariant} className="mt-1">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
          
          {cta && (
            <Button
              onClick={cta.action}
              variant={cta.variant || 'default'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg"
            >
              {cta.text}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative pt-4">
        <p className="text-slate-300 mb-6 leading-relaxed">
          {description}
        </p>
        
        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{stat.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-semibold">{stat.value}</span>
                    {stat.trend && (
                      <TrendingUp 
                        className={`h-4 w-4 ${
                          stat.trend === 'up' ? 'text-green-400' : 
                          stat.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                        }`} 
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Features */}
        {features && features.length > 0 && (
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      </div>
    </Card>
  );
}

// Premium Feature Card Component
export function PremiumFeatureCard({ 
  title, 
  description, 
  icon, 
  highlighted = false 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className={`relative p-6 rounded-xl border transition-all duration-300 ${
      highlighted 
        ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
    }`}>
      {highlighted && (
        <div className="absolute -inset-px bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl" />
      )}
      
      <div className="relative flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          highlighted 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
            : 'bg-slate-700 text-slate-300'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold mb-2 ${
            highlighted ? 'text-white' : 'text-slate-200'
          }`}>
            {title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {highlighted && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            Premium
          </Badge>
        </div>
      )}
    </div>
  );
}

// Premium Stats Component
export function PremiumStats({ 
  title, 
  value, 
  change, 
  changeType,
  icon 
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-300 font-medium">{title}</h3>
        {icon}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-white">{value}</div>
        
        {change && (
          <div className={`flex items-center gap-2 text-sm ${
            changeType === 'increase' ? 'text-green-400' : 
            changeType === 'decrease' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {changeType === 'increase' && <TrendingUp className="h-4 w-4" />}
            {changeType === 'decrease' && <TrendingUp className="h-4 w-4 rotate-180" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
