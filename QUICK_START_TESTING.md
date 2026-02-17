# Quick Start Testing - Manual Test Instructions

## What Was Fixed
❌ **Before:** User logs in → Redirected to `/protected` → **404 Error**
✅ **After:** User logs in → Redirected to `/protected` → Role selection page → Appropriate dashboard

---

## How to Test Manually

### Step 1: Start Fresh
1. Open your Quiflix app in browser
2. If logged in, log out first
3. Clear cookies (optional but recommended)

### Step 2: Sign Up Test
1. Go to `/auth/sign-up` 
   OR Click "Sign Up" button on home page

2. Fill in the form:
   - Email: `test.filmmaker@example.com`
   - Password: `TestPassword123!`
   - Repeat Password: `TestPassword123!`

3. Click "Sign up" button

4. **Expected:** Redirect to `/auth/sign-up-success` page
   - If you see this ✅ proceed to step 3
   - If you see error ❌ check console (F12)

### Step 3: Email Verification
1. Check your email (the one you used to sign up)
2. Look for Supabase verification email
3. Click the confirmation link in the email
4. **Expected:** Browser redirects to `/protected` page

### Step 4: See Role Selection (THE FIX!)
You should now see:
```
┌─────────────────────────────────────┐
│      Welcome to Quiflix             │
│      test.filmmaker@example.com      │
│                                     │
│   Choose your role to continue      │
│                                     │
│  [ Continue as Filmmaker ]          │
│  [ Continue as Distributor ]        │
│  [ Continue as Buyer ]              │
└─────────────────────────────────────┘
```

✅ **If you see this, the 404 fix is working!**
❌ **If you see 404, something is wrong**

### Step 5: Select a Role
1. Click "Continue as Filmmaker"
2. You should see button change to "Setting up..."
3. Wait 2-3 seconds for redirect
4. **Expected:** Redirected to `/filmmaker-dashboard`

✅ **If you reach filmmaker dashboard, the flow is complete!**
❌ **If you see error or 404, check steps below**

---

## Testing All Three Roles

### Test Filmmaker Role
- Email: `test.filmmaker@example.com`
- Expected destination: `/filmmaker-dashboard`

### Test Distributor Role
1. Sign up with: `test.distributor@example.com`
2. Complete email verification
3. At role selection, click "Continue as Distributor"
4. Expected destination: `/distributor-dashboard`

### Test Buyer Role
1. Sign up with: `test.buyer@example.com`
2. Complete email verification
3. At role selection, click "Continue as Buyer"
4. Expected destination: `/dashboard`

---

## Troubleshooting

### Problem: No role selection page, just 404
**Solution:**
1. Check if `/protected` page file exists:
   - Look for: `/app/protected/page.tsx`
   - If missing, it didn't save correctly

2. Hard refresh browser:
   - Windows/Linux: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

3. Check console (F12):
   - Look for error messages
   - Share errors here

### Problem: Role selection shows but buttons don't work
**Solution:**
1. Open Console (F12)
2. Look for errors like:
   - `[v0] Error updating user metadata: ...`
   - `Error: fetch failed`
   - `NEXT_PUBLIC_SUPABASE_... is undefined`

3. If you see "is undefined", environment variables aren't set:
   - In v0 sidebar, go to "Vars" tab
   - Verify these exist:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Problem: After selecting role, page just shows "Redirecting..."
**Solution:**
1. Wait 5 seconds (might be processing)
2. If still there, check console for errors
3. The page might have failed to redirect:
   - Dashboard route might not exist
   - Or redirected successfully but dashboard has its own error

### Problem: Email verification link doesn't work
**Solution:**
1. Make sure you're using correct email address you signed up with
2. Check email spam folder
3. Email link might have expired - sign up again

---

## What to Report

If testing fails, tell us:

1. **What step failed?**
   - Sign up
   - Email verification
   - Role selection
   - Redirect to dashboard

2. **What error did you see?**
   - Copy exact error message from console

3. **Check console logs (F12 → Console tab)**
   - Look for `[v0]` prefixed logs
   - Copy any error messages

4. **Screenshot of:**
   - The page you see
   - Browser console errors
   - Network tab errors (if any)

---

## Console Debug Output - What to Look For

### ✅ Successful Login (returning user)
```
[v0] User authenticated: test@example.com Type: filmmaker
```
Then auto-redirects to dashboard

### ✅ First Time User
```
[v0] User authenticated: test@example.com Type: undefined
```
Then shows role selection page

### ✅ Role Selection Success
```
[v0] User role set to: filmmaker
```
Then redirects to `/filmmaker-dashboard`

### ❌ Error During Role Update
```
[v0] Error updating user metadata: ...
```
You'll see error message and can retry

---

## Expected Behavior Summary

| Scenario | Before Fix | After Fix |
|----------|-----------|-----------|
| New user login | 404 Error | Role Selection Page |
| Select role | N/A | Redirects to dashboard |
| Returning user login | 404 Error | Auto-redirect to dashboard |
| Wrong credentials | Login error | Login error (unchanged) |

---

## Next Steps If Testing Passes

1. Test edge cases:
   - Log out and log back in
   - Try switching browsers
   - Try incognito/private mode

2. Check each dashboard:
   - Filmmaker dashboard loads correctly
   - Distributor dashboard loads correctly
   - Buyer dashboard loads correctly

3. Additional features to add (from DASHBOARD_FIX_SUMMARY.md):
   - Admin approval linking to user role
   - Role management in settings
   - Logout button
   - Better onboarding

---

## Visual Test Checklist

At role selection page, verify:
- [ ] "Welcome to Quiflix" heading visible
- [ ] User email displayed
- [ ] "Choose your role to continue" text visible
- [ ] Three buttons present with correct labels
- [ ] Buttons are clickable
- [ ] Buttons disable while loading
- [ ] "Loading..." state appears briefly
- [ ] Buttons re-enable if error occurs
- [ ] "Go to home" link works

At dashboard, verify:
- [ ] No 404 error
- [ ] Dashboard loads correctly
- [ ] User is logged in (check if logout available)
- [ ] No console errors

---

## Questions?
Check TESTING_FLOW.md and DASHBOARD_FIX_SUMMARY.md for more detailed information.
