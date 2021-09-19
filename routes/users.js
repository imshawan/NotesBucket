const express = require('express');
var router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const cors = require('./cors');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Password = require('../models/password');
const config = require('../config');

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

router.post('/forgotPassword', (req, res, next) => {
  var token;
  crypto.randomBytes(4, function(err, buf) {
    token = buf.toString('hex');
  });

  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
    //   console.log('error', 'No account with that email address exists.');
      res.statusCode = 404;
      res.end('No account with that email address exists.');
      return;
    }
    
    var payload = {}
    payload.userId = user._id
    payload.passwordToken = token
    payload.username = user.username
    payload.expiresIn = Date.now() + 300000; // 5 min

    Password.create(payload)

    var smtpTrans = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: config.user,
        pass: config.password
      }
    });
    var mailOptions = {

      to: user.email,
      from: config.user,
      subject: 'NotesBucket Password Reset',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };

    smtpTrans.sendMail(mailOptions, function(err) {
    res.end('An e-mail with OTP has been sent to ' + user.email + ' with further instructions.');
  });

  });

});


router.get('/forgotPassword', (req, res) => {
  Password.find({})
  .then((resp) => {
    res.json(resp)
  })
});



router.post('/resetPassword', (req, res) => {
  var smtpTrans = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.user,
      pass: config.password
    }
  });

  Password.findOne({ passwordToken: req.body.otp }, function(err, passwordPayload) {
    if (!passwordPayload) {
      res.statusCode = 404;
      res.json({success: false, message:'Invalid OTP'});
      return;
    }
    currentTime = Date.now();

    if (parseInt(currentTime) <= parseInt(passwordPayload.expiresIn)){
      User.findByUsername(passwordPayload.username).then(function(UserFound){
        if (UserFound){
            UserFound.setPassword(req.body.password, function(){
            UserFound.save();
            Password.findByIdAndRemove(passwordPayload._id)
            .then((pswd) => {
              var mailOptions = {
                to: UserFound.email,
                from: config.user,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                  ' - This is a confirmation that the password for your account ' + UserFound.email + ' has just been changed.\n'
              };
              smtpTrans.sendMail(mailOptions)
              Password.findById(pswd._id)
              .then(() => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.status(200).json({success: true, message: 'password reset successful'});
                })               
              }, (err) => console.log(err));
            });
        } 
        else {
            res.status(500).json({success: false, message: 'This user does not exist'});
        }
      },function(err){
        console.error(err);
    })
    }
    else {
      Password.findByIdAndRemove(passwordPayload._id)
      .then((note) => {
        Password.findById(note._id)
        .then(() => {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'This OTP has expired.'});
          })               
        }, (err) => console.log(err));
    }
      
  })
})

router.post('/changePassword', authenticate.verifyUser, (req, res) => {
  // User.findOne(req.user._id),(err, user) => {
  //   // Check if error connecting
  //   if (err) {
  //     res.json({ success: false, message: err }); // Return error
  //   } else {
  //     // Check if user was found in database
  //     if (!user) {
  //       res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
  //     } else {
  //       user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
  //          if(err) {
  //                   if(err.name === 'IncorrectPasswordError'){
  //                        res.json({ success: false, message: 'Incorrect password' }); // Return error
  //                   }else {
  //                       res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
  //                   }
  //         } else {
  //           res.json({ success: true, message: 'Your password has been changed successfully' });
  //          }
  //        })
  //     }
  //   }
  // }); 
});

module.exports = router;
