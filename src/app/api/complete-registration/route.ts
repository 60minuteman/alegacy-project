import { NextResponse } from 'next/server';
import { supabase } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('User')
      .update(updateData)
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ success: false, message: 'Error completing registration' }, { status: 500 });
  }
}
