const mongoose = require('mongoose');
const { Schema } = mongoose;

const Course = require('../mongo-schema/courseSchema');
const Comment = require('../mongo-schema/commentSchema');

const studentSchema = new Schema({
    osis: {type: Number},
    status: {
        type: String,
        default: "active",
        lowercase: true,
        enum: ["active", "withdrawn", "graduated"]
    },
    lName: {type: String},
    fName: {type: String},
    level: {type: Number},
    doeEmail: {type: String},
    contacts: [{type: String}],
    relations: [{
        lName: {type: String}, 
        fName: {type: String}, 
        relation: {type: String}, 
        contact: {type: String}
    }],
    courses: [{
        courseId: {type: Schema.Types.ObjectId, ref: 'Course'},
        status: {type: String, lowercase: true, enum: ["active", "removed", "completed", "incomplete"]}
    }],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    gradCohort: {type: String, uppercase: true, enum: ["U", "V", "W", "X"]},
    learningCohort: {type: String, lowercase: true, enum: ["remote", "hybrid a", "hybrid b"]},
    attendancePct: {type: Number}
}, {timestamps: true, strict: "throw"});

module.exports = mongoose.model('Student', studentSchema);