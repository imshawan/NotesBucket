var Parser = require('error-stack-parser')
const { transports, createLogger, format } = require('winston');

const logConfiguration = {
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({
            filename: 'logs/error.log'
        })
    ]
};
const logger = createLogger(logConfiguration);

exports.saveToLogs = (err) => {
    err = err.originalError || err
    if (err.stack == null) {
      return;
    }
    // Logs the error message
    logger.log({
        message: err.message,
        level: "info"
    });

    // Logs the error body (information and source)
    Parser.parse(err).map((errBody) => {
        logger.log({
                message: errBody,
                level: "info"
        });
    });
}