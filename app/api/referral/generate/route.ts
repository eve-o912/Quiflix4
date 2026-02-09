import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filmId } = await req.json();

    if (!filmId) {
      return Response.json({ error: 'filmId is required' }, { status: 400 });
    }

    // Check if distributor exists
    const { data: distributor } = await supabase
      .from('distributors')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!distributor) {
      return Response.json(
        { error: 'Only approved distributors can generate referral links' },
        { status: 403 }
      );
    }

    // Generate unique referral code
    const referralCode = `ref_${user.id.slice(0, 8)}_${filmId.slice(0, 8)}_${Math.random().toString(36).substring(2, 8)}`;

    // Check if DDT holding exists
    const { data: holding } = await supabase
      .from('ddt_holdings')
      .select('id, personalized_link')
      .eq('distributor_id', user.id)
      .eq('film_id', filmId)
      .single();

    if (!holding) {
      return Response.json(
        { error: 'You do not have DDT for this film' },
        { status: 403 }
      );
    }

    // Generate personalized link
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://quiflix.app';
    const referralLink = `${domain}/films/${filmId}?ref=${referralCode}`;

    // Store referral code in ddt_holdings if not already exists
    if (!holding.personalized_link) {
      await supabase
        .from('ddt_holdings')
        .update({ personalized_link: referralLink })
        .eq('id', holding.id);
    }

    return Response.json(
      {
        success: true,
        referralCode,
        referralLink,
        shortLink: `${domain}/r/${referralCode}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Error generating referral link:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all referral links for user's DDTs
    const { data: holdings } = await supabase
      .from('ddt_holdings')
      .select('id, film_id, personalized_link, sales_attributed, earned_amount')
      .eq('distributor_id', user.id);

    return Response.json(
      {
        success: true,
        referralLinks: holdings || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error fetching referral links:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
