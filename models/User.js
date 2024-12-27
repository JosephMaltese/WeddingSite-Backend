const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    attending: {
        type: Boolean,
        default: false,
    },
    plusOne: {
        type: Boolean,
        default: false,
    },
    plusOneName: {
        type: String,
        required: false,
    },
    canBringPlusOne: {
        type: Boolean,
        default: false,
    },
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    rsvp: {
        type: Boolean,
        default: false,
    },
    attending: {
        type: Boolean,
        required: false,
    },
    memberCount: {
        type: Number,
        required: true,
    },
    finishedRSVP : {
        type: Boolean,
        default: false,
    },
    familyMembers: [familyMemberSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;