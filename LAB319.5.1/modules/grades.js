const mongoose = require ('mongoose');
const Schema = new mongoose.Schema();

const gradesSchema = new mongoose.Schema ({

})

const Grades = mongoose.model('Grades', gradesSchema );
module.exports = Grades;