import dns from 'node:dns';
import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is missing from backend/.env');
  }

  mongoose.set('strictQuery', true);
  dns.setServers(['1.1.1.1', '8.8.8.8']);

  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
