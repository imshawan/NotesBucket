const mongooseFieldEncryption = require('mongoose-field-encryption').fieldEncryption;
const config = require('../config');
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    firstname: {
        type: String,
        default: '',
    },
    lastname: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    dob: {
        type: Date,
        default: '',
    },
    role: {
        type: String,
        default: '',
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

// notesSchema.plugin(mongooseFieldEncryption, { fields: ["firstname", "lastname", "gender", "country", "dob", "role"], secret: config.secretString });
var Notes = mongoose.model('Note', notesSchema);
module.exports = Notes;