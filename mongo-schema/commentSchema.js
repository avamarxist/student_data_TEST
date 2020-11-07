const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    staff: [{type: Schema.Types.ObjectId, required: true}],
    student: [{type: Schema.Types.ObjectId, required: true}],
    note: {type: String, maxlength: 1000},
}, {timestamps: true, strict: "throw"});

module.exports = mongoose.model('comment', commentSchema);