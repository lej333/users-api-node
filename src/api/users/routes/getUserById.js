/**
 * Gets one existing user by its id.
 * Returns a complete user object without hashed password.
 */

const Users = require('../../../lib/data/users.service');
const Schema = require('../schemas/getUserById');
const Logger = require('../../../lib/logger');

module.exports = {
  path: '/users/{userId}',
  method: 'GET',
  config: {
    auth: 'jwt',
    description: 'Gets details of one user by its id',
    security: true,
    validate: Schema
  },
  handler: async function (request, h) {
    const auth = request.auth.credentials;
    const userId = request.params.userId;
    return Users.getById(auth, userId).then((user) => {
      return user;
    }).catch((err) => {
      Logger.logError(err, userId);
      return err;
    })
  }
};