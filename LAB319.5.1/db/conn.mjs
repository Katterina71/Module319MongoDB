import { MongoClient } from "mongodb";
import mongoose from "mongoose";
// console.log(process.env.ATLAS_URI)
const client = new MongoClient(process.env.ATLAS_URI);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("sample_training");

export default db;



