const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    osis: String,
    status: {
        type: String,
        default: "active",
        enum: ["active", "withdrawn", "graduated"]
    },
    lName: String,
    fName: String,
    level: Number,
    doeEmail: String,
    contacts: [String],
    relations: [{lName: String, fName: String, relation: String, contact: String}],
    activeCourses: [Schema.Types.ObjectId],
    attendancePct: Number,
    lastModified: Date
});

const teacherSchema = new Schema({
    status: {
        type: String,
        default: "active",
        enum: ["active", "on leave", "inactive"]
    },
    lName: String,
    fName: String,
    doeEmail: String,
    phoneExt: String,
    activeCourses: [Schema.Types.ObjectId],
});

const courseSchema = new Schema({
    schoolYear: {type: Number, min: 2020},
    term: {type: Number, min: 1, max: 7},
    status: {type: String, default: "active"},
    codes: [String],
    name: String,
    teachers: [Schema.Types.ObjectId],
    roster: [{
        student_id: Schema.Types.ObjectId, 
        code: String, 
        status: {type: String, default: "active"}
    }]
});

const student = mongoose.model('student', studentSchema);
const teacher = mongoose.model('teacher', teacherSchema);
const course = mongoose.model('course', courseSchema);

module.exports = {student, teacher, course};