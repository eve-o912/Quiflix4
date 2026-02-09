'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const supabase = createClient()

        // Supabase automatically handles the confirmation with the token from URL
        // We just need to check if the user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error('[v0] Email confirmation error:', userError.message)
          setError(userError.message || 'Failed to confirm email')
          setLoading(false)
          return
        }

        if (user) {
          console.log('[v0] Email confirmed successfully for:', user.email)
          // Redirect to protected route which handles role-based routing
          router.push('/protected')
        } else {
          setError('No user found. Please sign up again.')
          setLoading(false)
        }
      } catch (err) {
        console.error('[v0] Confirmation error:', err)
        setError('An error occurred during email confirmation')
        setLoading(false)
      }
    }

    handleEmailConfirmation()
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Email Confirmation Failed
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You can try to sign up again or reset your password.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/auth/sign-up')}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
              >
                Sign Up
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="flex-1 px-4 py-2 bg-card border border-border rounded-lg hover:bg-card/80 font-medium"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Confirming your email...
        </h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we verify your email address.
        </p>
      </div>
    </div>
  )
}
