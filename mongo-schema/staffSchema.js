const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    activeCourses: [Schema.Types.ObjectId],
}, {collection: "staff", timestamps: true, strict: "throw"})

module.exports = mongoose.model('staff', staffSchema);