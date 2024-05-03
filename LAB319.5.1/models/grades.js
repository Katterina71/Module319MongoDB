import mongoose from "mongoose";

const Schema = mongoose.Schema;

const scoreSchema = new Schema (
  {
    "type": {
      "type": "String",
      required: true,
      
    },
    "score": {
      "type": "Number",
      required: true,
    }
  },
  { _id: false}
)

const gradesSchema = new Schema({
  
    "scores": [scoreSchema],
    "class_id": {
      "type": "Number",
      required: true,
    },
    "learner_id": {
      "type": "Number",
      required: true,
    }
  } 
);

export default mongoose.model('grades', gradesSchema);
