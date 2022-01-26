const nodemailer = require('nodemailer');
const config = require('../config');
const fs = require('fs');
const Handlebars = require('handlebars');
const sgMail = require('@sendgrid/mail')

var transporter = {};

switch (config.smtpType) {
  case 'gmail':
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
    transporter.verify();
    break;

  case 'sendgrid':
    sgMail.setApiKey(config.sendgridAPI)
    transporter = sgMail
    transporter.sendMail = sgMail.send
    break;

  default:
    throw new Error("Mail client not set...");
 }

exports.smtpTrans = transporter
exports.forgotPasswordTemplate = (token, user) => {
  var data = fs.readFileSync('templates/confirmEmail.tpl', 'utf8');
  var template = Handlebars.compile(data);
  const payload = {
    heading: "Forgot password",
    body_1: `Hi, ${user.firstname}`,
    para_1: "You are receiving this because you (or someone else) have requested the reset of the password for your account. Please paste this OTP into your browser to complete the process:",
    otp: token,
    para_2: "Note: This OTP is only valid for 5 minutes from now. If you did not request this, please ignore this email and your password will remain unchanged."
  }
  var mailOptions = {
      to: user.email,
      from: config.user,
      subject: 'NotesBucket: Forgot password',
      html: template(payload)
    };
  return mailOptions;
}

exports.resetPasswordTemplate = (user) =>{
  var data = fs.readFileSync('templates/success.tpl', 'utf8');
  var template = Handlebars.compile(data);
  const payload = {
    heading: "Password reset success!",
    body_1: `Hi, ${user.firstname}`,
    para_1: `This is a confirmation that the password for your account ${user.email} was changed successfully.`,
    para_2: ""
  }

  var mailOptions = {
    to: user.email,
    from: config.user,
    subject: 'NotesBucket: Password has been changed',
    html: template(payload)
  };
  return mailOptions;
}

exports.changePasswordTemplate = (user) =>{
  var data = fs.readFileSync('templates/success.tpl', 'utf8');
  var template = Handlebars.compile(data);
  const payload = {
    heading: "Password changed!",
    body_1: `Hi, ${user.firstname}`,
    para_1: `This is a confirmation that the password for your account ${user.email} has just been changed.`,
    para_2: ""
  }
  var mailOptions = {
    to: user.email,
    from: config.user,
    subject: 'NotesBucket: Password has been changed',
    html: template(payload)
  };
  return mailOptions;
}

exports.verifyOtpTemplate = (token, user) =>{
  var data = fs.readFileSync('templates/confirmEmail.tpl', 'utf8');
  var template = Handlebars.compile(data);
  const payload = {
    heading: "Verify your email",
    body_1: "You’ve received this message because your email address has been registered with our site. Please use this OTP to verify your email address and confirm that you are the owner of this account.",
    otp: token,
    para_1: "Note: This OTP is only valid for 5 minutes from now. If you did not register with us, please disregard this email",
    para_2: "Once confirmed, this email will be uniquely associated with your account."
  }

  var mailOptions = {
    to: user,
    from: config.user,
    subject: 'NotesBucket: Email verification',
    html: template(payload)
    }
  return mailOptions;
}

exports.newAccountTemplate = (user) =>{
  var data = fs.readFileSync('templates/success.tpl', 'utf8');
  var template = Handlebars.compile(data);
  const payload = {
    heading: "Account created!",
    body_1: `Hi, ${user.firstname}`,
    para_1: "Thankyou for creating an account at NotesBucket.",
    para_2: "This is a confirmation mail that confirms a successful creation of your account",
  }

  var mailOptions = {
    to: user.email,
    from: config.user,
    subject: 'NotesBucket: Account confirmation',
    html: template(payload)
    }
  return mailOptions;
}