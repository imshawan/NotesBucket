const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const Sheets = require('../controllers/sheetsController');

const queriesRouter = express.Router();
queriesRouter.use(bodyParser.json());

queriesRouter.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
queriesRouter.route('/')
.get(cors.cors, Sheets.get)
.post(cors.cors, Sheets.create)

module.exports = queriesRouter;