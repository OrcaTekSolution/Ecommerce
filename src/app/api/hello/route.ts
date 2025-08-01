import { NextResponse } from 'next/server';

// Simple test route that should work without authentication
export async function GET() {
  return NextResponse.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}
