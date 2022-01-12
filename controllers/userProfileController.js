const User = require('../models/user');
const Profile = require('../models/profile');
const logger = require('../helpers/errorLogger');

const UserProfile = {};
const UserProfileFields = ['gender', 'country', 'role']

UserProfile.get = (req, res, next) => {
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
}

UserProfile.update = (req, res, next) => {
    // new Date("11/20/2014 04:11") Thu Nov 20 2014 04:11:00 GMT+0100 (CET)
    // new Date("2014/11/20 04:11") Thu Nov 20 2014 04:11:00 GMT+0100 (CET)
    var Data = {
        userInfo: req.user._id
    } 
    UserProfileFields.forEach((elem) => {
        if (req.body[elem]){
            Data[elem] = req.body[elem];
        }
    })
    if (req.body.dob) {
        Data.dob = new Date(req.body.dob);
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
}

module.exports = UserProfile;