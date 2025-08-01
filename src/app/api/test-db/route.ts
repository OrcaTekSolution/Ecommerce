import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Simple connection test
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    // Test users table
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // Test categories table
    const categoryCount = await prisma.category.count();
    console.log('Category count:', categoryCount);
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      users: userCount,
      categories: categoryCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
