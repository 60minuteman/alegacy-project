import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log('Login attempt for email:', email);

    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;

    if (data) {
      console.log('User found:', data);
      return NextResponse.json({
        success: true,
        user: data,
      });
    } else {
      console.log('User not found');
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
