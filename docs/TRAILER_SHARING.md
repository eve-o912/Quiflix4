# Trailer Sharing Workflow for Distributors

## Overview
When a distributor is approved on Quiflix, they automatically receive:
1. **Personalized distribution link** - Their unique referral URL
2. **Film trailer (download)** - Ready-to-share video file
3. **Social sharing tools** - One-click sharing buttons

## Email Approval Flow

### Step 1: Distributor Application Approved
When admin clicks "Approve + Assign DDT" for a distributor:
- Distributor status updated to `approved`
- DDT token assigned on Base smart contract
- Film details fetched including trailer URL

### Step 2: Automated Approval Email Sent
The approval email includes:
- **Congratulations message** with company name
- **Download trailer button** - Direct download link to MP4
- **Personalized distribution link** - Unique referral URL
- **Referral code** for tracking
- **Social media tips** for maximum reach
- **Pro tips** section with earning strategies

### Step 3: Distributor Downloads & Shares
Distributors can:
- Download the trailer in MP4 format
- Post on Instagram, TikTok, YouTube, Facebook, etc.
- Include their personalized link in captions
- Earn 20% on every purchase made through their link

## Trailer Assets Page

**URL:** `/distributor-dashboard/assets`

Features:
- View all assigned films and trailers
- One-click download button for each trailer
- Copy personalized distribution link
- Social media quick-share buttons
- Marketing tips and best practices
- File size information (e.g., MP4, 45MB)

## Sales Attribution Flow

When viewer purchases through distributor's link:

```
Distributor shares link on Instagram
    ↓
Viewer clicks link → Lands on /distributor/[id]/[filmId]
    ↓
Viewer watches trailer on page
    ↓
Viewer clicks "Buy Now" button
    ↓
System records sale attribution to DDT
    ↓
Smart contract splits revenue:
   - 70% → Filmmaker wallet
   - 20% → Distributor wallet  
   - 10% → Goodflix wallet
```

## Email Template Structure

### Approval Email for Distributors

```
Subject: Congratulations! Your Distributor Application is Approved

Content:
├── Welcome Message
├── Trailer Download Section
│   ├── Download button
│   ├── Direct link
│   └── Social media tips
├── Personalized Link Section
│   ├── Distribution URL
│   ├── Referral code
│   └── Earnings explanation
├── What You've Earned
│   ├── 1 DDT for film
│   ├── 20% commission structure
│   ├── Real-time dashboard
│   └── Trailer for promotion
├── Getting Started Steps
│   ├── Download & Share
│   ├── Promote Link
│   ├── Track Earnings
│   └── Get Paid
└── Pro Tips Section
```

## Trailer Hosting

### Filmmaker Uploads
- Filmmakers upload trailer to `/api/upload-trailer`
- Stored on Vercel Blob (CDN-optimized)
- URL stored in `films.trailer_url` database field

### Distribution to Distributors
1. When approved, trailer URL fetched from `films` table
2. URL passed to approval email template
3. Direct download link provided to distributor
4. Same URL embedded in distributor film page for preview

## File Specifications

### Trailer Format
- Format: MP4 (H.264 video codec)
- Resolution: 1080p minimum
- Duration: 2-5 minutes recommended
- File size: 30-50MB typical
- Bitrate: 5-8 Mbps

### Filmmaker Dashboard
Filmmakers can:
- Upload new trailers
- Update trailer for a film
- View all approved films
- Download their own trailer copy
- See trailer analytics (views from distributors)

## Database Schema

### Films Table
```sql
films {
  id uuid
  title text
  trailer_url text
  film_hosted_link text
  price_usd numeric
  approved boolean
}
```

### DDT Holdings Table
```sql
ddt_holdings {
  distributor_id
  film_id
  personalized_link text
  ddt_balance integer
}
```

## Integration Points

### Admin Approval API
`/api/admin/approve-and-mint-ddt`
- Fetches film.trailer_url
- Passes to email service

### Email Service
`/api/admin/send-approval-email`
- Receives trailerUrl parameter
- Renders download button
- Includes social sharing tips

### Distributor Assets Page
`/distributor-dashboard/assets`
- Fetches films assigned to distributor
- Shows trailer download links
- Provides social sharing buttons

## Analytics Tracking

Future enhancements:
- Track trailer downloads per distributor
- Measure social shares
- Correlate views with sales
- Attribution dashboard showing which platforms drive most sales

## Troubleshooting

### Trailer Not Appearing in Email
- Check `films.trailer_url` is populated
- Verify URL is publicly accessible
- Test direct link in browser

### Download Not Working
- Check file exists on Vercel Blob
- Verify CDN is accessible
- Test link directly in browser

### Distributor Can't Find Assets Page
- Ensure distributor is logged in
- Check user permissions in dashboard
- Verify films are assigned to distributor
-- Create the table
create table notes (
  id bigint primary key generated always as identity,
  title text not null
);

-- Insert some sample data into the table
insert into notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');

alter table notes enable row level security;
create policy "public can read notes"
on public.notes
for select to anon
using (true);