import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib-backend/db/connect';
import User from '@/app/lib-backend/db/models/User';

export async function getUserFromToken(request) {
  try {
    
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    
    if (!token) return null;

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    return user;
  } catch (error) {
    
    return null;
  }
}


export function withAuth(handler) {
  return async (request) => {
    
    const user = await getUserFromToken(request);
    
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    
    request.user = user;
    
    
    return handler(request);
  };
}