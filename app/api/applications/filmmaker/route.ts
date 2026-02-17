import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
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

    const formData = await req.json();

    // Insert application into database
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        application_type: 'filmmaker',
        status: 'pending',
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        film_title: formData.filmTitle,
        film_genre: formData.filmGenre,
        film_duration: formData.filmDuration,
        film_description: formData.filmDescription,
        film_language: formData.filmLanguage,
        film_country: formData.filmCountry,
        film_release_date: formData.filmReleaseDate,
        film_url: formData.filmUrl,
        website: formData.website,
        bio: formData.bio,
      })
      .select();

    if (error) {
      console.error('[v0] Supabase error:', error);
      return Response.json(
        { error: error.message || 'Failed to submit application' },
        { status: 400 }
      );
    }

    console.log('[v0] Filmmaker application submitted:', {
      id: data[0]?.id,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      filmTitle: formData.filmTitle,
    });

    return Response.json(
      {
        success: true,
        message: 'Application submitted successfully! We will review your application and send you an email within 48 hours.',
        data: data[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's filmmaker applications
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .eq('application_type', 'filmmaker')
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        data,
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
