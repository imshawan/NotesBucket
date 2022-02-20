const Notes = require('../models/notes');
const handleNotes = {}

handleNotes.get = (req,res,next) => {
    Notes.find({author: req.user._id}, ['title', 'updatedAt', 'favourite', 'shared'])
    .then((notes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(notes);
    }, (err) => next(err))
    .catch((err) => next(err));
}

handleNotes.create = (req,res,next) => {
    let date = new Date(Date.now()).toISOString();
    Notes.create({
        title: req.body.title,
        content: req.body.content,
        author: req.user._id,
        createdAt: date,
        updatedAt: date
    })
    .then((note) => {
        Notes.findById(note._id)
        .populate('author')
        .then((note) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, message: "Note created", note: note});
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
    let payload = {
        updatedAt: new Date(Date.now()).toISOString()
    }
    if (req.body.title) payload.title = req.body.title
    if (req.body.content) payload.content = req.body.content

    Notes.findById(req.params.notesId)
    .then((note) => {
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
                        res.json({success: true, message: "Note updated", note: note}); 
                    })               
                })
                .catch((err) => {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: false, message: err.message });
                })
            }
            else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message: 'You are not authorized to modify this note' });
            }
    })
    .catch((err) => {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'The Note was not found in our servers' });
    });
}

handleNotes.deleteById = (req,res,next) => {
    Notes.findById(req.params.notesId)
    .then((note) => {
            if (note.author.equals(req.user._id)){
                Notes.findByIdAndRemove(req.params.notesId)
                .then((elem) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, noteId: elem._id, message: "Note was deleted successfully"}); 
                })
                .catch((err) => {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: false, message: err.message });
                })
            }
            else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message: 'You are not authorized to delete this note' });
            }
    })
    .catch((err) => {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'The Note was not found in our servers' });
    });
}


module.exports = handleNotes;