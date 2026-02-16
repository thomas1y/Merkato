
import mongoose from 'mongoose';

// Get database URL from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// If no database URL is found, stop the app (can't work without DB)
if (!MONGODB_URI) {
  throw new Error(
    'Please define MONGODB_URI in .env.local'
  );
}


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we already have a connection, use it
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  // If no connection exists, create one
  if (!cached.promise) {
    console.log('🔄 Connecting to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, 
    }).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  // Wait for connection to complete
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset on error
    throw e;
  }

  return cached.conn;
}

export default connectDB;