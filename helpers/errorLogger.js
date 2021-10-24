var winston = require('winston');
require('winston-daily-rotate-file');
var { format } = require('winston');
var ErrorStackParser = require('error-stack-parser');
const { combine, timestamp, printf } = format;

var wistonLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  }

var transportInfo = new (winston.transports.DailyRotateFile)({
  level: 'info',
  filename: './logs/infolog-%DATE%.log',
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '1m',
});

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});


var logger = new (winston.createLogger)({
  levels: wistonLevels,
  format: combine(
      timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
      myFormat
    ),
    transports: [
      transportInfo
    ],
    exitOnError: false
});
exports.logger;

exports.stream = {
  write: function(message){
      logger.info(message);
  }
};

exports.LogError = (errorObj) => {
  errorObj = errorObj.originalError || errorObj
  if (errorObj.stack){
    error = errorObj.message;
    errorInfo = ErrorStackParser.parse(errorObj)[0];
    var err = `${errorObj.message} at columnNumber: ${errorInfo.columnNumber}, lineNumber: ${errorInfo.lineNumber} on filename ${errorInfo.fileName}${errorInfo.source}`
  logger.error(err);
  }
}




// for (i = 0; i<1500; i++){
//   logger.error(err);
//