const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../controllers/authenticate');
const favouritesController = require('../controllers/favouritesController');

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
favouriteRouter.route('/')
.get(cors.cors, authenticate.verifyUser, favouritesController.getFavourites)

favouriteRouter.route('/:noteId')
.put(cors.cors, authenticate.verifyUser, favouritesController.addFavourite)
.delete(cors.cors, authenticate.verifyUser, favouritesController.removeFavourite);

module.exports = favouriteRouter;


