import { NextResponse } from 'next/server';
import { verifyToken } from './auth'; // You'll need to implement this function

export function authMiddleware(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    try {
      const decoded = await verifyToken(token);
      (req as any).userId = decoded.userId;
      return handler(req);
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
  };
}
