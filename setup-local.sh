#!/bin/bash

echo "🎬 Setting up Quiflix Local Development Environment..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_ID=your_privy_app_id_here

# Blockchain Configuration (Base Mainnet)
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_QUIFLIX_DDT_ADDRESS=0xYourDeployedContractAddressHere
PRIVATE_KEY=your_private_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ .env.local created. Please update with your actual values."
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Start development server
echo "🚀 Starting Quiflix development server..."
pnpm run dev
