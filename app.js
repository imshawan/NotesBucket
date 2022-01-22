var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var chalk = require('chalk')

console.info(TimeStamp(), chalk.magentaBright("Starting up server..."))

var usersRouter = require('./routes/users');
var notesRouter = require('./routes/notesRoute');
var passwordRouter = require('./routes/passwordRouter');
var profileRouter = require('./routes/userProfileRouter');
var favouriteRouter = require('./routes/favouriteRouter');

const mongoose = require('mongoose');
const config = require('./config');
var logger = require('./helpers/errorLogger');
const connect = mongoose.connect(config.mongoUrl, {user: config.mongoUser, pass: String(config.mongoPass)})
connect.then((db) => {
  console.info(TimeStamp(), chalk.yellowBright("Established connection with the database!"));
}, (err) => {console.log(err)});

var app = express();

// // Logging using morgan
// var logStream = fs.createWriteStream(path.join(__dirname, '/logs/server.log'), {flags: 'a'});
app.set('trust proxy', true);
console.info(TimeStamp(), chalk.yellowBright("Trust Proxy enabled"))
app.use((req, res, next) => {
  // Set custom X-Powered-By header
  res.setHeader('X-Powered-By', 'NotesBucket');
  next();
})

// Making a custom logging pattern
morgan.token("custom", `:timestamp ${chalk.magentaBright(":remote-addr")} - ${chalk.greenBright.bold(":method")} :url ${chalk.yellowBright("HTTP/:http-version")} (:status)`);
morgan.token('remote-addr', (req, res) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
})
morgan.token('status', (req, res) => {
  if (res.statusCode > 400) return chalk.redBright.bold(res.statusCode)
  else return chalk.greenBright.bold(res.statusCode)
})
morgan.token('timestamp', () => {
  return TimeStamp()
})
app.use(morgan('custom'));
app.use(morgan("combined", { stream: logger.stream, skip: function (req, res) { return res.statusCode < 400 } }));
console.info(TimeStamp(), chalk.yellowBright("Loggings enabled"))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use('/changepassword', express.static(path.join(__dirname, 'changepassword')));
//app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/api/account', passwordRouter);
app.use('/api/user', usersRouter);
app.use('/api/notes', notesRouter);
app.use('/api/favourites', favouriteRouter);
app.use('/api/user/profile', profileRouter);
console.info(TimeStamp(), chalk.yellowBright("Routed added"))
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  // logger.info(`${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function TimeStamp() {
  return `[${new Date(Date.now()).toISOString()}]`
}

module.exports = app;
