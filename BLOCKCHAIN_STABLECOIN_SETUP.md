# Blockchain & Stablecoin Setup Guide

## Overview

Your Quiflix platform is already integrated with Pretium.africa for **stablecoin payments**. This guide walks you through setting up and verifying the blockchain integration.

## Current Status

✅ **Stablecoin Integration**: Active (Pretium.africa)
✅ **Payment Infrastructure**: Complete (KES → USDC/USDT)
✅ **Wallet System**: Implemented (AES-256 encryption)
✅ **Base Network**: Configured
⏳ **Missing**: Environment variables & Pretium credentials

## What's Implemented

### 1. Stablecoin Support
- **USDC** (Circle's USD Coin) - Recommended
- **USDT** (Tether USD)
- Both on Base network (EVM-compatible)
- 1:1 peg to USD

### 2. Payment Flow
```
Kenyan User (KES)
    ↓
Pretium.africa (Payment gateway)
    ↓
Convert KES → Stablecoin
    ↓
Send to Base network wallet
    ↓
Smart contract revenue split
    ↓
Filmmaker (70%)
Distributor (20%)
Platform (10%)
```

### 3. Blockchain Network: Base
- **Network**: Base by Coinbase
- **Chain ID**: 8453
- **Token Standards**: ERC-20 (stablecoins), ERC-1155 (DDT tokens)
- **RPC**: https://mainnet.base.org
- **Block Explorer**: https://basescan.org

## Required Environment Variables

### 1. Pretium.africa Integration
```env
# Get from https://pretium.africa/dashboard
PRETIUM_API_KEY=sk_live_xxxxxxxxxxxxx
PRETIUM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Application URL for callbacks
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Wallet Encryption
```env
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
WALLET_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

### 3. Smart Contract
```env
# Deploy to Base, then add address
QUIFLIX_DDT_CONTRACT=0x...base_network_address...
QUIFLIX_PLATFORM_WALLET=0x...platform_wallet_address...
```

## Setup Steps

### Step 1: Get Pretium API Credentials

1. Go to https://pretium.africa
2. Create account (or sign in)
3. Go to Dashboard → API Keys
4. Copy API Key and Webhook Secret
5. Add to `.env.local`:
```env
PRETIUM_API_KEY=sk_live_xxxxx
PRETIUM_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 2: Generate Wallet Encryption Key

Run this command in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:
```env
WALLET_ENCRYPTION_KEY=<output_from_command>
```

### Step 3: Configure Webhook in Pretium

1. Go to Pretium Dashboard → Webhooks
2. Add webhook URL:
```
https://yourdomain.com/api/payment/webhook/pretium
```
3. Select events: `payment.completed`, `payment.failed`
4. Copy webhook secret → `PRETIUM_WEBHOOK_SECRET`

### Step 4: Deploy Smart Contract (Optional)

If you want custom revenue splits:

1. Deploy `contracts/QuiflixDDT.sol` to Base network
2. Use tools like:
   - Remix.ethereum.org (web IDE)
   - Hardhat (local development)
   - Foundry (advanced)

3. Add to `.env.local`:
```env
QUIFLIX_DDT_CONTRACT=0x...deployed_contract_address...
```

### Step 5: Verify Setup

Test the payment flow:

```bash
# 1. Sign in to dashboard
# 2. Go to /checkout/test-film-id
# 3. Select payment method
# 4. Select stablecoin (USDC or USDT)
# 5. Complete payment on Pretium
# 6. Verify funds in /wallet-dashboard
```

## API Endpoints

### Create Payment Order
```bash
POST /api/payment/create-order
```
Body:
```json
{
  "filmId": "uuid",
  "amountKes": 1000,
  "amountUsd": 7.70,
  "stablecoin": "USDC",
  "paymentMethod": "mpesa",
  "referralCode": "optional"
}
```

### Get Exchange Rate
```bash
GET /api/payment/exchange-rate
```
Response:
```json
{
  "rate": 0.0077,
  "pair": "KES/USD",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Payment Webhook
```bash
POST /api/payment/webhook/pretium
```
Pretium sends this automatically when payment completes.

## Wallet Management

### Automatic Wallet Creation

Wallets are created automatically when:
1. Filmmaker application is **approved** by admin
2. Distributor application is **approved** by admin
3. First purchase by buyer

### Wallet Details

```typescript
// Get wallet address
const wallet = await getWalletForUser(userId);
console.log(wallet.wallet_address); // 0x...
```

### Wallet Security

- Private keys encrypted with AES-256-GCM
- Never exposed to users
- Random IV for each encryption
- Stored securely in database

## Testing

### Pretium Sandbox (Recommended)

1. Use Pretium sandbox API:
```env
PRETIUM_API_KEY=sk_test_xxxxxxxxxxxxx
PRETIUM_API_URL=https://api-sandbox.pretium.africa/v1
```

2. Test M-Pesa numbers:
   - Amount: 100 KES
   - Phone: +254701234567
   - Status: Auto-completes

3. Monitor transactions in Pretium dashboard

### Local Testing

1. Use Hardhat for local blockchain:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat
```

2. Deploy contract locally
3. Test payment flow with test wallets

## Supported Stablecoins

| Stablecoin | Network | Decimals | Min Transfer |
|-----------|---------|----------|--------------|
| USDC      | Base    | 6        | 1 USDC       |
| USDT      | Tether  | 6        | 1 USDT       |

Both are 1:1 pegged to USD.

## Revenue Distribution

### Default Split (70-20-10)
- **70%** → Filmmaker wallet
- **20%** → Distributor wallet
- **10%** → Platform wallet

### Custom Smart Contract

Deploy `QuiflixDDT.sol` to customize splits:

```solidity
// Example: 80% filmmaker, 15% distributor, 5% platform
function distributeRevenue(
    uint256 amount,
    address filmmaker,
    address distributor,
    address platform
) external onlyOwner {
    uint256 filmmakerShare = (amount * 80) / 100;
    uint256 distributorShare = (amount * 15) / 100;
    uint256 platformShare = (amount * 5) / 100;
    
    // Transfer to wallets...
}
```

## Security Checklist

- [ ] Set `PRETIUM_API_KEY` in production
- [ ] Set `PRETIUM_WEBHOOK_SECRET` (verified from Pretium)
- [ ] Generate `WALLET_ENCRYPTION_KEY` (32 bytes hex)
- [ ] Set `NEXT_PUBLIC_APP_URL` correctly
- [ ] Enable HTTPS for all URLs
- [ ] Verify webhook signature on every request
- [ ] Use strong database passwords
- [ ] Enable rate limiting on payment endpoints
- [ ] Monitor for suspicious transactions
- [ ] Regular backup of encryption key

## Troubleshooting

### Payment Fails with "Wallet not found"
**Solution**: Create wallet before purchase
```typescript
await createWalletForUser(userId, 'buyer');
```

### Exchange Rate API Error
**Solution**: Pretium may be down, uses fallback rate (0.0077)
- Check Pretium status: https://status.pretium.africa
- Manual override:
```env
FALLBACK_EXCHANGE_RATE=0.0077
```

### Webhook Not Receiving
**Solution**:
1. Verify webhook URL in Pretium dashboard
2. Check firewall allows POST to `/api/payment/webhook/pretium`
3. Verify `PRETIUM_WEBHOOK_SECRET` matches Pretium
4. Check server logs: `npm run dev`

### Stablecoin Not Appearing in Wallet
**Solution**:
1. Verify user has wallet on Base network
2. Check transaction on basescan.org
3. May take 5-10 minutes to appear
4. Verify correct stablecoin selected (USDC vs USDT)

## Next Steps

1. **Add API Credentials**: Set Pretium keys in env vars
2. **Test Payment Flow**: Complete test purchase
3. **Monitor Transactions**: Watch `/wallet-dashboard`
4. **Deploy Smart Contract**: Optional custom revenue splits
5. **Go Live**: Switch Pretium to production mode

## Resources

- **Pretium Documentation**: https://docs.pretium.africa
- **Base Network**: https://base.org
- **USDC Documentation**: https://www.circle.com/usdc
- **Smart Contracts**: https://remix.ethereum.org

## Support

- Pretium Support: https://pretium.africa/support
- Base Network Help: https://base.org/docs
- Your API docs: Check `/api` routes in code

