const express = require('express');
var router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Profile = require('../models/profile');
const cors = require('./cors');
var emailHandler = require('../helpers/emailHandler');
const logger = require('../helpers/errorLogger');

var authenticate = require('../controllers/authenticate');
router.use(bodyParser.json());

/* GET user profile listing. */
router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Profile.findOne({userInfo: req.user._id})
    .populate('userInfo')
    .then((userProfile) => {
            if (userProfile) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, message: "Profile information was fetched successfully", profile: userProfile});
            }
            else {
                Profile.create({userInfo: req.user._id})
                .then((userProfile) => {
                    Profile.findById(userProfile._id)
                    .populate('userInfo')
                    .then((userProfile) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, message: "Profile information was fetched successfully", profile: userProfile});
                    })

                }, err => {
                    logger.LogError(err);
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: false, message: "Something went wrong, please try again"});
                })
            }
        }, err => next(err))
    .catch(err => next(err));
})

.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    // new Date("11/20/2014 04:11") Thu Nov 20 2014 04:11:00 GMT+0100 (CET)
    // new Date("2014/11/20 04:11") Thu Nov 20 2014 04:11:00 GMT+0100 (CET)
    var Data = {
        gender: req.body.gender ? req.body.gender : '',
        country: req.body.country ? req.body.country : '',
        dob: req.body.dob ? new Date(req.body.dob) : '',
        role: req.body.role ? req.body.role : '',
        userInfo: req.user._id
    }

    Profile.findOne({userInfo: req.user._id}, (err, user) => {
        if (!user){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: "Profile information does not exist"});
        }
        else {
            Profile.findOneAndUpdate({userInfo: req.user._id}, {
                $set: Data
            }, { new: true })
            .then((userProfile) => {
                Profile.findById(userProfile._id)
                .populate('userInfo')
                .then((userProfile) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, message: "Profile information was updated successfully", profile: userProfile});
                })

            }, err => {
                logger.LogError(err);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message: "Something went wrong, please try again"});
            })
        }
    })
});

module.exports = router;