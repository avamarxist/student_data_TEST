const mongoose = require('mongoose');
const { Schema } = mongoose;

const Staff = require('../mongo-schema/staffSchema');
const Course = require('../mongo-schema/courseSchema');
const Student = require('../mongo-schema/studentSchema');

const attendanceSchema = new Schema({
    date: {type: Date},
    staff: {type: Schema.Types.ObjectId, ref: 'Staff'},
    class: {type: Schema.Types.ObjectId, ref: 'Course'},
    student: {type: Schema.Types.ObjectId, ref: 'Student'},
    attCode: {type: String, enum: ['p', 'b', 'a', 'e', 'l']},
}, {timestamps: true, strict: 'throw'});

module.exports = mongoose.model('attendance', attendanceSchema);