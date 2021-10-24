const nodemailer = require('nodemailer');
const config = require('../config');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  config.ClientId, // ClientID
  config.ClientSecret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: config.RefreshToken
});

google.options({ auth: oauth2Client }); 

// const accessToken = oauth2Client.getAccessToken()

const accessToken = new Promise((resolve, reject) => {
  oauth2Client.getAccessToken((err, token) => {
    if (err) console.log(err); // Handling the errors
    else resolve(token);
  });
});

exports.smtpTrans = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: "OAuth2",
      user: config.user, 
      clientId: config.ClientId,
      clientSecret: config.ClientSecret,
      refreshToken: config.RefreshToken,
      accessToken: accessToken
 }
    // auth: {
    //   user: config.user,
    //   pass: config.password
    // }
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
        'If you did not request this, please ignore this email and your password will remain unchanged.'
    };
  return mailOptions;
}

exports.resetPasswordTemplate = (user) =>{
  var mailOptions = {
    to: user.email,
    from: config.user,
    subject: 'NotesBucket: Password has been changed',
    html: '<h3>Hi, ' + user.firstname +'</h3>' +
    '- This is a confirmation that the password for your account ' + user.email + ' has just been changed.'
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

exports.newAccountTemplate = (user) =>{
  var mailOptions = {
    to: user.email,
    from: config.user,
    subject: 'NotesBucket: Account confirmation',
    html: '<h3>Hi, ' + user.firstname +'</h3>' +
    '<h4>Thankyou for creating an account at NotesBucket.<br>' +
    'This is a confirmation mail that confirms a successful creation of your account</h4>'
    }
  return mailOptions;
}