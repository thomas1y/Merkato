import { NextResponse } from 'next/server';
import connectDB from '@/app/lib-backend/db/connect';
import User from '@/app/lib-backend/db/models/User';
import generateToken from '@/app/lib-backend/utils/generateToken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    
    await connectDB();

    
    const { email, password } = await request.json();

    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    
    const user = await User.findOne({ email }).select('+password');
    
    
    if (!user) {
      
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 } 
      );
    }

    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    
    const token = generateToken(user._id);

    
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, 
      path: '/',
    });

    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}