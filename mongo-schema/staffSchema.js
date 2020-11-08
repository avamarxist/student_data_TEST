const mongoose = require('mongoose');
const { Schema } = mongoose;

const Course = require('../mongo-schema/courseSchema')

const staffSchema = new Schema({
    status: {
        type: String,
        default: "active",
        enum: ["active", "on leave", "inactive"]
    },
    lName: {type: String},
    fName: {type: String},
    doeEmail: {type: String},
    phoneExt: {type: String},
    courses: [{type: Schema.Types.ObjectId, ref: Course}],
}, {collection: "staff", timestamps: true, strict: "throw"})

module.exports = mongoose.model('Staff', staffSchema);