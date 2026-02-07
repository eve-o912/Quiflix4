# API Implementation Guide for Phase 2.5

This guide details all APIs needed to complete Phase 2.5 and make the dashboard workflow fully functional.

---

## Priority 1: Database Setup (FIRST)

### Create Applications Table

```sql
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_type VARCHAR(20) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  country VARCHAR(100),
  bio TEXT,
  form_data JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT valid_type CHECK (application_type IN ('filmmaker', 'distributor', 'buyer'))
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_type ON applications(application_type);

-- Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own applications
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

-- Only authenticated users can insert
CREATE POLICY "Users can create their own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can view all (for admin)
CREATE POLICY "Service role can view all applications"
  ON applications FOR SELECT
  USING (auth.uid() = (SELECT auth.uid() WHERE is_admin = true));
```

### Create Admin Users Table

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE POLICY "Only admins can view admin table"
  ON admin_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_admin = true));
```

---

## Priority 2: Update Application APIs

### 1. Update Filmmaker Application API

**File:** `/app/api/applications/filmmaker/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
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
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        country: formData.country,
        bio: formData.bio,
        form_data: formData,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Database error:', error);
      return Response.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    // Send notification email to admin
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/send-application-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationType: 'filmmaker',
          applicantName: `${formData.firstName} ${formData.lastName}`,
          applicantEmail: formData.email,
          country: formData.country,
        }),
      });
    } catch (emailError) {
      console.error('[v0] Email notification failed:', emailError);
      // Don't fail the request if email fails
    }

    return Response.json(
      {
        success: true,
        message: 'Application submitted successfully! We will review your application and get back to you within 48 hours.',
        data,
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

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's applications
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .eq('application_type', 'filmmaker')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[v0] Database error:', error);
      return Response.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return Response.json({ applications: data }, { status: 200 });
  } catch (error) {
    console.error('[v0] Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Update Distributor Application API

**File:** `/app/api/applications/distributor/route.ts`

Same pattern as filmmaker, just change:
- `application_type: 'distributor'`
- Add fields: `company_name` instead of `bio`

---

## Priority 3: Create Admin Approval APIs

### 1. Get Applications (Admin Only)

**File:** `/app/api/admin/applications/route.ts` (NEW)

```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData?.is_admin) {
      return Response.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Get all pending applications
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[v0] Database error:', error);
      return Response.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return Response.json({ applications: data }, { status: 200 });
  } catch (error) {
    console.error('[v0] Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Approve/Reject Application

**File:** `/app/api/admin/applications/:id/route.ts` (NEW)

```typescript
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin permission
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData?.is_admin) {
      return Response.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { action, reason } = await req.json();
    
    if (!['approve', 'reject'].includes(action)) {
      return Response.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get application
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

    if (action === 'approve') {
      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (updateError) {
        console.error('[v0] Update error:', updateError);
        return Response.json(
          { error: 'Failed to update application' },
          { status: 500 }
        );
      }

      // Update user metadata with role
      const { error: authError } = await supabase.auth.admin.updateUserById(
        application.user_id,
        {
          user_metadata: {
            user_type: application.application_type,
            approved_at: new Date().toISOString(),
          },
        }
      );

      if (authError) {
        console.error('[v0] Auth update error:', authError);
        return Response.json(
          { error: 'Failed to update user role' },
          { status: 500 }
        );
      }

      // Send approval email
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/send-approval-email`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: application.email,
              applicationType: application.application_type,
              approvedAt: new Date().toISOString(),
            }),
          }
        );
      } catch (emailError) {
        console.error('[v0] Email failed:', emailError);
      }

      return Response.json(
        {
          success: true,
          message: 'Application approved',
          data: { applicationId: params.id },
        },
        { status: 200 }
      );
    } else {
      // Reject application
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason || 'No reason provided',
        })
        .eq('id', params.id);

      if (updateError) {
        return Response.json(
          { error: 'Failed to reject application' },
          { status: 500 }
        );
      }

      // Send rejection email
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/send-rejection-email`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: application.email,
              reason: reason || 'Your application did not meet our requirements',
            }),
          }
        );
      } catch (emailError) {
        console.error('[v0] Email failed:', emailError);
      }

      return Response.json(
        {
          success: true,
          message: 'Application rejected',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('[v0] Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Priority 4: Email Notifications

### Setup Email Service

**File:** `/lib/email/service.ts` (NEW)

Choose one:

#### Option A: Resend (Recommended for Next.js)
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(
  email: string,
  applicationType: string
) {
  try {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/protected`;
    
    await resend.emails.send({
      from: 'Quiflix <noreply@quiflix.com>',
      to: email,
      subject: 'Your Quiflix Application Has Been Approved! 🎉',
      html: `
        <h2>Welcome to Quiflix!</h2>
        <p>Great news! Your application as a ${applicationType} has been approved.</p>
        <p><a href="${dashboardUrl}">Go to your dashboard →</a></p>
      `,
    });
  } catch (error) {
    console.error('[v0] Email error:', error);
    throw error;
  }
}
```

#### Option B: SendGrid
```bash
npm install @sendgrid/mail
```

---

## Summary

### Files to Create:
1. ✅ Applications table (SQL)
2. ✅ Admin users table (SQL)
3. `/app/api/applications/filmmaker/route.ts` - UPDATE
4. `/app/api/applications/distributor/route.ts` - UPDATE
5. `/app/api/admin/applications/route.ts` - CREATE
6. `/app/api/admin/applications/[id]/route.ts` - CREATE
7. `/lib/email/service.ts` - CREATE
8. `/app/api/admin/send-approval-email/route.ts` - UPDATE

### Time Estimate:
- Database setup: 20 min
- API updates: 1.5 hours
- Email setup: 30 min
- Testing: 1 hour
- **Total: ~3 hours**

---

All code is ready to implement!
