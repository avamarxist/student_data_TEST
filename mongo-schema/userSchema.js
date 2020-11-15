const mongoose = require('mongoose');
const { Schema } = mongoose;

const Staff = require('./staffSchema');

const userSchema = new Schema({
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"]
    },
    google_id: {type: String, required: true},
    staff_id: {type: Schema.Types.ObjectId, required: true, ref: 'Staff'},
    role: [{type: String, required: true, enum: ["admin", "staff", "teacher"]}],
    logins: [{type: Date}]
}, {collection: "users", timestamps: true, strict: "throw"})

module.exports = mongoose.model('User', userSchema);