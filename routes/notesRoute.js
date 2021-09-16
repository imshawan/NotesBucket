const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Notes = require('../models/notes');
const User = require('../models/user');
const { router } = require('../app');

const notesRouter = express.Router();
notesRouter.use(bodyParser.json());


notesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Notes.find({})
    .then((notes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(notes);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Notes.create(req.body)
    .then((note) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(note);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Notes.remove({})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }, (err) => next(err))
    .catch((err) => next(err));
});

notesRouter.route('/:notesId')
.get(cors.cors, (req,res,next) => {
    Notes.findById(req.params.notesId)
    .then((note) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(note);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.cors, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /notes/' + req.params.notesId);
})

.put(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Notes.findByIdAndUpdate(req.params.notesId, {
        $set: req.body
    }, {new: true})
    .then((note) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(note);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Notes.findByIdAndRemove(req.params.notesId)
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = notesRouter;


