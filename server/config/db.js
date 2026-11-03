// ─────────────────────────────────────────────
//  Cybreva — MongoDB connection
// ─────────────────────────────────────────────
import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  const conn = await mongoose.connect(uri, {
    // Mongoose 9 no longer needs useNewUrlParser / useUnifiedTopology
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
