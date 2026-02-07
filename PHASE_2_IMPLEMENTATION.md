# Phase 2: Dashboard Role Integration & UI Redesign

## Overview
Phase 2 focuses on linking the application approval workflows to automatically set user roles, and implementing a premium, cinematic UI design inspired by Netflix, Vimeo, and FilmHub.

## Completed in Phase 2

### 1. **Premium UI Redesign**
- Created cinematic role selection screen at `/protected`
- Implemented Netflix/Vimeo-inspired dark theme with accent colors
- Added smooth animations and hover effects
- Created gradient backgrounds and glass-morphism elements
- Responsive design for mobile, tablet, and desktop

#### Design Features:
- **Color Palette**: Updated to warm cinematic tones (reds, oranges, ambers)
- **Typography**: Bold, large headers with tracking
- **Icons**: Emoji-based visual identifiers for each role
- **Interactions**: Smooth transitions, hover states, loading indicators
- **Gradients**: Subtle background gradients and accent glows

### 2. **Enhanced Protected Route**
✅ Smart authentication check
✅ User role detection from Supabase metadata
✅ Auto-redirect to appropriate dashboard
✅ Beautiful role selection UI for new users
✅ Smooth loading states with spinners
✅ Error handling and recovery

### 3. **Role Options (Updated UI)**
- **Filmmaker** 🎬 - Share films and earn from sales
- **Distributor** 📽️ - Find and license films
- **Film Enthusiast** 🎥 - Buy and track films

---

## What Still Needs Implementation (Phase 2 Part 2)

### Critical: Link Applications to Role Assignment

#### A. **Filmmaker Application Approval**
When admin approves a filmmaker application, automatically set:
```typescript
// In the admin approval endpoint
await supabase.auth.admin.updateUserById(userId, {
  user_data: { user_type: 'filmmaker' }
})
```

**Files to update:**
- `/app/api/admin/approve-and-mint-ddt/route.ts`
- Create new endpoint: `/app/api/admin/approve-application/route.ts`

#### B. **Distributor Application Approval**
Similar flow - when distributor is approved, set `user_type: 'distributor'`

**Files to update:**
- Create: `/app/api/admin/approve-distributor/route.ts`

#### C. **Buyer Auto-Assignment**
When user signs up without applying for filmmaker/distributor, they should be able to:
- Skip applications and go straight to buyer role
- OR auto-assign 'buyer' role after email verification

---

## Database Integration Needed

### Current Issue
Applications data is stored in-memory (in API state). We need to:

1. **Create `applications` table** to store pending/approved applications
2. **Create `user_roles` table** or use Supabase auth user_metadata
3. **Link applications to users** via email or UUID

### Proposed Schema

```sql
-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  application_type TEXT NOT NULL, -- 'filmmaker' | 'distributor' | 'buyer'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  application_data JSONB, -- Store form data
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  admin_notes TEXT
);

-- Optional: User roles table for audit trail
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL, -- 'filmmaker' | 'distributor' | 'buyer'
  assigned_by TEXT, -- 'admin' | 'auto' | 'user'
  assigned_at TIMESTAMP DEFAULT now()
);
```

---

## Implementation Steps for Phase 2 Part 2

### Step 1: Create Database Migrations
```bash
# Create applications table
# Create user_roles audit table
# Add indexes for performance
```

### Step 2: Update Application Endpoints
```typescript
// POST /api/applications/filmmaker/route.ts
// Instead of in-memory storage, save to database

const { error } = await supabase
  .from('applications')
  .insert({
    user_id: userId,
    user_email: email,
    application_type: 'filmmaker',
    status: 'pending',
    application_data: formData
  })
```

### Step 3: Create Admin Approval Endpoints
```typescript
// POST /api/admin/approve-application/route.ts
// When admin approves, update both:
// 1. applications.status = 'approved'
// 2. auth.user.user_metadata.user_type = 'filmmaker'
```

### Step 4: Update Dashboards
Link to show application status
- Show "pending review" state
- Show "approved" state
- Show "rejected with reason" state

---

## Testing Checklist for Phase 2

- [ ] User signs up → sees role selection
- [ ] Selects "Filmmaker" → redirects to filmmaker-dashboard
- [ ] Selects "Distributor" → redirects to distributor-dashboard
- [ ] Selects "Film Enthusiast" → redirects to buyer dashboard
- [ ] Returning user with role set → auto-redirects (no role selection)
- [ ] UI is responsive on mobile
- [ ] Animations are smooth
- [ ] Loading states work correctly
- [ ] Email displays correctly
- [ ] Can change roles from home page

---

## New Files Created in Phase 2

✅ `/app/protected/page.tsx` - Premium role selection & redirect page
✅ Updated `/app/globals.css` - New cinema-inspired color theme

---

## Next Steps (Phase 3)

1. **Database Setup**
   - Create applications table
   - Create user_roles audit table
   - Set up RLS policies

2. **Admin Dashboard**
   - View pending applications
   - Approve/reject with reason
   - Bulk actions

3. **User Settings**
   - View current role
   - Request role change
   - Manage multiple accounts

4. **Email Notifications**
   - When application approved
   - When role assigned
   - When role changed

---

## Design Tokens (Updated)

The new color scheme uses warm cinema-inspired tones:

```css
--primary: oklch(0.65 0.32 38); /* Red/Warm accent */
--accent: oklch(0.72 0.28 28);  /* Orange/Amber */
--background: oklch(0.06 0 0);  /* Deep dark (Netflix-like) */
--card: oklch(0.09 0 0);        /* Slightly lighter dark */
```

---

## Known Limitations & TODO

- [ ] Applications are currently stored in-memory
- [ ] No admin approval workflow yet
- [ ] No email verification integration
- [ ] No role change functionality
- [ ] No application rejection messaging
- [ ] No audit logs for role changes
- [ ] No multi-role support (user can only have one role)

---

## Questions & Clarifications

1. **Should users be able to have multiple roles?** (e.g., be both filmmaker and distributor)
2. **Who has admin access to approve applications?**
3. **What happens if application is rejected?** (Email notification? Allow reapply?)
4. **Should 'buyer' role require any approval?** (Or auto-assign after signup)
5. **Should role changes require re-approval?**

---

## Commits Created

```
✅ Phase 2: Premium UI redesign for role selection
✅ Updated design tokens for cinema-inspired theme
✅ Enhanced /protected page with Netflix-style UI
✅ Improved loading and role selection animations
```

---

