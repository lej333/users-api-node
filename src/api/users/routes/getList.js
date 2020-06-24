/**
 * Returns a list with all users registered in the application.
 * Only allowed for admin users.
 */

const Users = require('../../../lib/data/users/users.service');
const Logger = require('../../../lib/logger');

module.exports = {
  path: '/users',
  method: 'GET',
  config: {
    auth: 'jwt',
    description: 'Gets a list of all users',
    security: true
  },
  handler: async function (request, h) {
    const auth = request.auth.credentials;
    return Users.list(auth).then((list) => {
      return list;
    }).catch((err) => {
      Logger.logError(err);
      return err;
    });
  }
};