const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    osis: {type: Number},
    status: {
        type: String,
        default: "active",
        enum: ["active", "withdrawn", "graduated"]
    },
    lName: {type: String},
    fName: {type: String},
    level: {type: Number},
    doeEmail: {type: String},
    contacts: [{type: String}],
    relations: [{lName: {type: String}, fName: {type: String}, relation: {type: String}, contact: {type: String}}],
    activeCourses: [{type: Schema.Types.ObjectId}],
    comments: [{type: Schema.Types.ObjectId}],
    attendancePct: {type: Number}
}, {timestamps: true, strict: "throw"});

module.exports = mongoose.model('student', studentSchema);