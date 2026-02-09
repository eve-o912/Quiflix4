# Phase 2.5 Deployment Checklist

## ✅ Pre-Deployment

- [x] Database table created
- [x] RLS policies configured
- [x] All 7 APIs implemented
- [x] Authentication required on all endpoints
- [x] Error handling implemented
- [x] Logging added
- [x] Documentation complete

## 🚀 Deployment Steps

### Step 1: Verify Everything Works Locally
- [ ] Run `npm run dev` in local
- [ ] Test Sign up flow
- [ ] Test role selection
- [ ] Test application submission
- [ ] Check database has records
- [ ] No console errors

### Step 2: Deploy
Choose one:

**Option A: Deploy with v0**
- [ ] Click "Publish" button in v0
- [ ] Wait for deployment (2-3 min)
- [ ] Test on live URL

**Option B: Deploy with GitHub**
- [ ] Push to `dashboard-404-error` branch
- [ ] GitHub auto-syncs with Vercel
- [ ] Vercel auto-deploys
- [ ] Test on live URL

### Step 3: Post-Deployment Testing

#### User Flow Test
- [ ] Sign up new test user
- [ ] Select filmmaker role
- [ ] Submit filmmaker application
- [ ] Verify in Supabase (check applications table)
- [ ] Can see application in user's apps

#### Admin API Test
- [ ] Call `GET /api/admin/applications?status=pending`
- [ ] See pending applications
- [ ] Call `PATCH /api/admin/applications/[id]` with status=approved
- [ ] Verify status changed in database
- [ ] Verify user role was set

#### Auto-Redirect Test
- [ ] After approving application
- [ ] Login the user
- [ ] Should auto-redirect to filmmaker dashboard
- [ ] No role selection shown

---

## 🧪 Full Test Scenarios

### Scenario 1: Complete Filmmaker Flow
```
1. Sign up: new_user@example.com / password
2. At /protected: Select "Filmmaker" 
3. Submit form with all fields
4. Check: applications table has new record
5. Admin: approve application
6. Check: user.user_metadata.user_type = 'filmmaker'
7. Logout and login
8. Should auto-redirect to /filmmaker-dashboard
```

### Scenario 2: Complete Distributor Flow
```
1. Sign up: dist_user@example.com / password
2. At /protected: Select "Distributor"
3. Submit form with all fields
4. Check: applications table has new record
5. Admin: approve application
6. Check: user.user_metadata.user_type = 'distributor'
7. Logout and login
8. Should auto-redirect to /distributor-dashboard
```

### Scenario 3: Admin Approval Flow
```
1. Create 3 pending applications
2. Call: GET /api/admin/applications
3. Should see all 3 pending
4. Call: PATCH with status=approved
5. Verify: application status changed
6. Verify: user metadata updated
7. Login user: auto-redirects to dashboard
```

### Scenario 4: Rejection Flow
```
1. Create pending application
2. Call: PATCH with status=rejected
3. Include: rejection_reason
4. Verify: rejection_reason stored
5. User can reapply (new pending application)
```

---

## 📊 Success Criteria

All of the following should be true:

- [ ] ✅ Users can submit filmmaker applications
- [ ] ✅ Users can submit distributor applications
- [ ] ✅ Applications saved to Supabase
- [ ] ✅ Admin can view all pending applications
- [ ] ✅ Admin can approve applications
- [ ] ✅ Admin can reject applications
- [ ] ✅ On approval: user role is set
- [ ] ✅ On approval: user auto-redirects to dashboard
- [ ] ✅ No console errors
- [ ] ✅ No database errors
- [ ] ✅ All RLS policies working
- [ ] ✅ Pagination working
- [ ] ✅ Filtering by status working
- [ ] ✅ Filtering by type working

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" error
**Solution:** Make sure user is logged in and has valid token

### Issue: "Application not found"
**Solution:** Check that application ID is correct

### Issue: No data showing in admin API
**Solution:** Check that there are pending applications in database

### Issue: User role not set after approval
**Solution:** Check admin user has proper permissions

### Issue: Database connection error
**Solution:** Verify Supabase is connected and credentials are correct

---

## 📝 Documentation Files

Read these for more info:

1. **PHASE_2_5_COMPLETE.md** - Full technical documentation
2. **API_REFERENCE.md** - All API endpoints with examples
3. **QUICK_REFERENCE.md** - Quick lookup table
4. **SYSTEM_STATUS_REPORT.md** - System overview

---

## 🎯 Deployment Timeline

| Task | Time |
|------|------|
| Pre-deployment checks | 5 min |
| Deploy to production | 2-3 min |
| Post-deployment testing | 10 min |
| **TOTAL** | **20 min** |

---

## ✨ After Deployment

### Immediate
- [ ] Test the complete user flow
- [ ] Share link with team
- [ ] Get feedback

### Next Week
- [ ] Add email notifications (when approved/rejected)
- [ ] Create admin dashboard UI
- [ ] Add user settings page

### Next Month
- [ ] Analytics tracking
- [ ] User onboarding tutorial
- [ ] Advanced filters for admin

---

## 🚀 Ready to Deploy?

You have:
✅ All APIs implemented
✅ Database ready
✅ Authentication working
✅ Complete documentation
✅ Test scenarios ready

**You're ready to deploy! 🎉**

Start with Step 1: Verify Everything Works Locally
