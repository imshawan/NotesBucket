const nodemailer = require('nodemailer');
const config = require('../config');

exports.smtpTrans = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.user,
      pass: config.password
    }
  });

exports.forgotPasswordTemplate = (token, user) => {
  var mailOptions = {
      to: user.email,
      from: config.user,
      subject: 'NotesBucket: Forgot password',
      html: '<h3>Hi, ' + user.firstname +'</h3>' +
        '<h4>You are receiving this because you (or someone else) have requested the reset of the password for your account.<br>' +
        'Please paste this OTP into your browser to complete the process:</h4>' +
        '<h3>Your OTP for password reset is: ' + token + '</h3>' +
        '<h4>If you did not request this, please ignore this email and your password will remain unchanged.</h4>'
    };
  return mailOptions;
}

exports.resetPasswordTemplate = (user) =>{
  var mailOptions = {
    to: user.email,
    from: config.user,
    subject: 'NotesBucket: Password has been changed',
    html: '<h3>Hi, ' + user.firstname +'</h3>' +
    '<h4> - This is a confirmation that the password for your account ' + user.email + ' has just been changed.</h4>'
  };
  return mailOptions;
}

exports.changePasswordTemplate = (user) =>{
  var mailOptions = {
    to: user.email,
    from: config.user,
    subject: 'NotesBucket: Password has been changed',
    html: '<h3>Hi, ' + user.firstname +'</h3>' +
    '<h4> - This is a confirmation that the password for your account ' + user.email + ' has just been changed.</h4>'
  };
  return mailOptions;
}

exports.verifyOtpTemplate = (token, user) =>{
  var mailOptions = {
    to: user,
    from: config.user,
    subject: 'NotesBucket: Email verification',
    html: '<h4>You are receiving this because you (or someone else) have requested to create an account at NotesBucket.<br>' +
      'Please paste OTP this into your browser to complete the email verification process:</h4>' +
      '<h3>Your OTP is ' + token + '</h3>' +
      'If you did not request this, please ignore this email and your account creation will be rejected.'
    }
  return mailOptions;
}