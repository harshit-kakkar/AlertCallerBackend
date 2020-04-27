const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    linked: {
        type: Array,
        default: []
    },
    sent: {
        type: Array,
        default: []
    },
    recieved: {
        type: Array,
        default: []
    }
})


module.exports = mongoose.model('Users', UserSchema)