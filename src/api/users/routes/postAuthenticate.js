/**
 * Authenticate an user by its username and password.
 * Returns user object, instead of hashed password it will return authorization token.
 */

const Users = require('../../../lib/data/users/users.service');
const Schema = require('../schemas/postAuthenticate');
const Logger = require('../../../lib/logger');

module.exports = {
  path: '/users/authenticate',
  method: 'POST',
  config: {
    auth: false,
    description: 'Validate user login based on its username and password',
    security: true,
    validate: Schema
  },
  handler: async function (request, h) {
    return Users.authenticate(request.payload.username, request.payload.password).then((user) => {
      return user;
    }).catch((err) => {
      Logger.logError(err);
      return err;
    });
  }
};