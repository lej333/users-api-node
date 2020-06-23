/**
 * Standard endpoint to tell we are alive!
 * Doesn't require an authorization header.
 * Can be used by other services to check alive status of this api.
 */
const Config = require('../../../lib/config');
const Package = require('../../../../package.json');

module.exports = {
  path: '/',
  method: 'GET',
  config: {
    auth: false,
    description: 'Are we alive?',
    security: true
  },
  handler: function (request, h) {
    return `${Config.application.name} v${Package.version} is at your servers!`;
  }
};