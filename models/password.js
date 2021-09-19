var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resetPasswordSchema = new Schema({
    passwordToken: {
        type: String,
        default: '',
    },
    expiresIn: {
        type: String,
        default: '',
    },
    userId: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

var Password = mongoose.model('Password', resetPasswordSchema);
module.exports = Password;