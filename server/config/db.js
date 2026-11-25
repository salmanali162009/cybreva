// ─────────────────────────────────────────────
//  Cybreva — MongoDB connection
// ─────────────────────────────────────────────
import mongoose from 'mongoose';

const connectDB = async (retries = 3, delayMs = 2000) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`[MongoDB] Connection attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

export default connectDB;
