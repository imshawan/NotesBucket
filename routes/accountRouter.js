var express = require('express');
var router = express.Router();
const crypto = require("crypto");
const OTP = require('../models/otp')
const User = require('../models/user');
var emailHandler = require('../email/emailHandler');

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

module.exports = router;
