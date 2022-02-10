const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('./cors');

const shareable = require('../controllers/shareable');
const authenticate = require('../controllers/authenticate');

router.use(bodyParser.json());

router.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.get('/:token', cors.cors, shareable.getNote);
router.put('/:id', cors.cors, authenticate.verifyUser, shareable.share);

module.exports = router;
