const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('./cors');
const passport = require('passport');
const signUpValidator = require('../validators/usersValidator').signUpValidator;
const userController = require('../controllers/userControlller');
const authenticate = require('../controllers/authenticate');

router.use(bodyParser.json());

/* GET users listing. */
//router.get('/getAllUsers',  authenticate.verifyUser, userController.get);

router.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.put('/', cors.cors, authenticate.verifyUser, userController.update);
router.get('/', cors.cors, authenticate.verifyUser, userController.getUserInfo);

// router.delete('/', function(req, res, next) {
//   User.remove({}, (err, users) => {
//     if (err) {
//       return next(err);
//     } else {
//       res.statusCode = 200;
//       res.setHeader('Content_type', 'application/json');
//       res.json(users);
//     }
//   })
// });

router.post('/signup', cors.cors, signUpValidator, userController.create);

router.post('/signin', cors.cors, passport.authenticate('local'), userController.signIn);

router.get('/signout', cors.cors, authenticate.verifyUser, userController.signOut);


module.exports = router;
