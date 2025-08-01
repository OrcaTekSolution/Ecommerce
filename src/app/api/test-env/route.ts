import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Just test environment variables first
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    const hasAzureStorage = !!process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: {
        DATABASE_URL: hasDbUrl,
        NEXTAUTH_SECRET: hasNextAuthSecret,
        NEXTAUTH_URL: hasNextAuthUrl,
        AZURE_STORAGE_CONNECTION_STRING: hasAzureStorage,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL
      },
      dbUrlFormat: hasDbUrl ? process.env.DATABASE_URL?.substring(0, 50) + '...' : 'missing'
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
