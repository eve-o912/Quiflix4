import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await req.json();
    const { status, rejection_reason, admin_notes } = body;

    // Validate status
    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the application first
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    };

    if (admin_notes) {
      updateData.admin_notes = admin_notes;
    }

    if (rejection_reason && status === 'rejected') {
      updateData.rejection_reason = rejection_reason;
    }

    // Update application
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', params.id)
      .select();

    if (error) {
      console.error('[v0] Supabase error:', error);
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // If approved, update user metadata with the role
    if (status === 'approved') {
      const { error: updateUserError } = await supabase.auth.admin.updateUserById(
        application.user_id,
        {
          user_metadata: {
            user_type: application.application_type,
            application_approved_at: new Date().toISOString(),
          },
        }
      );

      if (updateUserError) {
        console.error('[v0] Error updating user metadata:', updateUserError);
        // Don't fail the response, just log it
      } else {
        console.log('[v0] User role set to:', application.application_type);
      }
    }

    console.log('[v0] Application updated:', {
      id: params.id,
      status,
      application_type: application.application_type,
      user_id: application.user_id,
    });

    return Response.json(
      {
        success: true,
        message: `Application ${status}`,
        data: data[0],
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the application
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if user owns this application or is admin
    if (data.user_id !== user.id) {
      return Response.json(
        { error: 'Forbidden' },
        { status: 403 }
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
