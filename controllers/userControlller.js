
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../controllers/authenticate');
const OTP = require('../models/otp')
const emailHandler = require('../helpers/emailHandler');
const logger = require('../helpers/errorLogger');
const config = require('../config');

const Users = {}

Users.get = (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) {
        return next(err);
      } else {
        res.statusCode = 200;
        res.setHeader('Content_type', 'application/json');
        res.json(users);
      }
    })
  }

Users.create = (req, res, next) => {
    OTP.findOne({otp: req.body.otp})
    .then((otp) => {
      if (!otp) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Invalid OTP!'})
        return;
      }
      if (req.body.email != otp.email) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Email provided does not match with the previous one'})
        return;
      }
      currentTime = Date.now();
      if (parseInt(currentTime) >= parseInt(otp.expiresIn)) {
          OTP.findByIdAndRemove(otp._id)
          .then((e) => (e))
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, message: 'This OTP has expired'})
          return;
      }
  
      User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err){
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, message: err.message})
        }
        else {
            user.email = req.body.email;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.save((err, user) => {
            if (err) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, message: err.message});
              return;
            }
            passport.authenticate('local')(req, res, () => {
              OTP.findByIdAndRemove(otp._id)
              .then((e) => (e))
              emailHandler.smtpTrans.sendMail(emailHandler.newAccountTemplate(user));
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, message: 'You have successfully signed up!'});
          });
        });
      }
    });
    }, (err) => {logger.LogError(err, req)})
  }

Users.update = (req, res, next) => {
  let UserData = {}
  if (req.body.firstname) { UserData.firstname = req.body.firstname; }
  if (req.body.lastname) { UserData.lastname = req.body.lastname; }

  User.findByIdAndUpdate(req.user._id, {
    $set: UserData
    }, { new: true })
  .then((user) => {
    User.findById(user._id)
    .populate('author')
    .then((updated_user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(updated_user); 
    })
  })
  .catch(() => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, message: "Updation unsuccessful!"}); 
  })
  }

Users.signIn = (req, res, next) => {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.cookie('token', token,  { expiresIn: config.expiresIn })
    res.json({success: true, token: token, message: 'You have successfully logged in!'});
  }

Users.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
  .then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.json({success: true, user: user});
  })
  .catch(() => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.json({success: false, message: "Error occured! Failed to fetch the user data"})
})
}

Users.signOut = (req, res, next) => {
    var token = authenticate.getToken({_id: req.user._id});
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
      res.end('You are successfully logged out!')
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  }

module.exports = Users;