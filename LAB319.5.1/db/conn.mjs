import mongoose from 'mongoose';

const connectionString = process.env.ATLAS_URI || '';
console.log(connectionString);
export default async function connectToDb() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
}


