const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    password: {
        type: String
    },
    wallet: {
        type: Number,
        default: 1000
    }
});

module.exports = User = mongoose.model('user', UserSchema);