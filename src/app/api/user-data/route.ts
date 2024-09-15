import { NextResponse } from 'next/server';

export async function GET() {
  // Replace this with your actual data fetching logic
  const userData = { name: 'John Doe', email: 'john@example.com' };
  return NextResponse.json(userData);
}
