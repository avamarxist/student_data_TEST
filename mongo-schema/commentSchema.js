const mongoose = require('mongoose');
const { Schema } = mongoose;

const Staff = require('../mongo-schema/staffSchema');
const Student = require('../mongo-schema/studentSchema');

const commentSchema = new Schema({
    staff: [{type: Schema.Types.ObjectId, required: true, ref: 'Staff'}],
    student: [{type: Schema.Types.ObjectId, required: true, ref: 'Student'}],
    note: {type: String, maxlength: 1000},
}, {timestamps: true, strict: "throw"});

module.exports = mongoose.model('comment', commentSchema);