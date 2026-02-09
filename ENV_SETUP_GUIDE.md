# Environment Variables Setup Guide

## Overview

This guide walks you through setting up all environment variables needed for Quiflix to run locally and in production.

## Quick Checklist

- [ ] Supabase (Database & Auth)
- [ ] Application URL
- [ ] Blockchain (Base Network)
- [ ] Smart Contract (DDT)
- [ ] Payment Gateway (Pretium)
- [ ] Wallet Encryption Key
- [ ] Email Service (Optional)

---

## 1. Supabase Configuration

### What It Is
Supabase is your database and authentication provider.

### Setup Steps

1. Go to https://supabase.com/dashboard
2. Create a new project or select existing
3. Wait for project to initialize (2-3 minutes)
4. Go to **Settings → API**
5. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Application URL

### What It Is
Your app's domain for email links and redirects.

### Setup Steps

**Local Development:**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production (Vercel):**
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Custom Domain:**
```bash
NEXT_PUBLIC_APP_URL=https://quiflix.yourcompany.com
```

---

## 3. Blockchain Configuration

### What It Is
Configuration for Base network blockchain payments.

### Setup Steps

#### 3.1 Base Network RPC (Optional - defaults to public RPC)

```bash
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

Or use your own RPC provider:
- Alchemy: https://www.alchemy.com/
- Infura: https://www.infura.io/
- QuickNode: https://www.quicknode.com/

#### 3.2 Smart Contract Address

After deploying your DDT contract on Base:

```bash
NEXT_PUBLIC_QUIFLIX_DDT_CONTRACT=0x... (contract address after deployment)
NEXT_PUBLIC_GOODFLIX_WALLET=0x... (your admin wallet)
```

#### 3.3 Blockchain Signing Key (CRITICAL - KEEP SECURE!)

This private key signs blockchain transactions.

**Generate safely:**
```bash
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

**Add to .env.local:**
```bash
GOODFLIX_PRIVATE_KEY=0x... (DO NOT SHARE OR COMMIT)
```

**Security Best Practices:**
- Never commit this key to GitHub
- Use Vercel Secrets for production
- Rotate regularly
- Fund the wallet with Base ETH for gas fees

---

## 4. Payment Gateway - Pretium.africa

### What It Is
Stablecoin payment processor supporting USDC, USDT, and fiat (M-Pesa, cards, etc.)

### Setup Steps

1. Sign up at https://pretium.africa
2. Complete KYC verification
3. Go to **Dashboard → API Keys**
4. Create new API credentials
5. Copy the following:
   - **API Key** → `PRETIUM_API_KEY`
   - **Webhook Secret** → `PRETIUM_WEBHOOK_SECRET`

### .env.local

```bash
PRETIUM_API_KEY=sk_live_... (or sk_test_... for testing)
PRETIUM_WEBHOOK_SECRET=whsec_...
```

### Configure Webhook

1. Go to Pretium Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/pretium`
3. Subscribe to events: `payment.completed`, `payment.failed`
4. Copy the webhook secret

---

## 5. Wallet Encryption Key

### What It Is
Encrypts all wallet private keys stored in your database.

### Setup Steps

**Generate the key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Add to .env.local:**
```bash
WALLET_ENCRYPTION_KEY=abc123def456... (32 bytes as hex)
```

**Important:**
- Store this key securely
- Don't lose it - you can't decrypt wallets without it
- Use different keys for dev/prod
- Rotate regularly

---

## 6. Email Service (Optional)

### What It Is
Sends application approval/rejection emails and notifications.

### Setup Steps

1. Sign up at https://resend.com
2. Go to **API Keys**
3. Create new key
4. Copy → `RESEND_API_KEY`

### .env.local

```bash
RESEND_API_KEY=re_...
```

### Alternative Email Services

Instead of Resend, you can use:
- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://mailgun.com
- **AWS SES**: https://aws.amazon.com/ses/

---

## Complete .env.local Template

```bash
# ============================================
# Supabase
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# Application
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# Blockchain
# ============================================
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_QUIFLIX_DDT_CONTRACT=0x...
NEXT_PUBLIC_GOODFLIX_WALLET=0x...
GOODFLIX_PRIVATE_KEY=0x...

# ============================================
# Payment
# ============================================
PRETIUM_API_KEY=sk_live_...
PRETIUM_WEBHOOK_SECRET=whsec_...

# ============================================
# Security
# ============================================
WALLET_ENCRYPTION_KEY=abc123def456...

# ============================================
# Email (Optional)
# ============================================
RESEND_API_KEY=re_...
```

---

## Verification Checklist

After setting all variables, verify with:

```bash
# Check Supabase connection
curl $NEXT_PUBLIC_SUPABASE_URL

# Check Base RPC
curl -X POST $NEXT_PUBLIC_BASE_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check Pretium API
curl -H "Authorization: Bearer $PRETIUM_API_KEY" \
  https://api.pretium.africa/v1/account
```

---

## Production Deployment (Vercel)

1. Go to your Vercel project
2. Click **Settings → Environment Variables**
3. Add all variables from .env.local
4. Make sure to update URLs to production domain
5. Redeploy

**Important for Production:**
- Use real API keys (not test keys)
- Use strong, unique encryption keys
- Enable HTTPS
- Configure CORS properly
- Set up monitoring/alerts

---

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is undefined"
- Check .env.local file exists
- Verify exact variable names (case-sensitive)
- Restart dev server: `npm run dev`

### "Payment gateway not responding"
- Verify PRETIUM_API_KEY is correct
- Check internet connection
- Make sure Pretium account is active

### "Wallet encryption failed"
- WALLET_ENCRYPTION_KEY must be 32 bytes (64 hex chars)
- Regenerate if incorrect
- Don't use spaces or quotes

### "Blockchain transaction failed"
- Check GOODFLIX_PRIVATE_KEY format (must start with 0x)
- Verify Base ETH balance for gas fees
- Check RPC endpoint is working

---

## Security Notes

**Never:**
- Commit .env.local to GitHub
- Share private keys
- Use test keys in production
- Hardcode secrets in code

**Always:**
- Use .gitignore to exclude .env.local
- Rotate keys regularly
- Use Vercel Secrets for production
- Enable two-factor authentication
- Monitor API usage for suspicious activity

---

## Questions?

See these guides:
- **Supabase**: https://supabase.com/docs
- **Base Network**: https://docs.base.org
- **Pretium**: https://pretium.africa/docs
- **Resend**: https://resend.com/docs

