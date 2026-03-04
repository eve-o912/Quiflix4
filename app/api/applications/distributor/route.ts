import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary in-memory storage until database tables are created
const applications: any[] = [];

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    const application = {
      id: Math.random().toString(36).substring(7),
      ...formData,
      status: 'pending',
      ddt_tokens: 0,
      created_at: new Date().toISOString(),
    };

    applications.push(application);

    // Send email notification to Quiflix@proton.me
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Quiflix Applications <applications@quiflix.com>',
          to: 'Quiflix@proton.me',
          subject: `New Distributor Application: ${formData.firstName} ${formData.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6366f1; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                New Distributor Application
              </h2>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Applicant Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 140px;">Name:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 500;">
                      ${formData.firstName} ${formData.lastName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                    <td style="padding: 8px 0; color: #111827;">
                      <a href="mailto:${formData.email}" style="color: #6366f1;">${formData.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                    <td style="padding: 8px 0; color: #111827;">${formData.phone || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Country:</td>
                    <td style="padding: 8px 0; color: #111827;">${formData.country}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Company Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 140px;">Company:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 500;">
                      ${formData.companyName || 'Not provided'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Website:</td>
                    <td style="padding: 8px 0; color: #111827;">
                      ${formData.companyWebsite ? `<a href="${formData.companyWebsite}" style="color: #6366f1;">${formData.companyWebsite}</a>` : 'Not provided'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Social Media:</td>
                    <td style="padding: 8px 0; color: #111827;">${formData.socialMedia || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Followers:</td>
                    <td style="padding: 8px 0; color: #111827;">${formData.followerCount || 'Not provided'}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Film Application Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 140px;">Film Title:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 500;">
                      ${formData.filmTitle || 'General Application'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Wallet Address:</td>
                    <td style="padding: 8px 0; color: #111827; font-family: monospace;">
                      ${formData.walletAddress || 'Not connected'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Experience:</td>
                    <td style="padding: 8px 0; color: #111827;">${formData.experience || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Why Film:</td>
                    <td style="padding: 8px 0; color: #111827;">${formData.whyThisFilm || 'Not provided'}</td>
                  </tr>
                </table>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #6b7280; font-size: 12px;">
                  Application ID: ${application.id}<br>
                  Submitted: ${new Date().toLocaleString()}<br>
                  Status: Pending Review
                </p>
              </div>
            </div>
          `,
        });
        console.log('[Quiflix] Email sent to Quiflix@proton.me');
      } else {
        console.warn('[Quiflix] RESEND_API_KEY not set - email not sent');
      }
    } catch (emailError) {
      console.error('[Quiflix] Email sending failed:', emailError);
      // Don't fail the request if email fails - we still saved the application
    }

    return Response.json(
      {
        success: true,
        message: 'Application submitted successfully! We will review your application and send you an email within 48 hours.',
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Quiflix] Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    {
      applications,
      message: 'Note: This is temporary in-memory storage. Set up the Supabase database tables for persistent storage.',
    },
    { status: 200 }
  );
}
