const Password = require('../models/password');
const User = require('../models/user');
const OTP = require('../models/otp');

const emailHandler = require('../helpers/emailHandler');
const errorHandler = require('../helpers/errorLogger');

const Passwords = {}

Passwords.forgotPassword = (req, res, next) => {
    let token = generateOtp(8);
  
    User.findOne({ email: req.body.email }, (err, user) => {
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
      emailHandler.smtpTrans.sendMail(emailHandler.forgotPasswordTemplate(token, user))
      .then((resp) => {
        res.statusCode = 200;
        res.json({success: true, message: 'An e-mail with OTP has been sent to ' + user.email + ' with further instructions.'});
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({success: false, message: "Internal server error!"});
      })
  })
}

Passwords.resetPassword = (req, res, next) => {
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
  }

Passwords.changePassword = (req, res, next) => {
    User.findOne(req.user._id),(err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
             if(err) {
                      if(err.name === 'IncorrectPasswordError'){
                           res.json({ success: false, message: 'Incorrect password' }); // Return error
                      }else {
                          res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                      }
            } else {
              res.json({ success: true, message: 'Your password has been changed successfully' });
             }
           })
        }
      }
    };
  }

Passwords.getOTP = (req, res, next) => {
    var token = generateOtp(8);
  
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
  
  }

const generateOtp = (length) => {
  if (typeof length != 'number'){
    throw new Error(`Length must be a number, not ${typeof length}`);
  }
  const digits = '0123456789';
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const alphaLength = Math.floor(length/3);
  return randomize(alphaLength, alpha).toUpperCase() + randomize(length - alphaLength, digits);
}

const randomize = (length, payload) => {
  let OTP = '';
  for (let i = 0; i < length; i++ ) {
        OTP += payload[Math.floor(Math.random() * 10)];
    }
  return OTP;
}

module.exports = Passwords;