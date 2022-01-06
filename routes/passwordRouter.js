const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('./cors');
const passwordController = require('../controllers/passwordController');



var authenticate = require('../controllers/authenticate');
router.use(bodyParser.json());

router.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.post('/forgotPassword', cors.cors, passwordController.forgotPassword);
  
// router.get('/forgotPassword', (req, res) => {
//   try{
//     Password.finbd({}).then((resp) => { res.status(200).json(resp) })
//   }
//   catch (err) {
//   errorHandler.LogError(err, req);
//   res.status(500).end("Internal Server error!")
//   }
// });
  
router.post('/resetPassword', cors.cors, passwordController.resetPassword);
router.post('/changePassword', cors.cors, authenticate.verifyUser, passwordController.changePassword);

/* Verify email using OTP. */
router.post('/getOtp', cors.cors, passwordController.getOTP);

// Test Route
// router.get('/getOtp', function(req, res, next) {
//   OTP.find({})
//   .then((otp) => {
//     res.statusCode = 200;
//     res.json(otp);
//   })
// })



module.exports = router;