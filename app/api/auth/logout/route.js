import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    
    cookies().set({
      name: 'token',
      value: '',
      expires: new Date(0), // Set to epoch time (1970-01-01)
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Error during logout' 
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  return POST(); 
}