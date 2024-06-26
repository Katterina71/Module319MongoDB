// import express from 'express';

import { MongoClient } from 'mongodb';

const connectionString = process.env.ATLAS_URI || ''
const client = new MongoClient(connectionString);

let conn;

try {
 conn = await client.connect();
}
catch(err) {
    console.log(err);
}

let db = conn.db('sample_training');

export default db;