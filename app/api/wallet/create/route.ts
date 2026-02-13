import { createClient } from '@/lib/supabase/server';
import { createWalletForUser, getWalletForUser } from '@/lib/wallet/create-wallet';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, user_type, email, first_name, last_name } = body;

    if (!user_id || !user_type) {
      return Response.json(
        { error: 'Missing required fields: user_id, user_type' },
        { status: 400 }
      );
    }

    if (!['filmmaker', 'distributor', 'buyer', 'platform'].includes(user_type)) {
      return Response.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Check if wallet already exists
    const existingWallet = await getWalletForUser(user_id);
    if (existingWallet) {
      console.log('[v0] Wallet already exists for user:', user_id);
      return Response.json(
        {
          success: true,
          message: 'Wallet already exists',
          data: {
            wallet_address: existingWallet.wallet_address,
            user_type: existingWallet.user_type,
          },
        },
        { status: 200 }
      );
    }

    // Create new wallet
    console.log('[v0] Creating wallet for user:', { user_id, user_type });

    const walletResult = await createWalletForUser(
      user_id,
      user_type as 'filmmaker' | 'distributor' | 'platform'
    );

    console.log('[v0] Wallet created successfully:', {
      user_id,
      wallet_address: walletResult.walletAddress,
      user_type,
    });

    return Response.json(
      {
        success: true,
        message: 'Wallet created successfully',
        data: {
          wallet_address: walletResult.walletAddress,
          user_id: walletResult.userId,
          user_type: walletResult.userType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Wallet creation error:', error);
    return Response.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
