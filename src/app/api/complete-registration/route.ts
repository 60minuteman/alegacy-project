import { NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/authMiddleware';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { userId, ...userData } = await req.json();

    const { data, error } = await supabase
      .from('User')
      .update(userData)
      .eq('id', userId)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ success: false, message: 'Error completing registration' }, { status: 500 });
  }
}
