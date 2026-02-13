'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const supabase = createClient()

        // Get the token from the URL (Supabase passes it as #access_token in the fragment)
        // The Supabase client automatically handles token extraction
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        console.log('[v0] Email confirmation check:', {
          hasUser: !!user,
          userEmail: user?.email,
          emailConfirmed: user?.email_confirmed_at,
          error: userError?.message,
        })

        if (userError) {
          console.error('[v0] Email confirmation error:', userError.message)
          setError('Invalid confirmation link or link has expired. Please try signing up again.')
          setLoading(false)
          return
        }

        if (!user) {
          console.log('[v0] No authenticated user found')
          setError('No user found. The confirmation link may have expired.')
          setLoading(false)
          return
        }

        console.log('[v0] Email confirmed successfully for:', user.email)
        // Redirect to protected route after email confirmation
        setTimeout(() => {
          router.push('/protected')
        }, 1000)
      } catch (err) {
        console.error('[v0] Confirmation error:', err)
        setError('An error occurred during email confirmation')
        setLoading(false)
      }
    }

    // Add a small delay to ensure Supabase client is initialized
    const timer = setTimeout(handleEmailConfirmation, 100)
    return () => clearTimeout(timer)
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
