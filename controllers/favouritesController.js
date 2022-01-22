const Notes = require('../models/notes');
const handleFavourites = {}

handleFavourites.getFavourites = (req, res, next) => {
    Notes.find({author: req.user._id, favourite: true},
        ['title', 'updatedAt'])
        .then((notes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, favourites: notes});
        }, (err) => next(err))
        .catch((err) => next(err));
}

handleFavourites.addFavourite = (req, res, next) => {
    updateFavourites(req, true)
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

handleFavourites.removeFavourite = (req, res, next) => {
    updateFavourites(req, false)
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

function updateFavourites (req, value) {
    return new Promise((resolve, reject) => {
        Notes.findById(req.params.noteId)
        .then((note) => {
            if (note.author.equals(req.user._id)){
                req.body.author = req.user._id;
                Notes.findByIdAndUpdate(req.params.noteId, {
                    $set: { favourite: value }
                }, { new: true })
                .then((note) => {
                    resolve({success: true, message: value ? "Added to favourite list" : "Removed favourite", note: note});               
                })
                .catch((err) => reject({success: false, message: err.message}))
            }
            else {
                reject({success: false, message: 'You are not authorized' });
            }
        })
        .catch((err) => {
            reject({success: false, message: 'Note not found!' });
        });
    })
}

module.exports = handleFavourites;