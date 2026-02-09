# Blockchain & Stablecoin Setup Checklist

## Pre-Setup Verification

- [ ] Supabase connected ✓ (confirmed)
- [ ] Pretium.africa account created
- [ ] Base network knowledge (basic understanding)
- [ ] Environment variables access
- [ ] Terminal/command line access

## Step 1: Pretium Credentials (10 min)

- [ ] Go to https://pretium.africa
- [ ] Create account or sign in
- [ ] Navigate to API Keys section
- [ ] Copy `API Key` → Save to `.env.local` as `PRETIUM_API_KEY`
- [ ] Copy `Webhook Secret` → Save to `.env.local` as `PRETIUM_WEBHOOK_SECRET`
- [ ] Set `NEXT_PUBLIC_APP_URL` to your deployment URL

**Environment Variables Added:**
```
PRETIUM_API_KEY=sk_live_xxxxx
PRETIUM_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Step 2: Wallet Encryption Key (5 min)

- [ ] Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- [ ] Copy output
- [ ] Add to `.env.local` as `WALLET_ENCRYPTION_KEY`

**Environment Variable Added:**
```
WALLET_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

## Step 3: Webhook Configuration (5 min)

- [ ] Log into Pretium dashboard
- [ ] Go to Settings → Webhooks
- [ ] Add new webhook:
  - URL: `https://yourdomain.com/api/payment/webhook/pretium`
  - Events: `payment.completed`, `payment.failed`
  - Version: Latest
- [ ] Enable webhook
- [ ] Copy Secret (matches `PRETIUM_WEBHOOK_SECRET`)
- [ ] Test webhook delivery (Pretium will show status)

## Step 4: Database Verification (5 min)

- [ ] Run migration (if not already done):
```bash
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DATABASE -f scripts/004_create_wallets.sql
```
- [ ] Verify tables created:
  - `wallets` table exists
  - `payment_transactions` table exists
  - RLS policies enabled

Check with:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## Step 5: Smart Contract (Optional - 20 min)

### Option A: Use Default Split (Recommended for MVP)
- [ ] Skip this step - use default 70-20-10 split
- [ ] Platform automatically handles distribution

### Option B: Custom Smart Contract
- [ ] Go to https://remix.ethereum.org
- [ ] Create new file: `QuiflixDDT.sol`
- [ ] Copy contract from `/vercel/share/v0-project/contracts/QuiflixDDT.sol`
- [ ] Set network: Base mainnet
- [ ] Compile contract
- [ ] Deploy to Base network:
  - Network: Base (Chain ID 8453)
  - Required: USDC address, Platform wallet
- [ ] Copy deployed address
- [ ] Add to `.env.local`:
```
QUIFLIX_DDT_CONTRACT=0x...deployed_address...
QUIFLIX_PLATFORM_WALLET=0x...your_platform_wallet...
```

## Step 6: Testing (15 min)

### Local Testing
- [ ] Run dev server: `npm run dev`
- [ ] Sign up new test user
- [ ] Select role at `/protected`
- [ ] Go to `/checkout/test-film-id`
- [ ] Use Pretium sandbox credentials:
```env
PRETIUM_API_KEY=sk_test_xxxxx (from Pretium sandbox)
```
- [ ] Complete test payment
- [ ] Check `/wallet-dashboard` for transaction
- [ ] Verify funds show in wallet

### Webhook Testing
- [ ] Use Pretium webhook tester
- [ ] Send test `payment.completed` event
- [ ] Check server logs for processing
- [ ] Verify database updated

### Full Flow Test
- [ ] Film purchase starts
- [ ] Select stablecoin (USDC or USDT)
- [ ] Choose payment method (M-Pesa or Card)
- [ ] Proceed to Pretium
- [ ] Complete payment
- [ ] Redirected to success page
- [ ] Funds appear in wallet (5-10 min)
- [ ] Revenue distributed to filmmaker/distributor

## Step 7: Production Deployment (5 min)

- [ ] Switch Pretium to production mode:
  - Pretium Dashboard → Settings → Mode: Production
  - API Key changes from `sk_test_` to `sk_live_`
- [ ] Update `.env.local` with production key
- [ ] Deploy to production
- [ ] Update webhook URL in Pretium (if domain changed)
- [ ] Test production payment

## Step 8: Monitoring (Ongoing)

- [ ] Set up alerts for failed payments
- [ ] Monitor exchange rates (KES/USD)
- [ ] Check webhook delivery status weekly
- [ ] Review transaction logs
- [ ] Verify wallet balances

## Verification Checklist

### Stablecoins
- [ ] USDC payments working
- [ ] USDT payments working
- [ ] Both on Base network
- [ ] Correct decimals (6 for both)

### Payments
- [ ] M-Pesa integration working
- [ ] Credit card integration working
- [ ] Exchange rate updates automatically
- [ ] KES to USD conversion correct

### Wallets
- [ ] Filmmaker wallets created on approval
- [ ] Distributor wallets created on approval
- [ ] Buyer wallets created on first purchase
- [ ] Private keys encrypted
- [ ] Wallets on Base network

### Revenue Distribution
- [ ] 70% goes to filmmaker
- [ ] 20% goes to distributor
- [ ] 10% goes to platform
- [ ] Distributions are automatic
- [ ] All in stablecoins

### Security
- [ ] Encryption key secure
- [ ] API key not in code
- [ ] Webhook signature verified
- [ ] HTTPS enabled
- [ ] Rate limiting active

## Environment Variables Summary

All required variables:
```env
# Pretium API
PRETIUM_API_KEY=sk_live_xxxxxxxxxxxxx
PRETIUM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Wallet Encryption
WALLET_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Optional: Smart Contract
QUIFLIX_DDT_CONTRACT=0x...
QUIFLIX_PLATFORM_WALLET=0x...
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Payments failing | Check PRETIUM_API_KEY, verify in sandbox first |
| Wallets not created | Run migrations, check database |
| Exchange rate errors | Using fallback (0.0077), check Pretium status |
| Webhook not working | Verify URL, secret, HTTPS enabled |
| Stablecoin not received | Wait 5-10 min, check Base explorer |

## Documentation Files

- `BLOCKCHAIN_STABLECOIN_SETUP.md` - Full setup guide
- `PAYMENT_SYSTEM.md` - Payment system architecture
- `API_REFERENCE.md` - API endpoints
- Docs in code comments

## Timeline

| Step | Time | Status |
|------|------|--------|
| Get Pretium credentials | 10 min | ⏳ |
| Generate encryption key | 5 min | ⏳ |
| Configure webhook | 5 min | ⏳ |
| Database setup | 5 min | ⏳ |
| Test payments | 15 min | ⏳ |
| Deploy to production | 5 min | ⏳ |
| **Total** | **~45 min** | **⏳** |

## Next Steps

1. Start with **Step 1**: Get Pretium credentials
2. Follow each step in order
3. Test thoroughly before going live
4. Monitor in production

**You're all set! Stablecoin payments are ready to go. 🚀**

