const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isDeleted : {
        type: Boolean,
        default: false
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('user', userSchema);
