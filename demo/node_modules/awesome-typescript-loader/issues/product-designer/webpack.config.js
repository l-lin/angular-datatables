const config = require('./config');
module.exports = require('./config/webpack/' + config.get('NODE_ENV'));
