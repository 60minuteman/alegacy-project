import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    // Your existing code...

    // Replace Prisma queries with Supabase queries
    const { data: pendingRegistrations, error } = await supabase
      .from('PendingRegistration')
      .select('*')
      .eq('paymentStatus', 'PAID');

    if (error) throw error;

    // Process the pendingRegistrations...

    return NextResponse.json({ success: true, message: 'Payments processed successfully' });
  } catch (error) {
    console.error('Error processing payments:', error);
    return NextResponse.json({ success: false, message: 'Error processing payments' }, { status: 500 });
  }
}
