const Notes = require('../models/notes');
const handleNotes = {}

handleNotes.get = (req,res,next) => {
    Notes.find({author: req.user._id})
    .populate('author')
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
    }, (err) => {
        if (err){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'Note with ID '+ req.params.notesId + ' was not found!' });
        }
    })
    .catch((err) => next(err));
}

handleNotes.createById = (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /notes/' + req.params.notesId);
}

handleNotes.updateById = (req,res,next) => {
    Notes.findById(req.params.notesId)
    .then((note) => {
        if (note != null){
            if (note.author.equals(req.user._id)){
                req.body.author = req.user._id;
                Notes.findByIdAndUpdate(req.params.notesId, {
                    $set: req.body
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
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'Note with ID '+ req.params.notesId + ' was not found!' });
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}

handleNotes.deleteById = (req,res,next) => {
    Notes.findById(req.params.notesId)
    .then((note) => {
        if (note != null){
            if (note.author.equals(req.user._id)){
                Notes.findByIdAndRemove(req.params.notesId)
                .then((note) => {
                    Notes.findById(note._id)
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
                res.json({success: false, message: 'You are not authorized to delete this note' });
            }
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'Note with ID '+ req.params.notesId + ' was not found!' });
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}


module.exports = handleNotes;