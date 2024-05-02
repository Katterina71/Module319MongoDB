import express from 'express';
import 'dotenv/config';
import connectToDb from './db/conn.mjs';


const PORT = process.env.PORT || 5050;
const app = express();
connectToDb();


import Grades from './models/grades.js';


// Find invalid documents.
app.get("/", async (req, res) => {
  let grades = Grades.find()
  res.send(grades).status(200);
});


app.get("/passing", async (req, res) => {

  let result = await Grades.findPassing();
  res.send(result);
});

app.get("/:id", async (req, res) => {

  try {
    let result = await Grades.findById(req.params.id);
    res.send(result);
  } catch {
    res.send("Invalid ID").status(400);
  }
});


app.get('/grades', (req,res) => {
  console.log(Grades);
  res.send('Hello!');
})




// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
