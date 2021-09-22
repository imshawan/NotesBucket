const express = require('express');
var router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const cors = require('./cors');
const OTP = require('../models/otp')
var emailHandler = require('../controllers/emailHandler');

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

// router.delete('/', function(req, res, next) {
//   User.remove({}, (err, users) => {
//     if (err) {
//       return next(err);
//     } else {
//       res.statusCode = 200;
//       res.setHeader('Content_type', 'application/json');
//       res.json(users);
//     }
//   })
// });

router.post('/signup', (req, res) => {
  if (!req.body.otp){
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'OTP was not provided'})
    return;
  }
  OTP.findOne({otp: req.body.otp})
  .then((otp) => {
    if (!otp) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Invalid OTP!'})
      return;
    }
    if (req.body.email != otp.email) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Email provided does not match with the previous one'})
      return;
    }
    currentTime = Date.now();
    if (parseInt(currentTime) >= parseInt(otp.expiresIn)) {
        OTP.findByIdAndRemove(otp._id)
        .then((e) => (e))
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'This OTP has expired'})
        return;
    }

    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
      if (err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err})
      }
      else {
          user.firstname = req.body.firstname;
          user.lastname = req.body.lastname;
          user.email = req.body.email;
          user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
          passport.authenticate('local')(req, res, () => {
            OTP.findByIdAndRemove(otp._id)
            .then((e) => (e))
            emailHandler.smtpTrans.sendMail(emailHandler.newAccountTemplate(user));
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'You have successfully signed up!', user: user});
        });
      });
    }
  });

  }, (err) => {console.log(err)})
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You have successfully logged in!'});
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
