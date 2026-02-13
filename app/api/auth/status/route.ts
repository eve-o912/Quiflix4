import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return Response.json(
        {
          authenticated: false,
          user: null,
          error: error?.message || 'Not authenticated'
        },
        { status: 401 }
      )
    }

    return Response.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          user_type: user.user_metadata?.user_type || null,
          created_at: user.created_at,
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Auth status error:', error)
    return Response.json(
      { error: 'Failed to check auth status' },
      { status: 500 }
    )
  }
}
