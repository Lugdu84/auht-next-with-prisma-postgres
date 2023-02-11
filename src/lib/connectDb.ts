import mongoose from 'mongoose'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env file'
  )
}

const { DATABASE_URL } = process.env

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalWithMongoose = global as typeof globalThis & { mongoose: any }

let cached = globalWithMongoose.mongoose

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  cached = globalWithMongoose.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable mongoose buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = mongoose
      .connect(DATABASE_URL, options)
      // eslint-disable-next-line no-shadow
      .then((mongoose) => mongoose)
      .catch((error) => {
        throw new Error(error)
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
