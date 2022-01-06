const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../controllers/authenticate');
const notesController = require('../controllers/notesController');
const validateNotes = require('../validators/notesValidator').validateNotes;

const notesRouter = express.Router();
notesRouter.use(bodyParser.json());

notesRouter.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
notesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, notesController.get)
.post(cors.cors, authenticate.verifyUser, validateNotes, notesController.create)
.delete(cors.cors, authenticate.verifyUser, notesController.deleteAll);


notesRouter.route('/:notesId')
.get(cors.cors, authenticate.verifyUser, notesController.getById)
.post(cors.cors, authenticate.verifyUser, notesController.createById)
.put(cors.cors, authenticate.verifyUser, validateNotes, notesController.updateById)
.delete(cors.cors, authenticate.verifyUser, notesController.deleteById);

module.exports = notesRouter;


