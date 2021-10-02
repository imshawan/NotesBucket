const express = require('express');
var router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Profile = require('../models/profile');
const cors = require('./cors');
var emailHandler = require('../helpers/emailHandler');
const logger = require('../helpers/errorLogger');
const profileValidator = require('../validators/profileValidator').validateProfile;

var authenticate = require('../controllers/authenticate');
router.use(bodyParser.json());

/* GET user profile listing. */
router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Profile.findOne({userInfo: req.user._id})
    .populate('userInfo')
    .then((userProfile) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(userProfile);
        }, err => next(err))
    .catch(err => next(err));
})

.post(cors.cors, authenticate.verifyUser, profileValidator, (req, res, next) => {
    req.body.userInfo = req.user._id;
    req.body.dob = new Date(req.body.dob);

    Profile.findOne({userInfo: req.user._id}, (err, user) => {
        if (user){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: "Data already exists, cannot overwrite"});
        }
        else {
            Profile.create(req.body)
            .then((userProfile) => {
                Profile.findById(userProfile._id)
                .populate('userInfo')
                .then((userProfile) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, message: "Profile information was saved successfully", profile: userProfile});
                })

            }, err => next(err))
            .catch(err => next(err));
        }
    })
})

.put(cors.cors, authenticate.verifyUser, profileValidator, (req, res, next) => {
    req.body.userInfo = req.user._id;
    req.body.dob = new Date(req.body.dob);

    Profile.findOne({userInfo: req.user._id}, (err, user) => {
        if (!user){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: "Profile information does not exist"});
        }
        else {
            Profile.findOneAndUpdate({userInfo: req.user._id}, {
                $set: req.body
            }, { new: true })
            .then((userProfile) => {
                Profile.findById(userProfile._id)
                .populate('userInfo')
                .then((userProfile) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, message: "Profile information was modified successfully", profile: userProfile});
                })

            }, err => console.log(err))
            .catch(err => next(err));
        }
    })
});

module.exports = router;