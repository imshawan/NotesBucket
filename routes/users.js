var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user');
const cors = require('./cors');

var authenticate = require('../authenticate');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err})
    }
    else {
        passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'You are successfully signed up!', user: user});
      })
    }
  })
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.post('/logout', (req, res) => {
  //var token = authenticate.getToken({_id: req.us er._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged out!'});
});

module.exports = router;
