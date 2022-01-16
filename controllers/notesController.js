const Notes = require('../models/notes');
const handleNotes = {}

handleNotes.get = (req,res,next) => {
    Notes.find({author: req.user._id}, ['title', 'updatedAt'])
    .then((notes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(notes);
    }, (err) => next(err))
    .catch((err) => next(err));
}

handleNotes.create = (req,res,next) => {
    req.body.author = req.user._id;
    Notes.create(req.body)
    .then((note) => {
        Notes.findById(note._id)
        .populate('author')
        .then((note) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(note);
        })

    }, err => next(err))
    .catch(err => next(err));
}

handleNotes.deleteAll =  (req,res,next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, message: 'Unauthorised access denied' });
    // Notes.remove({})
    // .then((response) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(response);
    // }, (err) => next(err))
    // .catch((err) => next(err));
}

handleNotes.getById = (req,res,next) => {
    Notes.findById(req.params.notesId)
    .populate('author')
    .then((note) => {
        if (note.author.equals(req.user._id)){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(note);
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'You are not authorized to view this note' });
        }
    })
    .catch(() => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Note with ID '+ req.params.notesId + ' was not found!' });
    });
}

handleNotes.createById = (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /notes/' + req.params.notesId);
}

handleNotes.updateById = (req,res,next) => {
    let payload = {}
    if (req.body.title) payload.title = req.body.title
    if (req.body.content) payload.content = req.body.content

    Notes.findById(req.params.notesId)
    .then((note) => {
        if (note != null){
            if (note.author.equals(req.user._id)){
                req.body.author = req.user._id;
                Notes.findByIdAndUpdate(req.params.notesId, {
                    $set: payload
                }, { new: true })
                .then((note) => {
                    Notes.findById(note._id)
                    .populate('author')
                    .then((note) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(note); 
                    })               
                }, (err) => next(err));
            }
            else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message: 'You are not authorized to modify this note' });
            }
        }
        else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'Note with ID '+ req.params.notesId + ' was not found!' });
        }
    })
    .catch((err) => {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: err.message });
    });
}

handleNotes.deleteById = (req,res,next) => {
    Notes.findById(req.params.notesId)
    .then((note) => {
        if (note != null){
            if (note.author.equals(req.user._id)){
                Notes.findByIdAndRemove(req.params.notesId)
                .then((elem) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, noteId: elem._id, message: "Note deleted successfully"}); 
                }, (err) => next(err));
            }
            else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message: 'You are not authorized to delete this note' });
            }
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'Note with ID '+ req.params.notesId + ' was not found!' });
        }
    })
    .catch((err) => {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: err.message });
    });
}


module.exports = handleNotes;