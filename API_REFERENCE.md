# API Quick Reference - Phase 2.5

## All Endpoints At A Glance

### User Applications

#### 1. Submit Filmmaker Application
```
POST /api/applications/filmmaker
Authorization: Required
Body: filmmaker form data
Returns: created application with ID
```

#### 2. Get User's Filmmaker Applications
```
GET /api/applications/filmmaker
Authorization: Required
Returns: array of user's filmmaker applications
```

#### 3. Submit Distributor Application
```
POST /api/applications/distributor
Authorization: Required
Body: distributor form data
Returns: created application with ID
```

#### 4. Get User's Distributor Applications
```
GET /api/applications/distributor
Authorization: Required
Returns: array of user's distributor applications
```

---

### Admin Endpoints

#### 5. List All Applications
```
GET /api/admin/applications
Authorization: Required
Query Params:
  - status: pending|approved|rejected|under_review (default: pending)
  - type: filmmaker|distributor (optional)
  - limit: number (default: 50)
  - offset: number (default: 0)
Returns: paginated applications with total count
```

#### 6. Update Application Status
```
PATCH /api/admin/applications/[id]
Authorization: Required
Body: {
  status: "approved|rejected|under_review",
  rejection_reason: "reason if rejected",
  admin_notes: "any notes"
}
Returns: updated application
Side Effect: If approved, user role is set automatically
```

#### 7. Get Single Application
```
GET /api/admin/applications/[id]
Authorization: Required
Returns: application details (if own or admin)
```

---

## Example Requests

### Submit Filmmaker App
```bash
curl -X POST http://localhost:3000/api/applications/filmmaker \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "filmTitle": "My Film",
    "filmGenre": "Drama",
    "filmDuration": 120,
    "filmDescription": "A great film",
    "filmLanguage": "English",
    "filmCountry": "USA",
    "filmReleaseDate": "2024-01-01",
    "filmUrl": "https://example.com/film",
    "phone": "555-1234",
    "website": "https://example.com",
    "bio": "I am a filmmaker"
  }'
```

### List Pending Applications
```bash
curl http://localhost:3000/api/admin/applications?status=pending&limit=10 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Approve Application
```bash
curl -X PATCH http://localhost:3000/api/admin/applications/[id] \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "admin_notes": "Looks great!"
  }'
```

### Reject Application
```bash
curl -X PATCH http://localhost:3000/api/admin/applications/[id] \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "rejection_reason": "Not suitable for platform"
  }'
```

---

## Response Format

### Success (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error (4xx/5xx)
```json
{
  "error": "Error message"
}
```

### List Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Field Mappings

### Filmmaker Application Fields
```
Input → Database
firstName → first_name
lastName → last_name
email → email
phone → phone
filmTitle → film_title
filmGenre → film_genre
filmDuration → film_duration
filmDescription → film_description
filmLanguage → film_language
filmCountry → film_country
filmReleaseDate → film_release_date
filmUrl → film_url
website → website
bio → bio
```

### Distributor Application Fields
```
Input → Database
firstName → first_name
lastName → last_name
email → email
phone → phone
companyName → company_name
companyWebsite → company_website
companyDescription → company_description
companyCountry → company_country
companySize → company_size
distributionPlatform → distribution_platform
website → website
bio → bio
```

---

## Key Features

✅ Applications saved to Supabase
✅ User authentication required
✅ RLS security policies
✅ Admin approval workflow
✅ Auto-role assignment on approval
✅ Pagination support
✅ Rejection reason tracking
✅ Audit fields (reviewed_by, reviewed_at)

---

## What Happens When You Approve

1. Application status → "approved"
2. User metadata updated with their role
3. User auto-redirects to dashboard on next login
4. Dashboard accessible without role selection

---

## Testing Checklist

- [ ] Submit filmmaker application
- [ ] Retrieve filmmaker application
- [ ] Submit distributor application
- [ ] Retrieve distributor application
- [ ] List all pending applications
- [ ] Approve an application
- [ ] Check user role was set
- [ ] Reject an application
- [ ] Verify rejection reason saved
- [ ] Test pagination
- [ ] Test filtering by type

---

See `PHASE_2_5_COMPLETE.md` for full documentation.
