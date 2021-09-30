var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    facebookId: String,
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    }
});

User.plugin(passportLocalMongoose);
var Users = mongoose.model('User', User);
module.exports = Users;
