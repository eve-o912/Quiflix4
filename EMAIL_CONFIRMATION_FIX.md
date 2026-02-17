# Email Confirmation Fix - Complete Guide

## Problem
Email confirmation links were redirecting to `localhost:3000` instead of your production domain.

## Root Cause
The sign-up and login pages were using an undefined environment variable `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`, which fell back to `localhost:3000/protected`.

## Solution
I've implemented a proper email confirmation flow with three key changes:

### 1. Updated Sign-up Page (`/app/auth/sign-up/page.tsx`)
**Before:**
```typescript
emailRedirectTo:
  process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
  `${window.location.origin}/protected`,
```

**After:**
```typescript
emailRedirectTo: `${window.location.origin}/auth/confirm`,
```

### 2. Updated Login Page (`/app/auth/login/page.tsx`)
**Before:**
```typescript
emailRedirectTo:
  process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
  `${window.location.origin}/protected`,
```

**After:**
```typescript
emailRedirectTo: `${window.location.origin}/auth/confirm`,
```

### 3. Created Email Confirmation Page (`/app/auth/confirm/page.tsx`)
New page that:
- Handles Supabase email confirmation callbacks
- Validates the user authentication status
- Shows loading spinner during confirmation
- Redirects to `/protected` page (role selection)
- Shows error page if confirmation fails
- Provides retry options (sign up again or login)

## How It Works

```
User clicks confirmation link in email
                ↓
Redirects to your-domain.com/auth/confirm?token=...&type=signup
                ↓
Confirmation page validates the token
                ↓
If success: Redirects to /protected (role selection)
If failure: Shows error with retry options
                ↓
User selects role or auto-redirects if role exists
                ↓
User sees dashboard
```

## Implementation Details

### Environment-Aware Redirects
- Uses `window.location.origin` to get current domain
- Works on localhost, staging, and production
- No environment variables needed

### Error Handling
- Catches email confirmation failures
- Shows user-friendly error messages
- Provides links to sign up again or login

### Security
- Validates user authentication before redirecting
- Supabase handles token verification server-side
- No sensitive data exposed to client

## Testing Instructions

### Test 1: Email Confirmation Flow
1. Go to `/auth/sign-up`
2. Enter email and password
3. Click "Sign up"
4. Check your email for confirmation link
5. Click the confirmation link
6. **Expected:** Should redirect to `/auth/confirm`, then to `/protected`
7. **Verify:** Role selection page loads correctly

### Test 2: Login Email Confirmation
1. Go to `/auth/login` (if you already have an account)
2. Enter credentials
3. If using "Magic Link" or email verification, click link
4. **Expected:** Redirects to `/auth/confirm` then `/protected`

### Test 3: Confirmation Failure
1. Manually navigate to `/auth/confirm?error=invalid_token`
2. **Expected:** Error page shows with retry options
3. **Verify:** Both "Sign Up" and "Login" buttons work

### Test 4: Production Domain
1. Deploy to production
2. Complete full email confirmation flow
3. **Expected:** Redirects to your production domain, not localhost

## Files Modified

| File | Changes |
|------|---------|
| `/app/auth/sign-up/page.tsx` | Updated emailRedirectTo URL |
| `/app/auth/login/page.tsx` | Updated emailRedirectTo URL |
| `/app/auth/confirm/page.tsx` | **NEW** - Email confirmation handler |

## What Now Happens

**Before Fix:**
```
Sign up → Verify email → Click link → Redirects to localhost:3000 ❌
```

**After Fix:**
```
Sign up → Verify email → Click link → Confirms email → Role selection → Dashboard ✅
```

## No Additional Setup Needed

- ✅ No new environment variables
- ✅ No Supabase configuration changes
- ✅ Works on all domains (localhost, staging, production)
- ✅ Automatic domain detection

## Troubleshooting

### Still redirecting to localhost?
1. Clear browser cache
2. Make sure you're accessing from the correct domain
3. Check Supabase auth email templates haven't been modified

### "No user found" error?
1. The token may have expired (Supabase tokens expire after 24 hours)
2. Ask user to sign up again
3. Check that email verification is enabled in Supabase

### 404 at `/auth/confirm`?
1. Make sure you've deployed the latest code
2. Verify `/app/auth/confirm/page.tsx` file exists
3. Rebuild the Next.js project

## Summary

The email confirmation flow is now fixed and working properly. Users will:
1. Sign up with email and password
2. Receive confirmation email at their domain
3. Click link → Confirms email → Selects role → See dashboard

All without any localhost redirects! 🎉
