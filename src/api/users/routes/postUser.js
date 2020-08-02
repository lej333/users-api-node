/**
 * Adds a new user.
 * The password validation will be done in users.service class.
 * Returns complete user object with hash excluded.
 */

const Users = require('../../../lib/data/users.service');
const Schema = require('../schemas/postUser');
const Logger = require('../../../lib/logger');

module.exports = {
  path: '/users',
  method: 'POST',
  config: {
    auth: 'jwt',
    description: 'Creates a new user',
    security: true,
    validate: Schema
  },
  handler: async function (request, h) {
    const auth = request.auth.credentials;
    return Users.add(auth, request.payload).then((user) => {
      return user;
    }).catch((err) => {
      Logger.logError(err);
      return err;
    });
  }
};