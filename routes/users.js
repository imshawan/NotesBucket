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
router.get('/',  authenticate.verifyUser, userController.get);

router.put('/',  authenticate.verifyUser, userController.update);

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
router.options('/*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.post('/signup', signUpValidator, userController.create);

router.post('/signin', passport.authenticate('local'), userController.signIn);

router.get('/signout', authenticate.verifyUser, userController.signOut);


module.exports = router;
