import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/app/lib-backend/middleware/auth';

export async function GET(request) {
  try {

    const user = await getUserFromToken(request);
    
    
    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 } 
      );
    }

    
    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}