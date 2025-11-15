const mongoose = require('mongoose');

const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  throw new Error('MONGODB_URI belum diset di environment.');
}

// Cache di global supaya koneksi direuse antar invocation
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => {
      m.connection.on('error', (err) => console.error('[Mongo error]', err));
      m.connection.on('connected', () => console.log('[Mongo connected]'));
      m.connection.on('disconnected', () => console.warn('[Mongo disconnected]'));
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;