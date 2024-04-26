import express from "express";
import db from '../db/conn.mjs';

import {ObjectId } from 'mongodb';


const router = express.Router();

// Get a single grade data
router.get('/:id', async (req,res) => {
    let collection = await  db.collection('grades');
    let query = { _id: new ObjectId(req.params.id)}

    let result = await collection.findOne(query);

    res.send(result).status(200);
})

//// Get a single grade single student 
router.get('/student/:id', async (req,res) => {
    let collection = await  db.collection('grades');
    let query = { learner_id: Number(req.params.id)}
    let result = await collection.find(query).toArray();

    if (!result) {
        res.send('Not Found').status(404)
    }
    else {
        res.send(result).status(200);
    }
})


//// Get data for a specific class
router.get('/class/:id', async (req,res) => {
    let collection = await  db.collection('grades');
    let query = { class_id: Number(req.params.id)};
    // console.log(typeof req.params.id)
    let result = await collection.find(query).toArray();
    // console.log(typeof query.class_id)

    if (!result) {
        res.send('Not Found').status(404);
    }
    else {
        res.send(result).status(200);
    }
})


router.post('/', async (req, res)=> {
    let collection = await db.collection('grades');
    let newDocument = req.body;
    
    if (newDocument.student_id) {
        newDocument.learner_id = newDocument.student_id;
        delete newDocument.student_id;
    }

    let result = await collection.insertOne(newDocument);
    res.send(result).status(204)
})

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { _id: new ObjectId(req.params.id) };
  
    let result = await collection.updateOne(query, {
      $push: { scores: req.body },
    });
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

  // Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { _id: new ObjectId(req.params.id) };
  
    let result = await collection.updateOne(query, {
      $pull: { scores: req.body },
    });
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

  // Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
    res.redirect(`learner/${req.params.id}`);
  });

  // Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { learner_id: Number(req.params.id) };
  
    let result = await collection.deleteOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

export default router