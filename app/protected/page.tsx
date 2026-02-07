'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Spinner component
function Spinner() {
  return (
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  )
}

const roleOptions = [
  {
    id: 'filmmaker',
    title: 'Filmmaker',
    description: 'Share your films and earn from distributors and buyers',
    icon: '🎬',
    color: 'from-red-600 to-red-500',
  },
  {
    id: 'distributor',
    title: 'Distributor',
    description: 'Find and license films for your platforms',
    icon: '📽️',
    color: 'from-orange-600 to-orange-500',
  },
  {
    id: 'buyer',
    title: 'Film Enthusiast',
    description: 'Buy and track your favorite films',
    icon: '🎥',
    color: 'from-amber-600 to-amber-500',
  },
]

export default function ProtectedPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [settingRole, setSettingRole] = useState<string | null>(null)

  useEffect(() => {
    const redirectToAppropriateRoute = async () => {
      const supabase = createClient()
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push('/auth/login')
          return
        }

        setUser(user)
        const userType = user.user_metadata?.user_type

        if (userType === 'filmmaker') {
          router.push('/filmmaker-dashboard')
        } else if (userType === 'distributor') {
          router.push('/distributor-dashboard')
        } else if (userType === 'buyer') {
          router.push('/dashboard')
        } else {
          setShowRoleSelection(true)
        }
      } catch (error) {
        console.error('[v0] Error during redirect:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    redirectToAppropriateRoute()
  }, [router])

  const handleRoleSelection = async (role: 'filmmaker' | 'distributor' | 'buyer') => {
    setSettingRole(role)
    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        data: { user_type: role }
      })

      if (error) {
        console.error('[v0] Error updating user metadata:', error)
        alert('Error setting role. Please try again.')
        setSettingRole(null)
        return
      }

      if (role === 'filmmaker') {
        router.push('/filmmaker-dashboard')
      } else if (role === 'distributor') {
        router.push('/distributor-dashboard')
      } else if (role === 'buyer') {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('[v0] Error:', error)
      alert('Error setting role. Please try again.')
      setSettingRole(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 text-primary">
            <Spinner />
          </div>
          <p className="text-foreground mb-2 font-medium">Loading your profile...</p>
          <p className="text-sm text-muted-foreground">Just a moment.</p>
        </div>
      </div>
    )
  }

  if (showRoleSelection) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-40" />
        
        {/* Content */}
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl">
            <div className="inline-block mb-6">
              <span className="text-5xl">🎬</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Quiflix</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              The premium platform for filmmakers and film lovers
            </p>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{user?.email}</span>
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="w-full max-w-5xl">
            <h2 className="text-xl font-semibold text-foreground mb-8 text-center">
              What describes you best?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {roleOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleRoleSelection(option.id as 'filmmaker' | 'distributor' | 'buyer')}
                  disabled={settingRole !== null}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  
                  <div className="relative h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden">
                    {/* Background gradient accent */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-300`} />
                    
                    <div className="relative">
                      <div className="text-5xl mb-4">{option.icon}</div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {option.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-6 min-h-10 text-left">
                        {option.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {settingRole === option.id ? 'Setting up...' : 'Get started'}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {settingRole === option.id ? (
                            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent text-primary" />
                          ) : (
                            <span className="text-primary">→</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Loading state overlay */}
                    {settingRole === option.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Help Section */}
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-sm text-muted-foreground">
                  Not sure? You can change your role anytime
                </p>
                <Link href="/" className="text-xs text-primary hover:underline font-medium">
                  Learn more about Quiflix
                </Link>
              </div>
            </div>
          </div>

          {/* Footer accent */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none blur-3xl -z-10" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 text-primary">
          <Spinner />
        </div>
        <p className="text-foreground mb-2 font-medium">Redirecting...</p>
        <p className="text-sm text-muted-foreground">Taking you to your dashboard.</p>
      </div>
    </div>
  )
}
