const express = require('express');
var router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const cors = require('./cors');

var authenticate = require('../authenticate');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/',  authenticate.verifyUser, function(req, res, next) {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    } else {
      res.statusCode = 200;
      res.setHeader('Content_type', 'application/json');
      res.json(users);
    }
  })
});

router.post('/signup', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err})
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if (req.body.email)
        user.email = req.body.email;
      if (req.body.gender)
        user.gender = req.body.gender;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return;
        }
        passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'You are successfully signed up!', user: user});
      });
    });
  }
});
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', authenticate.verifyUser, (req, res, next) => {
  //var token = authenticate.getToken({_id: req.us er._id});
  // if (req.session) {
  //   req.session.destroy();
  //   res.clearCookie('session-id');
  //   res.redirect('/');
  //   res.end('You are successfully logged out!')
  // }
  // else {
  //   var err = new Error('You are not logged in!');
  //   err.status = 403;
  //   next(err);
  // }
});


module.exports = router;
