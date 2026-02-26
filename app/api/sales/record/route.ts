import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { QuiflixContract } from '@/lib/blockchain/contract-interactions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { filmId, distributorId, saleAmount, buyerEmail } = await request.json();

    // Validate required fields
    if (!filmId || !distributorId || !saleAmount || !buyerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize contract
    const contract = new QuiflixContract(/* signer */); // You'll need to get signer from admin wallet

    // Record sale on blockchain
    const txHash = await contract.recordSaleAndDistributeRevenue(
      filmId,
      distributorId,
      saleAmount.toString()
    );

    // Store sale record in database
    const { data: saleRecord, error: saleError } = await supabase
      .from('sales')
      .insert({
        film_id: filmId,
        distributor_id: distributorId,
        sale_amount: saleAmount,
        buyer_email: buyerEmail,
        transaction_hash: txHash,
        status: 'completed',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saleError) {
      console.error('Database error:', saleError);
      return NextResponse.json(
        { error: 'Failed to record sale in database' },
        { status: 500 }
      );
    }

    // Get film details for notification
    const { data: film } = await supabase
      .from('films')
      .select('title, filmmaker_email')
      .eq('id', filmId)
      .single();

    // Get distributor details
    const { data: distributor } = await supabase
      .from('distributors')
      .select('company_name, email')
      .eq('id', distributorId)
      .single();

    // Send notifications (you can implement email notifications here)
    console.log(`Sale recorded: Film "${film?.title}" sold by ${distributor?.company_name}`);

    return NextResponse.json({
      success: true,
      saleRecord,
      transactionHash: txHash,
      message: 'Sale recorded and revenue distributed successfully',
    });

  } catch (error) {
    console.error('Sale recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record sale' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distributorId = searchParams.get('distributorId');
    const filmId = searchParams.get('filmId');

    let query = supabase
      .from('sales')
      .select(`
        *,
        films(title),
        distributors(company_name)
      `)
      .order('created_at', { ascending: false });

    if (distributorId) {
      query = query.eq('distributor_id', distributorId);
    }

    if (filmId) {
      query = query.eq('film_id', filmId);
    }

    const { data: sales, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sales' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sales });

  } catch (error) {
    console.error('Sales fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}
