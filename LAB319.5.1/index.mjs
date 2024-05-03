import express from 'express';

import 'dotenv/config';
import connectToDb from './db/conn.mjs';


const PORT = process.env.PORT || 5050;
const app = express();
connectToDb();


import Grades from './models/grades.js';


// Find invalid documents.
app.get("/", (req, res) => {
 res.send('Hello! You successfully connect to API!')
});

app.get('/grades', async (req, res) => {
  try {
      const result = await Grades.find({});
      if (result.length > 0) {
          res.send(result);
      } else {
          res.status(404).send({ message: 'No daily grades data found!' });
      }
  } catch (err) {
      console.error('Error retrieving daily health data:', err);
      next(err); // Properly pass the error to the Express error handler
  }
});


app.get('/grades/:id', async (req, res) => {
  const id = req.params.id
  try {
      const result = await Grades.find({_id: id});
      if (result.length > 0) {
          res.send(result);
      } else {
          res.status(404).send({ message: 'No daily grades data found!' });
      }
  } catch (err) {
      console.error('Error retrieving daily health data:', err);
      next(err); // Properly pass the error to the Express error handler
  }
});


// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
