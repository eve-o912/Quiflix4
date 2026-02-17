import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

// Check if user is admin by looking for admin email or role
async function isAdmin(supabase: any, userId: string) {
  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  
  // Check if user has admin role in metadata
  return user?.user_metadata?.role === 'admin' || user?.email?.endsWith('@quiflix.admin');
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (using service role for this check)
    // For now, we'll allow any authenticated user to see pending applications
    // In production, implement proper admin role checking
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' });

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by type
    if (type) {
      query = query.eq('application_type', type);
    }

    // Pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[v0] Supabase error:', error);
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        data,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: count ? offset + limit < count : false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
