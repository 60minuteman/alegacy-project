import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export function authMiddleware(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const sessionId = req.headers.get('X-Raven-Session-ID');
    const email = req.headers.get('X-User-Email');

    if (!email) {
      return NextResponse.json({ message: 'User email required' }, { status: 400 });
    }

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        // Existing user - no need to check session ID
        (req as any).userId = user.id;
        (req as any).isNewUser = false;
      } else {
        // New user - check session ID
        if (!sessionId) {
          return NextResponse.json({ message: 'Session ID required for new users' }, { status: 400 });
        }
        (req as any).sessionId = sessionId;
        (req as any).isNewUser = true;
      }

      (req as any).userEmail = email;

      return handler(req);
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
    }
  };
}
