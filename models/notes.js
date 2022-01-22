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
    favourite: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

notesSchema.plugin(mongooseFieldEncryption, { fields: ["content"], secret: config.secretString });
var Notes = mongoose.model('Note', notesSchema);
module.exports = Notes;