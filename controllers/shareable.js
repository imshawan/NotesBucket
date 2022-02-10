const Notes = require('../models/notes');
const shareable = {}

shareable.getNote = (req, res) => {
    Notes.find({ shared: true, access_token: req.params.token })
    .populate('author')
    .then((note) => {
        if (note.length) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(note);
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, message: 'Note not found!' });
        }
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, message: err.message });
    });
}

shareable.share = (req, res) => {
    updateSharingPermissions(req, req.body.enableSharing)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
    })
    .catch((err) => {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json(err)
    })
}

async function updateSharingPermissions (payload, value) {
    value = JSON.parse(value)
    return new Promise((resolve, reject) => {
        Notes.findById(payload.params.id)
        .then((note) => {
            if (note.shared === value) {
                reject({success: false, message: `Sharing is already ${value ? "enabled" : "disabled"}`})
            }
            if (note.author.equals(payload.user._id)){
                let access_token = value ? generateAccessToken() : null
                Notes.findByIdAndUpdate(payload.params.id, {
                    $set: { 
                        shared: value,
                        access_token: access_token
                    }
                }, { new: true })
                .then((note) => {
                    resolve({ success: true, 
                        message: value ? "Access token generated" : "Access token removed", 
                        token: note.access_token });               
                })
                .catch((err) => reject({success: false, message: err.message}))
            }
            else {
                reject({success: false, message: 'You are not authorized' });
            }
        })
        .catch((err) => {
            reject({success: false, message: err.message });
        });
    })
}

function generateAccessToken () {
    var timestamp = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (timestamp + Math.random() * 16) % 16 | 0;
        timestamp = Math.floor(timestamp / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
	return uuid;
}

module.exports = shareable;