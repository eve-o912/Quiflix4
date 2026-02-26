'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/wallet-context';
import { Film, Users, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface FilmmakerApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  filmTitle: string;
  filmDescription: string;
  genre: string;
  durationMinutes: string;
  language: string;
  releaseYear: string;
  filmPosterUrl: string;
  filmTrailerUrl: string;
  budgetUsd: string;
  filmHostedLink: string;
  filmHostedProvider: string;
  priceUsd: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  walletAddress?: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, user } = useWallet();
  const [applications, setApplications] = useState<FilmmakerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockApplications: FilmmakerApplication[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        country: 'United States',
        filmTitle: 'The Digital Revolution',
        filmDescription: 'A documentary about the impact of technology on society.',
        genre: 'Documentary',
        durationMinutes: '90',
        language: 'English',
        releaseYear: '2024',
        filmPosterUrl: 'https://example.com/poster.jpg',
        filmTrailerUrl: 'https://example.com/trailer.mp4',
        budgetUsd: '50000',
        filmHostedLink: 'https://drive.google.com/file/d/123',
        filmHostedProvider: 'google_drive',
        priceUsd: '9.99',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        country: 'United Kingdom',
        filmTitle: 'Midnight in London',
        filmDescription: 'A romantic drama set in the heart of London.',
        genre: 'Romance',
        durationMinutes: '120',
        language: 'English',
        releaseYear: '2023',
        filmPosterUrl: 'https://example.com/poster2.jpg',
        filmTrailerUrl: 'https://example.com/trailer2.mp4',
        budgetUsd: '75000',
        filmHostedLink: 'https://www.dropbox.com/s/123',
        filmHostedProvider: 'dropbox',
        priceUsd: '12.99',
        status: 'pending',
        submittedAt: '2024-01-14T15:45:00Z',
      },
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = async (applicationId: string) => {
    setActionLoading(applicationId);
    try {
      // Here you would:
      // 1. Create embedded wallet for the filmmaker
      // 2. Register film on-chain
      // 3. Mint 500 DDTs
      // 4. Update application status in database
      
      console.log(`Approving application ${applicationId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'approved', walletAddress: '0x1234...5678' }
            : app
        )
      );
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    setActionLoading(applicationId);
    try {
      // Update application status in database
      console.log(`Rejecting application ${applicationId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'rejected' }
            : app
        )
      );
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
            <p className="text-muted-foreground">
              You need to authenticate as an admin to access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'approved');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Review filmmaker applications and manage film approvals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Film className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{approvedApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Approved Films</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{approvedApplications.length * 500}</p>
                  <p className="text-sm text-muted-foreground">DDTs Minted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Applications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Applications ({pendingApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApplications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending applications at the moment.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Film Title</TableHead>
                    <TableHead>Filmmaker</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.filmTitle}</TableCell>
                      <TableCell>{app.firstName} {app.lastName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{app.genre}</Badge>
                      </TableCell>
                      <TableCell>{app.durationMinutes} min</TableCell>
                      <TableCell>${app.priceUsd}</TableCell>
                      <TableCell>
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(app.id)}
                            disabled={actionLoading === app.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === app.id ? (
                              'Processing...'
                            ) : (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(app.id)}
                            disabled={actionLoading === app.id}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Approved Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Approved Films ({approvedApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvedApplications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No films have been approved yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Film Title</TableHead>
                    <TableHead>Filmmaker</TableHead>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>DDTs Minted</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.filmTitle}</TableCell>
                      <TableCell>{app.firstName} {app.lastName}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {app.walletAddress || 'Processing...'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">500 DDTs</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">On-Chain</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
