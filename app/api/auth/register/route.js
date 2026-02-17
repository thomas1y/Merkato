import { NextResponse } from 'next/server';
import connectDB from '@/app/lib-backend/db/connect';
import User from '@/app/lib-backend/db/models/User';
import generateToken from '@/app/lib-backend/utils/generateToken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    
    await connectDB();

    
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all fields' },
        { status: 400 } 
      );
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    
    const user = await User.create({
      name,
      email,
      password 
    });

    
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
      message: 'Registration successful',
      user, 
      token 
    }, { status: 201 }); 

  } catch (error) {
   
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 } 
    );
  }
}