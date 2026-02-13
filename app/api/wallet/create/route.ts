import { createClient } from '@/lib/supabase/server';
import { createWallet } from '@/lib/wallet/create-wallet';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, user_type, email, first_name, last_name } = body;

    if (!user_id || !user_type || !email) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['filmmaker', 'distributor', 'buyer'].includes(user_type)) {
      return Response.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if wallet already exists
    const { data: existingWallet, error: fetchError } = await supabase
      .from('wallets')
      .select('id, wallet_address')
      .eq('user_id', user_id)
      .single();

    if (!fetchError && existingWallet) {
      console.log('[v0] Wallet already exists for user:', user_id);
      return Response.json(
        {
          success: true,
          message: 'Wallet already exists',
          data: existingWallet,
        },
        { status: 200 }
      );
    }

    // Create new wallet
    console.log('[v0] Creating wallet for user:', {
      user_id,
      user_type,
      email,
    });

    const wallet = await createWallet(user_id, user_type);

    if (!wallet || !wallet.address) {
      return Response.json(
        { error: 'Failed to create wallet' },
        { status: 500 }
      );
    }

    // Save wallet to database
    const { data, error } = await supabase
      .from('wallets')
      .insert({
        user_id,
        wallet_address: wallet.address,
        user_type,
        balance_usdс: 0,
        balance_usdt: 0,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('[v0] Error saving wallet to database:', error);
      return Response.json(
        { error: 'Failed to save wallet' },
        { status: 500 }
      );
    }

    console.log('[v0] Wallet created successfully:', {
      user_id,
      wallet_address: wallet.address,
      user_type,
    });

    return Response.json(
      {
        success: true,
        message: 'Wallet created successfully',
        data: {
          id: data[0]?.id,
          wallet_address: wallet.address,
          user_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Wallet creation error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
