const mongoose = require('mongoose');
const { Schema } = mongoose;

const Course = require('../mongo-schema/courseSchema');
const Comment = require('../mongo-schema/commentSchema');

const staffSchema = new Schema({
    status: {
        type: String,
        default: "active",
        lowercase: true,
        enum: ["active", "on leave", "inactive"]
    },
    lName: {type: String},
    fName: {type: String},
    roles: [{type: String}],
    mainEmail: {type: String},
    room: {type: String},
    organization: {type: String},
    mainEmail: {type: String},
    phoneExt: {type: String},
    courses: [{type: Schema.Types.ObjectId, ref: 'Course'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {collection: "staff", timestamps: true, strict: "throw"})

module.exports = mongoose.model('Staff', staffSchema);