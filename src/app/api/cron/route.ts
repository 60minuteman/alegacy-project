import { NextResponse } from 'next/server';
import { processPendingRegistrations } from '../process-pending-registrations/route';
import { supabase } from '@/types/supabase';

export const runtime = 'edge';

export async function GET() {
  try {
    const result = await processPendingRegistrations();
    return NextResponse.json({ status: 'success', message: 'Cron job executed successfully', result });
  } catch (error) {
    console.error('Error executing cron job:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to execute cron job' }, { status: 500 });
  }
}

if (process.env.NODE_ENV !== 'development') {
  setInterval(async () => {
    try {
      await fetch('/api/cron', { method: 'GET' });
      console.log('Cron job executed');
    } catch (error) {
      console.error('Error executing cron job:', error);
    }
  }, 5 * 60 * 1000); // Run every 5 minutes
}