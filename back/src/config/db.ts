import mongoose from 'mongoose';
import { ENV } from './env';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(ENV.MONGO_URI, {
    // opciones por defecto modernas
  });
  console.log('✅ MongoDB conectado');
}
