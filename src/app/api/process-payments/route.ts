import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    // Retrieve the user's information from the pending_registrations table
    const result = await db.query(
      'SELECT * FROM pending_registrations WHERE session_id = $1',
      [sessionId]
    );

    if (result.rows.length > 0) {
      const userInfo = result.rows[0];
      // You can optionally delete the record from pending_registrations here
      // or keep it for reference and add a 'payment_confirmed' column

      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        data: {
          userInfo: {
            email: userInfo.email,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            phone: userInfo.phone,
          },
        },
      });
    } else {
      return NextResponse.json({ status: 'error', message: 'User information not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }
}
