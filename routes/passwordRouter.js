const express = require('express');
var router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const cors = require('./cors');
const crypto = require('crypto');
const OTP = require('../models/otp')
var emailHandler = require('../helpers/emailHandler');
const Password = require('../models/password');
var errorHandler = require('../helpers/errorLogger');

var authenticate = require('../controllers/authenticate');
router.use(bodyParser.json());

router.post('/forgotPassword', (req, res, next) => {
  var token;
  crypto.randomBytes(4, function(err, buf) {
    token = buf.toString('hex');
  });

  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      res.statusCode = 404;
      res.json({success: false, message: "Account with that email address doesn't exists"});
      return;
    }
    var payload = {}
    payload.userId = user._id
    payload.passwordToken = token
    payload.username = user.username
    payload.expiresIn = Date.now() + 300000; // 5 min
    Password.create(payload)
    emailHandler.smtpTrans.sendMail(emailHandler.forgotPasswordTemplate(token, user), function(err) {
      res.statusCode = 200;
      res.json({success: true, message: 'An e-mail with OTP has been sent to ' + user.email + ' with further instructions.'});
    });
  });
});
  
// router.get('/forgotPassword', (req, res) => {
//   try{
//     Password.finbd({}).then((resp) => { res.status(200).json(resp) })
//   }
//   catch (err) {
//   errorHandler.LogError(err, req);
//   res.status(500).end("Internal Server error!")
//   }
// });
  
router.post('/resetPassword', (req, res) => {
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
              emailHandler.smtpTrans.sendMail(emailHandler.resetPasswordTemplate(UserFound))
              Password.findById(pswd._id)
              .then(() => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.status(200).json({success: true, message: 'The password reset was successful'});
                })               
              }, (err) => console.log(err));
            });
        } 
        else {
            res.status(500).json({success: false, message: 'This user does not exist'});
        }
      },function(err){
        console.log(err);
    })
    }
    else {
      Password.findByIdAndRemove(passwordPayload._id)
      .then((note) => {
        Password.findById(note._id)
        .then(() => {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: 'This OTP has expired.'});
          })               
        }, (err) => console.log(err));
    }
  })
});
  
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
})

/* Verify email using OTP. */
router.post('/getOtp', function(req, res, next) {
  var token;
  crypto.randomBytes(4, function(err, buf) {
    token = buf.toString('hex');
  });

  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      var payload = {}
      payload.otp = token;
      payload.email = req.body.email;
      payload.expiresIn = Date.now() + 300000; // 5 min

      OTP.create(payload)
      emailHandler.smtpTrans.sendMail(emailHandler.verifyOtpTemplate(token, req.body.email), function(err) {
        res.statusCode = 200;
        res.json({success: true, message: 'An e-mail with OTP has been sent to ' + req.body.email + '.'});
      });
    }
    else {
      res.statusCode = 404;
      res.json({success: false, message: 'An account with that email address already exists'});
    }
  })

});

// Test Route
router.get('/getOtp', function(req, res, next) {
  OTP.find({})
  .then((otp) => {
    res.statusCode = 200;
    res.json(otp);
  })
})



  module.exports = router;