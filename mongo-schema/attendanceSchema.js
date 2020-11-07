const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    date: {type: Date},
    staff: {type: Schema.Types.ObjectId},
    class: {type: Schema.Types.ObjectId},
    student: {type: Schema.Types.ObjectId},
    attCode: {type: String, enum: ['P', 'B', 'L', 'A', 'E']},
});

module.exports = mongoose.model('attendance', attendanceSchema);