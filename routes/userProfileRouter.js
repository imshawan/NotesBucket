const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('./cors');
const profileController = require('../controllers/userProfileController');

var authenticate = require('../controllers/authenticate');
router.use(bodyParser.json());

/* GET user profile listing. */
router.route('/')
.options(cors.corsWithOptions, (req, res, next) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, profileController.get)
.put(cors.cors, authenticate.verifyUser, profileController.update);

module.exports = router;