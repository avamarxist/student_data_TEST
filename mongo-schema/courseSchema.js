const mongoose = require('mongoose');
const { Schema } = mongoose;

const Student = require('./studentSchema');
const Staff = require('./staffSchema');

const courseSchema = new Schema({
    schoolYear: {type: Number, min: 2020},
    term: {type: Number, min: 1, max: 7},
    status: {type: String, default: "active"},
    codes: [{type: String}],
    name: {type: String},
    staff: [{type: Schema.Types.ObjectId, ref: Staff}],
    roster: [{
        student_id: {type: Schema.Types.ObjectId, ref: Student}, 
        code: {type: String}, 
        status: {type: String, default: "active"}
    }]
}, {timestamps: true, strict: "throw"});

module.exports = mongoose.model('course', courseSchema);