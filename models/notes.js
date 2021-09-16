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
    }
},{
    timestamps: true
});

var Notes = mongoose.model('Note', notesSchema);
module.exports = Notes;