# Quiflix Dashboard 404 Fix - Testing Guide

## Problem Statement
Users were getting 404 errors after logging in because:
1. Login page redirected to `/protected` route which didn't exist
2. No mechanism to route users to appropriate dashboard based on their role
3. No role selection flow for new users

## Solution Implemented
Created `/protected` page that acts as an intelligent router with:
- Authentication check
- Role detection from user metadata
- Auto-redirect to appropriate dashboard
- First-time role selection UI

---

## Testing Scenarios

### Scenario 1: New User Sign Up → Role Selection
**Steps:**
1. Go to `/auth/sign-up`
2. Enter email: `filmmaker@test.com`
3. Enter password: `Test123!`
4. Confirm password: `Test123!`
5. Click "Sign up"
6. Should redirect to `/auth/sign-up-success`
7. Need to verify email (check Supabase email for confirmation link)
8. Click confirmation link in email
9. Should redirect to `/protected`

**Expected Result:** 
- ✅ See "Welcome to Quiflix" card with role selection buttons
- ✅ Display user email at top
- ✅ Three buttons: "Continue as Filmmaker", "Continue as Distributor", "Continue as Buyer"

**Actual Result:** 
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Scenario 2: Select Filmmaker Role
**Prerequisites:** Completed Scenario 1

**Steps:**
1. From role selection page, click "Continue as Filmmaker" button
2. Should show loading state briefly ("Setting up...")
3. Should redirect to `/filmmaker-dashboard`

**Expected Result:**
- ✅ User metadata updated with `user_type: 'filmmaker'`
- ✅ Redirected to filmmaker dashboard
- ✅ Filmmaker dashboard displays without 404 error

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Scenario 3: Select Distributor Role (New User)
**Prerequisites:** New user account

**Steps:**
1. Go through sign up again with: `distributor@test.com`
2. Complete email verification
3. Redirected to role selection at `/protected`
4. Click "Continue as Distributor"

**Expected Result:**
- ✅ User metadata updated with `user_type: 'distributor'`
- ✅ Redirected to `/distributor-dashboard`
- ✅ No 404 error

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Scenario 4: Select Buyer Role (New User)
**Prerequisites:** New user account

**Steps:**
1. Go through sign up again with: `buyer@test.com`
2. Complete email verification
3. Redirected to role selection at `/protected`
4. Click "Continue as Buyer"

**Expected Result:**
- ✅ User metadata updated with `user_type: 'buyer'`
- ✅ Redirected to `/dashboard`
- ✅ No 404 error

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Scenario 5: Returning User with Existing Role (Filmmaker)
**Prerequisites:** Previously created user with filmmaker role

**Steps:**
1. User logs in at `/auth/login`
2. Enter credentials for filmmaker account
3. Click "Login"

**Expected Result:**
- ✅ Auto-detects `user_type: 'filmmaker'` from metadata
- ✅ Automatically redirected to `/filmmaker-dashboard` WITHOUT showing role selection
- ✅ No intermediate "Loading" screen that lasts too long

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Scenario 6: Returning User with Existing Role (Distributor)
**Prerequisites:** Previously created user with distributor role

**Steps:**
1. User logs in with distributor account
2. Check if auto-redirects to `/distributor-dashboard`

**Expected Result:**
- ✅ Auto-redirect to `/distributor-dashboard` without showing role selection

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Scenario 7: Direct Access to Protected Route While Logged Out
**Steps:**
1. Log out of current session
2. Navigate directly to `/protected`

**Expected Result:**
- ✅ Detects user is not authenticated
- ✅ Redirects to `/auth/login`
- ✅ No 404 error

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Scenario 8: Switch Roles
**Prerequisites:** User logged in with a role selected

**Steps:**
1. Go to home page (`/`)
2. Should allow user to change role (current implementation allows this via "Go to home" link)
3. Navigate back to `/protected`
4. Should show role selection again if able to reset

**Expected Result:**
- ✅ Users can change their role if needed

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

## Edge Cases to Test

### Edge Case 1: Network Error During Role Update
**Steps:**
1. Start role selection at `/protected`
2. Disable network/go offline
3. Click role button
4. Should show error message

**Expected Result:**
- ✅ Error alert: "Error setting role. Please try again."
- ✅ Button remains enabled for retry
- ✅ No page crash

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Edge Case 2: Multiple Rapid Clicks on Role Button
**Steps:**
1. At role selection page
2. Rapidly click "Continue as Filmmaker" multiple times
3. Check browser console for errors

**Expected Result:**
- ✅ Button becomes disabled after first click
- ✅ Only one API call made
- ✅ Smooth redirect without duplicates

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Edge Case 3: User Metadata Already Set But User Tries Role Selection
**Steps:**
1. User logs in but somehow reaches `/protected` with role already set
2. Page should detect role and auto-redirect

**Expected Result:**
- ✅ Auto-redirect to appropriate dashboard
- ✅ Skip role selection UI

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

## Test Summary

### Working Features:
- [ ] Protected route exists (no 404)
- [ ] Role selection UI displays correctly
- [ ] Auto-redirect for existing users
- [ ] Email display in welcome card
- [ ] Loading states
- [ ] Button disabled states during submission
- [ ] Error handling

### Potential Issues to Fix:
1. _____________________
2. _____________________
3. _____________________

### Additional Features Needed:
1. _____________________
2. _____________________
3. _____________________

### Notes:
_________________________________________________

---

## Browser Console Expected Logs

When testing, open browser DevTools (F12) and check Console tab for these logs:

**New User Selecting Role:**
```
[v0] User authenticated: filmmaker@test.com Type: undefined
[v0] User role set to: filmmaker
```

**Returning User with Role:**
```
[v0] User authenticated: filmmaker@test.com Type: filmmaker
```

**Error Case:**
```
[v0] Error during redirect: [error message]
[v0] Error updating user metadata: [error message]
```

---

## Debugging Checklist

- [ ] Check if `/protected` page file exists
- [ ] Check if Button and Card components are imported
- [ ] Check browser DevTools console for errors
- [ ] Check Supabase dashboard to see if user_metadata is being saved
- [ ] Check network tab for API failures
- [ ] Verify environment variables are set (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] Check if user is properly authenticated before role selection
