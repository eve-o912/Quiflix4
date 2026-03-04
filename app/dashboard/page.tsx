'use client';

import { useState } from 'react';
import { WalletDashboard } from './components/wallet-dashboard';
import { FilmSelection } from './components/film-selection';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Film, 
  Wallet, 
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type DashboardView = 'overview' | 'films' | 'wallet';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400">Track your performance and manage your content</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  <Bell className="h-4 w-4 mr-2" />
                  <Badge className="bg-red-500 text-white text-xs">3</Badge>
                </Button>
              </div>
            </div>
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">$225.50</p>
                    <p className="text-xs text-green-400">+23.5% this month</p>
                  </div>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Wallet className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-white">$45.00</p>
                    <p className="text-xs text-yellow-400">Processing</p>
                  </div>
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Bell className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Your Films</p>
                    <p className="text-2xl font-bold text-white">3</p>
                    <p className="text-xs text-blue-400">Active</p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Film className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Distributors</p>
                    <p className="text-2xl font-bold text-white">12</p>
                    <p className="text-xs text-green-400">Active</p>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <LayoutDashboard className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-full">
                        <Wallet className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Film: The African Dream</p>
                        <p className="text-sm text-slate-400">Sales revenue received</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">+150.00 USDC</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-full">
                        <Film className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">New Distributor</p>
                        <p className="text-sm text-slate-400">Applied for Nairobi Nights</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-semibold">Pending</p>
                      <p className="text-xs text-slate-500">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-full">
                        <Wallet className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Withdrawal</p>
                        <p className="text-sm text-slate-400">To M-Pesa</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-semibold">-50.00 USDC</p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setCurrentView('films')}
                    className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <Film className="h-4 w-4 mr-3" />
                    Browse Available Films
                    <Badge className="ml-auto bg-purple-500 text-white">6</Badge>
                  </Button>

                  <Button 
                    onClick={() => setCurrentView('wallet')}
                    className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <Wallet className="h-4 w-4 mr-3" />
                    Withdraw Earnings
                    <span className="ml-auto text-green-400">$225.50</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Account Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'films':
        return <FilmSelection />;
      
      case 'wallet':
        return <WalletDashboard />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Quiflix</span>
          </div>

          <nav className="space-y-2">
            <Button
              onClick={() => setCurrentView('overview')}
              variant={currentView === 'overview' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === 'overview' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 mr-3" />
              Overview
            </Button>

            <Button
              onClick={() => setCurrentView('films')}
              variant={currentView === 'films' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === 'films' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Film className="h-4 w-4 mr-3" />
              Browse Films
              <Badge className="ml-auto bg-purple-500 text-white text-xs">6</Badge>
            </Button>

            <Button
              onClick={() => setCurrentView('wallet')}
              variant={currentView === 'wallet' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === 'wallet' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wallet className="h-4 w-4 mr-3" />
              Wallet
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-slate-400 truncate">Filmmaker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Quiflix</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 p-4 space-y-2">
            <Button
              onClick={() => {
                setCurrentView('overview');
                setMobileMenuOpen(false);
              }}
              variant={currentView === 'overview' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === 'overview' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 mr-3" />
              Overview
            </Button>

            <Button
              onClick={() => {
                setCurrentView('films');
                setMobileMenuOpen(false);
              }}
              variant={currentView === 'films' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === 'films' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Film className="h-4 w-4 mr-3" />
              Browse Films
            </Button>

            <Button
              onClick={() => {
                setCurrentView('wallet');
                setMobileMenuOpen(false);
              }}
              variant={currentView === 'wallet' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === 'wallet' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wallet className="h-4 w-4 mr-3" />
              Wallet
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <main className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
