import { NextResponse } from 'next/server';
import { getSupabase } from '@/types/supabase';

export async function POST(req: Request) {
  const supabase = getSupabase();
  try {
    const { sessionId } = await req.json();

    // Replace Prisma query with Supabase query
    const { data: pendingRegistration, error } = await supabase
      .from('PendingRegistration')
      .select('*')
      .eq('sessionId', sessionId)
      .single();

    if (error) throw error;

    if (!pendingRegistration) {
      return NextResponse.json({ success: false, message: 'No pending registration found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paymentStatus: pendingRegistration.paymentStatus,
      message: pendingRegistration.paymentStatus === 'PAID' ? 'Payment successful' : 'Payment pending'
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ success: false, message: 'Error checking payment status' }, { status: 500 });
  }
}