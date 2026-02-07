'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function ProtectedPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [settingRole, setSettingRole] = useState(false)

  useEffect(() => {
    const redirectToAppropriateRoute = async () => {
      const supabase = createClient()
      
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          // No user, redirect to login
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Check user type from metadata
        const userType = user.user_metadata?.user_type

        console.log('[v0] User authenticated:', user.email, 'Type:', userType)

        // Redirect based on user type
        if (userType === 'filmmaker') {
          router.push('/filmmaker-dashboard')
        } else if (userType === 'distributor') {
          router.push('/distributor-dashboard')
        } else if (userType === 'buyer') {
          router.push('/dashboard')
        } else {
          // No user type set yet, show role selection UI
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
    setSettingRole(true)
    try {
      const supabase = createClient()

      // Update user metadata with the selected role
      const { error } = await supabase.auth.updateUser({
        data: { user_type: role }
      })

      if (error) {
        console.error('[v0] Error updating user metadata:', error)
        alert('Error setting role. Please try again.')
        setSettingRole(false)
        return
      }

      console.log('[v0] User role set to:', role)

      // Redirect to appropriate dashboard
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
      setSettingRole(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground mb-2">Loading...</p>
          <p className="text-sm text-muted-foreground">Please wait.</p>
        </div>
      </div>
    )
  }

  if (showRoleSelection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md bg-card border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Quiflix</h1>
            <p className="text-muted-foreground">
              {user?.email}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Choose your role to continue
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleRoleSelection('filmmaker')}
              disabled={settingRole}
              className="w-full gap-2 py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {settingRole ? 'Setting up...' : 'Continue as Filmmaker'}
            </Button>

            <Button
              onClick={() => handleRoleSelection('distributor')}
              disabled={settingRole}
              variant="outline"
              className="w-full gap-2 py-6 text-base bg-transparent border-border hover:bg-card"
            >
              {settingRole ? 'Setting up...' : 'Continue as Distributor'}
            </Button>

            <Button
              onClick={() => handleRoleSelection('buyer')}
              disabled={settingRole}
              variant="outline"
              className="w-full gap-2 py-6 text-base bg-transparent border-border hover:bg-card"
            >
              {settingRole ? 'Setting up...' : 'Continue as Buyer'}
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Want to change roles later?{' '}
              <Link href="/" className="text-primary hover:underline">
                Go to home
              </Link>
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-foreground mb-2">Redirecting you to your dashboard...</p>
        <p className="text-sm text-muted-foreground">Please wait.</p>
      </div>
    </div>
  )
}
