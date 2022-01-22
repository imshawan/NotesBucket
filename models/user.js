var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    facebookId: String,
    firstname: {
        type: String,
        default: '',
    },
    lastname: {
        type: String,
        default: '',
    },
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    acceptedTerms: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);
var Users = mongoose.model('User', User);
module.exports = Users;
