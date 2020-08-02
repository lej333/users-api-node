const Winston = require('winston');

const Logger = Winston.createLogger({
  level: 'error',
  format: Winston.format.combine(
    Winston.format.timestamp(),
    Winston.format.json()
  ),
  transports: [
    new Winston.transports.File({
      filename: 'api.log'
    })
  ]
});

const logError = (message, id) => {
  if (!id) {
    message.id = id;
  }
  Logger.error(message);
}

module.exports = {
  logError
}