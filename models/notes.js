const mongooseFieldEncryption = require('mongoose-field-encryption').fieldEncryption;
const config = require('../config');
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: true
    },
    content: {
        type: String,
        default: '',
        required: true
    },
    teaser: {
        type: String,
        default: ''
    },
    favourite: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    shared: {
        type: Boolean,
        default: false
    },
    access_token: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

notesSchema.plugin(mongooseFieldEncryption, { fields: ["content"], secret: config.secretString });
var Notes = mongoose.model('Note', notesSchema);
module.exports = Notes;