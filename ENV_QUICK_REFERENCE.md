# Environment Variables - Quick Reference

## All Required Variables

| Variable | Type | Source | Priority |
|----------|------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase Dashboard | 🔴 CRITICAL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Dashboard | 🔴 CRITICAL |
| `NEXT_PUBLIC_APP_URL` | Public | Your Domain | 🔴 CRITICAL |
| `NEXT_PUBLIC_BASE_RPC_URL` | Public | Base/RPC Provider | 🟡 Important |
| `NEXT_PUBLIC_QUIFLIX_DDT_CONTRACT` | Public | Contract Deployment | 🔴 CRITICAL |
| `NEXT_PUBLIC_GOODFLIX_WALLET` | Public | Your Wallet | 🟡 Important |
| `GOODFLIX_PRIVATE_KEY` | Secret | Generate with crypto | 🔴 CRITICAL |
| `PRETIUM_API_KEY` | Secret | Pretium Dashboard | 🔴 CRITICAL |
| `PRETIUM_WEBHOOK_SECRET` | Secret | Pretium Dashboard | 🔴 CRITICAL |
| `WALLET_ENCRYPTION_KEY` | Secret | Generate with crypto | 🔴 CRITICAL |
| `RESEND_API_KEY` | Secret | Resend Dashboard | 🟡 Optional |

## Quick Setup Commands

### 1. Generate Encryption Keys
```bash
# Generate WALLET_ENCRYPTION_KEY (32 bytes hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate GOODFLIX_PRIVATE_KEY
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Get Supabase Credentials
- URL: https://supabase.com/dashboard → Settings → API → Project URL
- Key: https://supabase.com/dashboard → Settings → API → Anon Key

### 3. Get Pretium Credentials
- API Key: https://pretium.africa/dashboard → API Keys
- Webhook Secret: https://pretium.africa/dashboard → Webhooks

### 4. Deploy to Vercel
```bash
# Via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... repeat for all variables

# Via Dashboard
# Settings → Environment Variables → Add each variable
```

## Environment Variable Locations

### Local Development
```bash
# File: .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# ... rest of variables
```

### Production (Vercel)
```
Vercel Dashboard → Project Settings → Environment Variables
```

## Variable Details

### Public Variables (Safe to expose)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_BASE_RPC_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (limited permissions)
- `NEXT_PUBLIC_QUIFLIX_DDT_CONTRACT`
- `NEXT_PUBLIC_GOODFLIX_WALLET`

### Secret Variables (NEVER expose)
- `GOODFLIX_PRIVATE_KEY` - Signs blockchain transactions
- `PRETIUM_API_KEY` - Payment gateway access
- `PRETIUM_WEBHOOK_SECRET` - Payment webhook validation
- `WALLET_ENCRYPTION_KEY` - Wallet encryption

## Verification

### Check if variables are set
```bash
# In your code
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
}
```

### Test API connections
```bash
# Supabase
curl $NEXT_PUBLIC_SUPABASE_URL

# Base RPC
curl -X POST $NEXT_PUBLIC_BASE_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Pretium
curl -H "Authorization: Bearer $PRETIUM_API_KEY" \
  https://api.pretium.africa/v1/account
```

## Development vs Production

### Development (.env.local)
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
PRETIUM_API_KEY=sk_test_... (test key)
```

### Production (Vercel)
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
PRETIUM_API_KEY=sk_live_... (production key)
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Variables not loading | Restart dev server (`npm run dev`) |
| "undefined" error | Check .env.local file exists in root |
| Payment fails | Verify PRETIUM_API_KEY is correct and not test key |
| Blockchain error | Check Base ETH balance for gas fees |
| Encryption error | WALLET_ENCRYPTION_KEY must be 64 hex chars |

## Security Checklist

- [ ] .env.local added to .gitignore
- [ ] No secrets hardcoded in source code
- [ ] Private keys stored securely
- [ ] Production uses different keys than dev
- [ ] Vercel Secrets enabled
- [ ] Webhook secret validated
- [ ] HTTPS enabled in production
- [ ] Regular key rotation scheduled

## Next Steps

1. Copy `.env.example` to `.env.local`
2. Fill in all variables using the guide
3. Run `npm run dev` to test
4. Deploy to Vercel with proper environment variables
5. Verify everything works in production

See `ENV_SETUP_GUIDE.md` for detailed instructions on each variable.
