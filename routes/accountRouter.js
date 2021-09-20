var express = require('express');
var router = express.Router();
const crypto = require("crypto");
const OTP = require('../models/otp')
const User = require('../models/user');

/* GET home page. */
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
        subject: 'NotesBucket Email Verification',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please paste OTP this into your browser to complete the email verification process:\n\n' +
          'Your OTP is ' + token + '\n\n' +
          'If you did not request this, please ignore this email and your account creation will be rejected.\n'
        }

      smtpTrans.sendMail(mailOptions)
    }
    res.statusCode = 404;
    res.json({success: false, message: 'An account with that email address already exists'});
    return;
  })

});

module.exports = router;
