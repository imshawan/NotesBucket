const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('./cors');

router.use(bodyParser.json());

router.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.get('/', cors.cors, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, message: 'Server is up and running'});
});

module.exports = router;
