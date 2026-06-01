import dns from 'node:dns';
import mongoose from 'mongoose';

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalWithMongoose.mongooseCache ?? {
  connection: null,
  promise: null
};

globalWithMongoose.mongooseCache = cache;

export async function connectDatabase() {
  if (cache.connection) {
    return cache.connection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not configured.');
  }

  dns.setServers(['1.1.1.1', '8.8.8.8']);

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false
  });
  cache.connection = await cache.promise;
  return cache.connection;
}
