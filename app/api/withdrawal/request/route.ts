import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, stablecoin, amountKes, mpesaPhone, mpesaName } = await req.json();

    // Validate inputs
    if (!amount || amount <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!mpesaPhone || mpesaPhone.length < 10) {
      return Response.json({ error: 'Invalid M-Pesa phone number' }, { status: 400 });
    }

    if (!mpesaName) {
      return Response.json({ error: 'M-Pesa account name is required' }, { status: 400 });
    }

    // Check if user has sufficient balance
    const { data: payouts } = await supabase
      .from('revenue_payouts')
      .select('filmmaker_share, distributor_share')
      .or(`filmmaker_id.eq.${user.id},distributor_id.eq.${user.id}`);

    const totalBalance = payouts?.reduce((sum, p) => {
      return sum + (p.filmmaker_share || p.distributor_share || 0);
    }, 0) || 0;

    if (amount * 100 > totalBalance) {
      return Response.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create withdrawal record
    const { data: withdrawal, error: createError } = await supabase
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount: amount * 100, // Store in cents
        amount_kes: amountKes,
        stablecoin,
        mpesa_phone: mpesaPhone,
        mpesa_name: mpesaName,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select();

    if (createError) {
      console.error('[v0] Error creating withdrawal:', createError);
      return Response.json(
        { error: 'Failed to create withdrawal request' },
        { status: 500 }
      );
    }

    // Send to Pretium for processing if they have an API for payouts
    try {
      const pretiumResponse = await fetch('https://api.pretium.africa/v1/payouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRETIUM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountKes,
          phone: mpesaPhone,
          name: mpesaName,
          currency: 'KES',
          reference: withdrawal[0].id,
        }),
      });

      if (pretiumResponse.ok) {
        const pretiumData = await pretiumResponse.json();
        await supabase
          .from('withdrawals')
          .update({ status: 'processing', pretium_transaction_id: pretiumData.transaction_id })
          .eq('id', withdrawal[0].id);
      }
    } catch (error) {
      console.error('[v0] Error processing with Pretium:', error);
      // Continue anyway - mark as pending for manual processing
    }

    return Response.json(
      {
        success: true,
        withdrawal: withdrawal[0],
        message: 'Withdrawal request submitted. You will receive M-Pesa payment within 2-4 hours.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Error handling withdrawal:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
