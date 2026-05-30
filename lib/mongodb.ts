import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI not defined in .env.local');
}

declare global {
  var _mongooseConn: typeof mongoose | null;
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

let cached = {
  conn: global._mongooseConn ?? null,
  promise: global._mongoosePromise ?? null,
};

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'digital_profile',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  global._mongooseConn = cached.conn;
  global._mongoosePromise = cached.promise;
  return cached.conn;
}
