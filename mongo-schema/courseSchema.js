const mongoose = require('mongoose');
const { Schema } = mongoose;

const Student = require('./studentSchema');
const Staff = require('./staffSchema');

const courseSchema = new Schema({
    schoolYear: {type: Number, min: 2020, required: true},
    term: {type: Number, min: 1, max: 7, required: true},
    status: {type: String, default: "active"},
    code: {type: String},
    courseName: {type: String, required: true},
    classAlias: {type: String},
    section: {type: Number, min: 1, max: 10},
    period: {type: Number, min: 1, max: 7},
    staff: [{type: Schema.Types.ObjectId, ref: 'Staff' }],
    students: [{
        student_id: {type: Schema.Types.ObjectId, ref: 'Student'}, 
        status: {type: String, default: "active"},
        startDate: {type: Date},
        endDate: {type: Date}
    }],
    special: [{type: String}],
    startDate: {type: Date},
    endDate: {type: Date}
}, {timestamps: true, strict: "throw"});

module.exports = mongoose.model('Course', courseSchema);