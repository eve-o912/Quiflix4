import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { referralCode, filmId, saleAmount, buyerEmail, paymentId } = await req.json();

    if (!referralCode || !filmId || !saleAmount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract distributor ID from referral code
    // Format: ref_USERID_FILMID_RANDOM
    const distributorIdPart = referralCode.split('_')[1];

    // Find the distributor
    const { data: distributors } = await supabase
      .from('distributors')
      .select('id')
      .like('id', `${distributorIdPart}%`);

    if (!distributors || distributors.length === 0) {
      return Response.json({ error: 'Invalid referral code' }, { status: 400 });
    }

    const distributorId = distributors[0].id;

    // Get DDT holding
    const { data: holding } = await supabase
      .from('ddt_holdings')
      .select('id')
      .eq('distributor_id', distributorId)
      .eq('film_id', filmId)
      .single();

    if (!holding) {
      return Response.json({ error: 'DDT holding not found' }, { status: 400 });
    }

    // Calculate distributor share (20%)
    const distributorEarnings = saleAmount * 0.2;

    // Record the sale
    const { data: sale, error: saleError } = await supabase
      .from('sales_records')
      .insert({
        film_id: filmId,
        distributor_id: distributorId,
        ddt_holding_id: holding.id,
        sale_amount: saleAmount,
        buyer_email: buyerEmail,
        payment_method: 'crypto_or_mpesa',
        payment_id: paymentId,
      })
      .select();

    if (saleError) {
      console.error('[v0] Error recording sale:', saleError);
      return Response.json({ error: 'Failed to record sale' }, { status: 500 });
    }

    // Update DDT holding with earnings
    await supabase
      .from('ddt_holdings')
      .update({
        sales_attributed: (holding.sales_attributed || 0) + saleAmount,
        earned_amount: (holding.earned_amount || 0) + distributorEarnings,
      })
      .eq('id', holding.id);

    // Create revenue payout record
    await supabase
      .from('revenue_payouts')
      .insert({
        film_id: filmId,
        distributor_id: distributorId,
        sale_id: sale[0].id,
        filmmaker_share: saleAmount * 0.7,
        distributor_share: distributorEarnings,
        goodflix_share: saleAmount * 0.1,
        total_sale_amount: saleAmount,
      });

    return Response.json(
      {
        success: true,
        message: 'Sale tracked successfully',
        distributorEarnings,
        saleId: sale[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Error tracking referral:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
