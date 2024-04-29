import express from "express";
import 'dotenv/config';
import db from "./db/conn.mjs";
import { ObjectId } from "mongodb";
const PORT = 5050;
const app = express();

async function createSingleFieldIndexes() {
  try {
      const collection = await db.collection("grades");

      // Create an index on class_id
      const indexClassId = await collection.createIndex({ class_id: 1 });
      console.log(`Index created on class_id: ${indexClassId}`);

      // Create an index on learner_id
      const indexLearnerId = await collection.createIndex({ learner_id: 1 }); 
      console.log(`Index created on learner_id: ${indexLearnerId}`);
  } catch (error) {
      console.error('Error creating indexes: ', error);
  }
}

async function createCompoundIndex() {
  try {
      const collection = await db.collection("grades");

      // Create a compound index on learner_id and class_id
      const compoundIndex = await collection.createIndex({ learner_id: 1, class_id: 1 }); 
      console.log(`Compound index created on learner_id and class_id: ${compoundIndex}`);
  } catch (error) {
      console.error('Error creating compound index:', error);
  }
}

createSingleFieldIndexes();
createCompoundIndex();

app.use(express.json());
//console.log('Hello!', process.env.At)
// The schema
const learnerSchema = {
  // Use the $jsonSchema operator
  $jsonSchema: {
    bsonType: "object",
    title: "Learner Validation",
    // List required fields
    required: ["name", "enrolled", "year", "campus"],
    // Properties object contains document fields
    properties: {
      name: {
        // Each document field is given validation criteria
        bsonType: "string",
        // and a description that is shown when a document fails validation
        description: "'name' is required, and must be a string",
      },
      enrolled: {
        bsonType: "bool",
        description: "'enrolled' status is required and must be a boolean",
      },
      year: {
        bsonType: "int",
        minimum: 1995,
        description:
          "'year' is required and must be an integer greater than 1995",
      },
      avg: {
        bsonType: "double",
        description: "'avg' must be a double",
      },
      campus: {
        enum: [
          "Remote",
          "Boston",
          "New York",
          "Denver",
          "Los Angeles",
          "Seattle",
          "Dallas",
        ],
        description: "Invalid campus location",
      },
    },
  },
};

//Create a GET route at /grades/stats
app.get('/grades/stats', async (req, res) => {

  let collection = await db.collection("grades");
  let result = await collection.aggregate([
    {
        $project: {
            avg: { $avg: "$scores.score" },
        },
    },
    {
        $group: {
            _id: null,
            totalLearners: { $sum: 1 },
            learnersAbove70: {
                $sum: {
                    $cond: [{ $gt: ["$avg", 70] }, 1, 0],
                },
            },
        },
    },
    {
        $project: {
            _id: 0,
            "Number of Learners With Grade Above 70": "$learnersAbove70",
            "Total Number of Learners": "$totalLearners",
            "Percentage of Learners With Grade Above 70": {
                $multiply: [
                    { $divide: ["$learnersAbove70", "$totalLearners"] },
                    100,
                ],
            },
        },
    },
]).toArray();
  res.send(result); 
})

app.get('/grades/stats/:id', async(req,res) => {
  const class_id_params = req.params.id;


  let collection = await db.collection("grades");
  let result = await collection.aggregate([

    {
      $match: {
       class_id: Number(class_id_params),
      } 
    },
    {
      $project: {
          avg: { $avg: "$scores.score" },
      },
  },
  {
      $group: {
          _id: null,
          totalLearners: { $sum: 1 },
          learnersAbove70: {
              $sum: {
                  $cond: [{ $gt: ["$avg", 70] }, 1, 0],
              },
          },
      },
  },
  {
      $project: {
          _id: 0,
          "Number of Learners With Grade Above 70": "$learnersAbove70",
          "Total Number of Learners": "$totalLearners",
          "Percentage of Learners With Grade Above 70": {
              $multiply: [
                  { $divide: ["$learnersAbove70", "$totalLearners"] },
                  100,
              ],
          },
      },
  }
  ]).toArray();

  res.send(result);
})


app.use(async (req,res, next) => {

try {
  const result = await collection.createIndex({ class_id: 1 }); 
  console.log(`Index created: ${result}`);
} catch (error) {
  next(console.error('Error creating index:', error));
} finally {
  await next(client.close());
}
})

// Find invalid documents.
app.get("/", async (req, res) => {
  let collection = await db.collection("learners");

  let result = await collection.find({ $nor: [learnerSchema] }).toArray();
  res.send(result).status(204);
});

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
